# Verba School Listenings

Live at **https://verba-school.online** (GitHub Pages custom domain, see `CNAME`). Pages must be served over HTTPS: the browser only allows the decryption over a secure connection.

Spanish listening practice from A1 to C1: a recording or device voice, a transcript you can hide, a comprehension quiz and vocabulary.

- **Students:** https://verba-school.online/ opens nothing on its own. Each listening opens only from a link the tutor sends.
- **Tutor panel:** https://verba-school.online/admin.html (username + password; each tutor sees only their own listenings and tests), in English, Armenian or Spanish. Two sections: **Listenings** and **Tests**, each item with **Copy link**, **Open** and **New link**.

## How access works
Every listening is encrypted (AES-256-GCM) with its own key. A student link looks like `verba-school.online/#lucia-k7pq-2xma-9wrt`: a short name and a 12-letter code (no look-alike characters) that opens only that one listening. The code is stretched with PBKDF2 into the AES key. Old long links (`#<lesson-id>~<key>`) still work: they open a small pointer and the page switches to the short link. The part after `#` never reaches the server.

Each tutor has a profile, `tutors/<username>.json`, holding their own master secret and lesson list, encrypted with their password. Usernames and passwords live in `private/tutors.json`; lessons and tests carry an `owner` (default: the first tutor). Profiles: Margarita (Spanish) and Manushak (French). Each lesson and test has a `lang` (or takes the tutor's `language`), and the student page shows its buttons and messages in that language (Spanish or French). To add a tutor, add a line to `private/tutors.json`, give their lessons `"owner": "<username>"`, and run the build.

Limits of a site with no server:
- Anyone who has a link can open that listening, so links should go only to the student.
- There is one link per listening. **Nuevo enlace** in the tutor panel cancels it for everyone who has it and creates a new one: it raises the lesson's version, re-encrypts that lesson and commits the change through the GitHub API. The new link works once GitHub Pages publishes (1–2 minutes).
- The first time, the panel asks for a GitHub fine-grained token with **Contents: Read and write** on this repository only. It is stored inside the tutor's profile file, encrypted with their password.
- `tools/build.mjs` keeps the higher version and the saved token, so a rebuild never brings back an old link.

## Public pages and SEO
The landing page exists in four languages: `/` (Armenian), `/en/`, `/es/`, `/ru/`. Text lives in `tools/site-strings.json`, layout in `tools/landing.html`; `tools/site.mjs` (run by the build) writes the pages with their title, description, canonical and hreflang tags, schema.org data (school, courses, prices), `sitemap.xml` and `robots.txt`. The Armenian page shares `index.html` with the student player: student links hide the landing before it paints.

## Word translations
Students press and hold any word in a transcript to see its base form and Armenian translation. Translations live in `private/dict/es.json` and `fr.json` (word form → [base form, Armenian]); `private/dict/overrides.json` gives a different meaning for a word in one lesson. The build adds each lesson's words to its encrypted file and lists any word that has no translation yet.

## Level tests
`private/tests.json` holds the A1 and A2 level tests: 20 grammar and vocabulary questions plus a reading text with 5 questions, pass mark 70%. Write each question's correct option first; the build shuffles the options with a fixed seed. Students enter their name, take the test, see whether they passed, can review their answers, and copy a result summary to send to the tutor. Results stay in the student's browser; there is no server that collects them.

## Files
- `index.html`: student player. `admin.html`: tutor panel. `style.css`: shared styles.
- `c/<short>.bin`: encrypted lesson text, questions and sentence timings.
- `a/<short>.bin`: encrypted recording.
- `content/<id>.bin`: pointer that forwards an old long link to the short one.

Every lesson and test in `private/lessons.json` / `private/tests.json` needs a unique `short` name (a-z, 0-9, -).
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

## Public SEO pages

`tools/site.mjs` also builds, from `tools/pages.mjs` and `tools/content/*.mjs`, in Armenian, Russian and English:
- course pages (`/ispaneren/`, `/ru/ispanskiy/`, `/en/spanish/`, … for Spanish, English and French),
- free 20-question placement tests (`/test/…`), separate from the tutors' private level tests,
- the blog (`/blog/`, `/ru/blog/`, `/en/blog/`) with four articles.
Shared header/footer: `tools/page.html`; shared script: `site.js`. Every page is in `sitemap.xml` with hreflang alternates.

Search and AI-search files (all generated by `tools/site.mjs`, don't edit by hand):
- `sitemap.xml`: every public page with hreflang alternates; `lastmod` comes from `tools/lastmod.json`, a fingerprint of each page's visible text, so a date only moves when that page's text changes.
- `robots.txt`: search engines and AI search/answer crawlers (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot…) are named and allowed; model-training crawlers (GPTBot, ClaudeBot, Google-Extended…) fall under the general `*` rules. To block training, add e.g. `User-agent: GPTBot` / `Disallow: /`.
- `llms.txt`: plain summary of the school for AI assistants, built from the same facts as the pages (prices, levels, courses, FAQ, articles).
- Home-page FAQ (`tools/content/faq.mjs`, shown on all four home pages and marked up as FAQPage): only facts already stated on the site.
- `404.html`: noindex page in Armenian, Russian and English with links back to the site.
