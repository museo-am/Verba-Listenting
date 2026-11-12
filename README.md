# Verba School Listenings

Spanish listening practice from A1 to C1. Each lesson has a text read aloud, a transcript you can hide, a 5-question comprehension quiz and a short vocabulary list.

Live site: https://museo-am.github.io/Verba-Listenting/

## How it works
- Everything is in `index.html`. Lessons are in the `LESSONS` array at the top of the script.
- Audio uses natural neural voices (Elvira and Álvaro from Spain, Dalia from Mexico), one MP3 per sentence in `audio/`.
- The **Generate natural voices** workflow creates them automatically whenever `index.html` changes. New lessons get audio a few minutes after you push.
- If a file is missing, the page falls back to the device's own Spanish voice.

## Adding a lesson
Copy one object in `LESSONS` and change `id`, `level`, `title`, `topic`, `summary`, `text` (paragraphs), `gloss` (word, translation) and `q` (question, 4 options, index of the correct option).
