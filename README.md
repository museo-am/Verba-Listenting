# Verba School Listenings

Spanish listening practice from A1 to C1. Each lesson has a text read aloud, a transcript you can hide, a 5-question comprehension quiz and a short vocabulary list.

Live site: https://museo-am.github.io/Verba-Listenting/

## How it works
- Everything is in `index.html`. Lessons are in the `LESSONS` array at the top of the script.
- Audio uses the browser's built-in Spanish voice (best in Chrome, Edge or Safari).

## Adding a lesson
Copy one object in `LESSONS` and change `id`, `level`, `title`, `topic`, `summary`, `text` (paragraphs), `gloss` (word, translation) and `q` (question, 4 options, index of the correct option).
