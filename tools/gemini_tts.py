"""Generate Gemini TTS audio for every paragraph that does not have an MP3 yet.

Env:
  GEMINI_API_KEY   required (AI Studio key)
  GEMINI_MODELS    optional, comma list tried in order
  GEMINI_BASE      optional API base (used for local testing)
Writes audio/g-<voice id>/<hash>.mp3. Stops cleanly when the daily quota runs out,
so the next scheduled run continues where this one stopped.
"""
import base64, json, os, subprocess, sys, tempfile, time, urllib.error, urllib.request

VOICES = {"kore": "Kore", "charon": "Charon"}
MODELS = [m.strip() for m in os.environ.get(
    "GEMINI_MODELS", "gemini-3.8-flash-tts,gemini-3.1-flash-tts-preview,gemini-2.5-flash-preview-tts").split(",") if m.strip()]
BASE = os.environ.get("GEMINI_BASE", "https://generativelanguage.googleapis.com/v1beta").rstrip("/")
KEY = os.environ.get("GEMINI_API_KEY", "")
PAUSE = float(os.environ.get("GEMINI_PAUSE", "7"))   # seconds between requests (free tier is a few per minute)

STYLE = {
    "A1": "ritmo lento, pronunciación muy clara y pausas naturales entre frases, como un profesor leyendo para principiantes",
    "A2": "ritmo tranquilo y pronunciación clara, como un profesor leyendo para estudiantes de nivel básico",
    "B1": "ritmo moderado y natural, entonación expresiva",
    "B2": "ritmo natural de conversación, entonación expresiva",
    "C1": "ritmo natural de un hablante nativo, tono reflexivo y expresivo",
}
def style_for(level):
    return ("Lee en voz alta en español de España (castellano), con voz cálida y humana; "
            + STYLE.get(level, STYLE["B1"]) + ".")

class Quota(Exception): pass
class Unsupported(Exception): pass

def post(url, body):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST",
                                 headers={"Content-Type": "application/json", "x-goog-api-key": KEY})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        msg = e.read().decode("utf-8", "replace")[:600]
        if e.code == 429:
            raise Quota(msg)
        if e.code in (400, 404) :
            raise Unsupported(f"{e.code}: {msg}")
        raise RuntimeError(f"{e.code}: {msg}")

def find_audio(obj):
    """Return (bytes, mime) for the last audio payload anywhere in a response."""
    found = []
    def walk(o):
        if isinstance(o, dict):
            inline = o.get("inlineData") or o.get("inline_data")
            if isinstance(inline, dict) and inline.get("data"):
                found.append((inline["data"], inline.get("mimeType") or inline.get("mime_type") or ""))
            elif o.get("type") == "audio" and isinstance(o.get("data"), str):
                found.append((o["data"], o.get("mime_type") or o.get("mimeType") or ""))
            for v in o.values(): walk(v)
        elif isinstance(o, list):
            for v in o: walk(v)
    walk(obj)
    if not found:
        raise RuntimeError("no audio in response: " + json.dumps(obj)[:400])
    data, mime = found[-1]
    return base64.b64decode(data), mime

def via_interactions(model, voice, text, style):
    body = {"model": model,
            "input": [{"type": "user_input", "content": [{"type": "text", "text": text,
                       "annotations": [{"type": "speech_metadata", "style": style}]}]}],
            "response_format": {"type": "audio"},
            "generation_config": {"speech_config": [{"voice": voice}]}}
    return find_audio(post(f"{BASE}/interactions", body))

def via_generate(model, voice, text, style):
    body = {"contents": [{"parts": [{"text": f"{style}\n\n{text}"}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
    return find_audio(post(f"{BASE}/models/{model}:generateContent", body))

working = None   # (model, function) once one combination succeeds
def synth(voice, text, level):
    global working
    style = style_for(level)
    combos = [working] if working else [(m, f) for m in MODELS for f in (via_interactions, via_generate)]
    last = None
    for model, fn in combos:
        try:
            out = fn(model, voice, text, style)
            if working is None:
                print(f"using {model} via {fn.__name__}", flush=True)
            working = (model, fn)
            return out
        except Unsupported as e:
            last = e
            print(f"  {model} via {fn.__name__} not usable: {str(e)[:160]}", flush=True)
            if working: working = None; return synth(voice, text, level)
    raise RuntimeError(f"no model worked; last error: {last}")

def to_mp3(raw, mime, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".bin", delete=False) as t:
        t.write(raw); src = t.name
    is_wav = raw[:4] == b"RIFF"
    rate = "24000"
    if "rate=" in mime:
        rate = mime.split("rate=")[1].split(";")[0].strip() or rate
    inp = ["-i", src] if is_wav else ["-f", "s16le", "-ar", rate, "-ac", "1", "-i", src]
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inp, "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "64k", path], check=True)
    os.unlink(src)

def main():
    if not KEY:
        print("GEMINI_API_KEY is not set; add it under Settings → Secrets and variables → Actions."); return 0
    items = [json.loads(l) for l in subprocess.run(["node", "tools/paragraphs.js"], capture_output=True, text=True, check=True).stdout.splitlines() if l.strip()]
    todo = [(vid, vname, it) for vid, vname in VOICES.items() for it in items
            if not os.path.exists(f"audio/g-{vid}/{it['hash']}.mp3")]
    print(f"{len(items)} paragraphs, {len(todo)} files to make", flush=True)
    made, strikes = 0, 0
    for vid, vname, it in todo:
        path = f"audio/g-{vid}/{it['hash']}.mp3"
        for attempt in range(4):
            try:
                raw, mime = synth(vname, it["text"], it["level"])
                to_mp3(raw, mime, path); made += 1; strikes = 0
                print(f"  ok {path}", flush=True)
                break
            except Quota as e:
                strikes += 1
                wait = 65 * (attempt + 1)
                print(f"  rate limited ({strikes}), waiting {wait}s: {str(e)[:120]}", flush=True)
                if strikes >= 4:
                    print(f"Quota used up for now. Made {made} files; the next run continues.", flush=True); return 0
                time.sleep(wait)
            except Exception as e:
                print(f"  failed {path}: {str(e)[:200]}", flush=True)
                time.sleep(5)
        time.sleep(PAUSE)
    print(f"done, made {made} files", flush=True)
    return 0

if __name__ == "__main__":
    sys.exit(main())
