"""Prepare a recording: any audio file -> private/audio/<lesson-id>.mp3 + <id>.json

The JSON holds the start time of every sentence so the page can highlight along.
Sentence boundaries are found by matching the recording's pauses to the text:
dynamic programming picks the pauses that make each sentence's length closest
to its share of the characters, preferring longer pauses.

Usage: python3 tools/align.py LESSON_ID RECORDING_FILE
Then run tools/build.mjs to encrypt it for the site.
"""
import json, os, re, subprocess, sys

LESSONS_FILE = "private/lessons.json"
AUDIO_DIR = "private/audio"

def split(p):
    # must match splitSentences in tools/build.mjs
    parts = [t.strip() for t in re.findall(r"[^.!?¿¡]*[¿¡]?[^.!?]*[.!?]+", p)]
    parts = [t for t in parts if t]
    return parts or [p.strip()]

def lessons():
    with open(LESSONS_FILE) as f:
        return {l["id"]: [split(p) for p in l["text"]] for l in json.load(f)}

def duration(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                                capture_output=True, text=True, check=True).stdout.strip())

def pauses(path, noise="-35dB", min_d=0.18):
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", f"silencedetect=noise={noise}:d={min_d}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    return list(zip(starts, ends + [None] * (len(starts) - len(ends))))

def dips(path, t0, t1, taken, want, hop=0.01):
    """Quietest short moments (local loudness minima) between t0 and t1, away from known pauses."""
    import numpy as np
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
    w = int(16000 * hop)
    e = np.sqrt(np.convolve(x[: len(x) // w * w].reshape(-1, w).astype(np.float64).__pow__(2).mean(1), np.ones(8) / 8, mode="same"))
    out = []
    for i in np.argsort(e):
        t = i * hop
        if not (t0 + 0.3 < t < t1 - 0.3): continue
        if any(a - 0.35 < t < b + 0.35 for a, b in taken + out): continue
        if not (e[max(0, i - 8):i + 9].min() >= e[i]): continue
        out.append((t - 0.02, t + 0.02))
        if len(out) >= want: break
    return out

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
        # fast readers sometimes leave no real silence between sentences: add the deepest dips in loudness
        extra = dips(path, speech_start, speech_end, cands, want=2 * (n - 1 - len(cands)) + 4)
        cands = sorted(cands + extra)
        print(f"  note: only {len(cands) - len(extra)} clear pauses; added {len(extra)} quieter moments")
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
    os.makedirs(AUDIO_DIR, exist_ok=True)
    mp3 = f"{AUDIO_DIR}/{lid}.mp3"
    if os.path.abspath(src) != os.path.abspath(mp3):
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "96k", mp3], check=True)
    starts, total, fit = align(mp3, all_lessons[lid])
    with open(f"{AUDIO_DIR}/{lid}.json", "w") as f:
        json.dump({"duration": round(total, 3), "starts": starts}, f)
    print(f"{lid}: {len(starts)} sentences, {total:.1f}s, fit {fit:.2f}")
    return starts, fit

def main():
    if len(sys.argv) != 3:
        raise SystemExit("usage: python3 tools/align.py LESSON_ID RECORDING_FILE")
    all_lessons = lessons()
    lid, src = sys.argv[1], sys.argv[2]
    if lid not in all_lessons:
        raise SystemExit(f"unknown lesson id {lid}; known: {', '.join(all_lessons)}")
    process(lid, src, all_lessons)

if __name__ == "__main__":
    main()
