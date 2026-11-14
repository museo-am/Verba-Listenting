"""Prepare full-text recordings: audio/full/<lesson-id>.(wav|mp3) -> <id>.mp3 + <id>.json

The JSON holds the start time of every sentence so the page can highlight along.
Sentence boundaries are found by matching the recording's pauses to the text:
dynamic programming picks the pauses that make each sentence's length closest
to its share of the characters, preferring longer pauses.

Usage: python3 tools/align.py            # every recording without an up-to-date JSON
       python3 tools/align.py ID FILE    # one recording from any path
"""
import json, os, re, subprocess, sys

def lessons():
    out = subprocess.run(["node", "-e", r'''
const fs=require("fs");const h=fs.readFileSync("index.html","utf8");
const src=h.slice(h.indexOf("const LESSONS"),h.indexOf("const LEVELS"));
const {LESSONS,splitSentences}=new Function(src+";return {LESSONS,splitSentences};")();
console.log(JSON.stringify(Object.fromEntries(LESSONS.map(l=>[l.id,l.text.map(p=>splitSentences(p))])))) '''],
        capture_output=True, text=True, check=True).stdout
    return json.loads(out)

def duration(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                                capture_output=True, text=True, check=True).stdout.strip())

def pauses(path, noise="-35dB", min_d=0.18):
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", f"silencedetect=noise={noise}:d={min_d}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    return list(zip(starts, ends + [None] * (len(starts) - len(ends))))

def align(path, paras):
    sents = [(s, pi) for pi, p in enumerate(paras) for s in p]
    n = len(sents)
    total = duration(path)
    sil = pauses(path)
    speech_start, speech_end = 0.0, total
    if sil and sil[0][0] <= 0.05 and sil[0][1]:
        speech_start = sil[0][1]; sil = sil[1:]
    if sil and (sil[-1][1] is None or sil[-1][1] >= total - 0.05):
        speech_end = sil[-1][0]; sil = sil[:-1]
    cands = [(a, b) for a, b in sil if b is not None and speech_start < a and b < speech_end]
    if n == 1:
        return [round(speech_start, 3)], total, 1.0
    if len(cands) < n - 1:
        raise SystemExit(f"{path}: only {len(cands)} pauses for {n} sentences; record with a short pause after each sentence")
    chars = [len(s) for s, _ in sents]
    span = speech_end - speech_start
    expect = [span * c / sum(chars) for c in chars]
    # boundary k (0..n-2) sits between sentence k and k+1; paragraph ends deserve longer pauses
    para_end = [sents[k][1] != sents[k + 1][1] for k in range(n - 1)]
    pts = [speech_start] + [(a + b) / 2 for a, b in cands] + [speech_end]
    plen = [0] + [b - a for a, b in cands] + [0]
    M = len(pts)
    INF = float("inf")
    # dp[k][j]: best cost with sentence k ending at point j
    dp = [[INF] * M for _ in range(n)]; back = [[-1] * M for _ in range(n)]
    def seg_cost(k, i, j):
        d = pts[j] - pts[i]; e = expect[k]
        c = ((d - e) / max(e, 0.6)) ** 2
        if k < n - 1:
            c -= (2.5 if para_end[k] else 1.5) * min(plen[j], 1.5)
        return c
    for j in range(1, M - 1):
        dp[0][j] = seg_cost(0, 0, j)
    for k in range(1, n):
        for j in range(k + 1, M):
            if k < n - 1 and j == M - 1: continue
            if k == n - 1 and j != M - 1: continue
            best, arg = INF, -1
            for i in range(k, j):
                if dp[k - 1][i] == INF: continue
                v = dp[k - 1][i] + seg_cost(k, i, j)
                if v < best: best, arg = v, i
            dp[k][j], back[k][j] = best, arg
    j = M - 1; ends = []
    for k in range(n - 1, -1, -1):
        ends.append(j); j = back[k][j]
    ends.reverse()
    starts = [speech_start] + [cands[e - 1][1] - 0.05 for e in ends[:-1]]
    # quality: how far actual sentence lengths stray from expectations (1.0 = perfect)
    lens = [pts[ends[0]] - speech_start] + [pts[ends[k]] - pts[ends[k - 1]] for k in range(1, n)]
    fit = sum(min(l, e) / max(l, e) for l, e in zip(lens, expect)) / n
    return [round(max(0, s), 3) for s in starts], total, fit

def process(lid, src, all_lessons):
    os.makedirs("audio/full", exist_ok=True)
    mp3 = f"audio/full/{lid}.mp3"
    if os.path.abspath(src) != os.path.abspath(mp3):
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "96k", mp3], check=True)
    starts, total, fit = align(mp3, all_lessons[lid])
    with open(f"audio/full/{lid}.json", "w") as f:
        json.dump({"duration": round(total, 3), "starts": starts}, f)
    print(f"{lid}: {len(starts)} sentences, {total:.1f}s, fit {fit:.2f}")
    return starts, fit

def main():
    all_lessons = lessons()
    if len(sys.argv) == 3:
        lid, src = sys.argv[1], sys.argv[2]
        if lid not in all_lessons: raise SystemExit(f"unknown lesson id {lid}; known: {', '.join(all_lessons)}")
        process(lid, src, all_lessons); return
    for lid in all_lessons:
        srcs = [f"audio/full/{lid}.{ext}" for ext in ("wav", "m4a", "ogg", "flac")]
        src = next((s for s in srcs if os.path.exists(s)), None)
        mp3, js = f"audio/full/{lid}.mp3", f"audio/full/{lid}.json"
        if src:
            process(lid, src, all_lessons); os.remove(src)
        elif os.path.exists(mp3) and (not os.path.exists(js) or os.path.getmtime(js) < os.path.getmtime(mp3)):
            process(lid, mp3, all_lessons)

if __name__ == "__main__":
    main()
