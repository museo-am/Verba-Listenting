# Verba School Listenings

Spanish listening practice from A1 to C1. Each lesson has a text read aloud, a transcript you can hide, a 5-question comprehension quiz and a short vocabulary list.

Live site: https://museo-am.github.io/Verba-Listenting/

## How it works
- **Recordings (main voice):** one file per text in `audio/full/<lesson-id>.mp3` plus a `.json` with each sentence's start time. Upload a `.wav` or `.mp3` named after the lesson id into `audio/full/` and the **Prepare recordings** workflow converts it and syncs the highlighting to the pauses.
- Everything is in `index.html`. Lessons are in the `LESSONS` array at the top of the script.
- **Gemini voices (best):** Kore and Charon, one MP3 per paragraph in `audio/g-*/`, read slower and clearer for A1–A2 and at native pace for B2–C1. Made by the **Generate Gemini voices** workflow using the `GEMINI_API_KEY` repository secret. It runs on every change to `index.html` and once a day, so if the free quota runs out it continues the next day.
- **Neural voices (backup):** Elvira, Álvaro and Dalia, one MP3 per sentence in `audio/<voice>/`, made by **Generate natural voices**.
- If no MP3 exists yet, the page uses the next available voice, ending with the device's own Spanish voice.

### Turning on Gemini voices
1. Get a free key at https://aistudio.google.com/apikey
2. Repo **Settings → Secrets and variables → Actions → New repository secret**. Name: `GEMINI_API_KEY`, value: your key.
3. **Actions → Generate Gemini voices → Run workflow.**

## Adding a lesson
Copy one object in `LESSONS` and change `id`, `level`, `title`, `topic`, `summary`, `text` (paragraphs), `gloss` (word, translation) and `q` (question, 4 options, index of the correct option).
