# Verba School Listenings

Live at **https://verba-school.online** (GitHub Pages custom domain, see `CNAME`). Pages must be served over HTTPS: the browser only allows the decryption over a secure connection.

Spanish listening practice from A1 to C1: a recording or device voice, a transcript you can hide, a comprehension quiz and vocabulary.

- **Students:** https://verba-school.online/ opens nothing on its own. Each listening opens only from a link the tutor sends.
- **Tutor panel:** https://verba-school.online/admin.html (username + password; each tutor sees only their own listenings and tests), in English, Armenian or Spanish. Two sections: **Listenings** and **Tests**, each item with **Copy link**, **Open** and **New link**.

## How access works
Every listening is encrypted (AES-256-GCM) with its own key. A student link ends in `#<lesson-id>~<key>`, and that key opens only that one listening. The part after `#` never reaches the server.

Each tutor has a profile, `tutors/<username>.json`, holding their own master secret and lesson list, encrypted with their password. Usernames and passwords live in `private/tutors.json`; lessons and tests carry an `owner` (default: the first tutor). Profiles: Margarita (Spanish) and Manushak (French). Each lesson and test has a `lang` (or takes the tutor's `language`), and the student page shows its buttons and messages in that language (Spanish or French). To add a tutor, add a line to `private/tutors.json`, give their lessons `"owner": "<username>"`, and run the build.

Limits of a site with no server:
- Anyone who has a link can open that listening, so links should go only to the student.
- There is one link per listening. **Nuevo enlace** in the tutor panel cancels it for everyone who has it and creates a new one: it raises the lesson's version, re-encrypts that lesson and commits the change through the GitHub API. The new link works once GitHub Pages publishes (1–2 minutes).
- The first time, the panel asks for a GitHub fine-grained token with **Contents: Read and write** on this repository only. It is stored inside the tutor's profile file, encrypted with their password.
- `tools/build.mjs` keeps the higher version and the saved token, so a rebuild never brings back an old link.

## Level tests
`private/tests.json` holds the A1 and A2 level tests: 20 grammar and vocabulary questions plus a reading text with 5 questions, pass mark 70%. Write each question's correct option first; the build shuffles the options with a fixed seed. Students enter their name, take the test, see whether they passed, can review their answers, and copy a result summary to send to the tutor. Results stay in the student's browser; there is no server that collects them.

## Files
- `index.html`: student player. `admin.html`: tutor panel. `style.css`: shared styles.
- `content/<id>.bin`: encrypted lesson text, questions and sentence timings.
- `audio/<id>.bin`: encrypted recording.
- `tutors/<username>.json`: each tutor's encrypted master secret and lesson list.
- `tools/align.py`: finds where each sentence starts in a recording.
- `tools/build.mjs`: encrypts everything in `private/` into the files above.

The lesson texts and original recordings live in `private/`, which is never committed. Keep a backup of it.

## Adding a recording or lesson
```
python3 tools/align.py <lesson-id> <recording.wav>          # → private/audio/<id>.mp3 + .json
node tools/build.mjs                                         # encrypt (passwords come from private/tutors.json)
git add -A && git commit -m "Update lessons" && git push
```
New lessons go in `private/lessons.json` with the same fields as the others (`id`, `v`, `level`, `title`, `topic`, `summary`, `narrator` "f" or "m", `text` paragraphs, `gloss`, `q`).
