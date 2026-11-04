# Português Quest

A mobile-first European Portuguese practice game for Polish-speaking learners. Built with React, TypeScript and Vite. Progress is stored locally in IndexedDB; no account, server, API key or paid service is used.

## Run locally

1. Install Node.js 20.19+ (or 22.12+).
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL shown in the terminal.
4. Run `npm test` for the automated checks. Run `npm run build` for a production build.

## Practice modes and content

- Fill the gap: 50 contextual verb prompts, typed or multiple choice.
- Choose the tense: 31 prompts that ask learners to choose the tense or mood from context.
- Conversation: 19 dialogue turns across six everyday situations, including a recovery branch.
- Speed round: timed 30- or 60-second rounds using the fill-the-gap bank.
- Translation: 24 complete Polish-to-Portuguese sentence tasks.
- Error repair: 24 sentences to correct or confirm.

There are 148 distinct content decisions. Speed rounds reuse the 50 gap prompts, so they are not counted as a separate bank. The intended 300-item target has not been reached; adding another 152 distinct items remains future work.

## Progress features

Practice sessions can run for 5, 10 or 20 minutes, or without a timer. Speed rounds use a real countdown. A 24-question diagnostic records strongest and weakest concepts; later practice can favor weaker concepts. Review scheduling uses a simple SM-2-style interval rule with quicker retries after incorrect answers. XP, streaks, achievements, mastery-based map chapters, five-question regional challenges, a searchable verb library, and local progress history are included.

Portuguese accents are checked. An answer that differs only by diacritics is marked “almost” and does not receive full credit. Five irregular verb tables are included: ser, estar, ter, ir and fazer.

## Progress and backups

Progress is stored separately in each browser/device. Use **Ustawienia → Eksportuj postępy** for a JSON backup and **Importuj postępy** to restore it on another device. Import replaces the current local save. Clearing browser data or using private browsing may remove progress. Existing IndexedDB saves are migrated to the current schema when opened.

## Deploy with GitHub and Netlify

1. Create a GitHub repository and upload the contents of this folder.
2. In Netlify choose **Add new site → Import an existing project** and connect the repository.
3. Use build command `npm run build` and publish directory `dist`. `netlify.toml` configures these values and SPA routing.
4. Deploy. Netlify provides the live URL; later commits to the connected branch deploy automatically.
5. On iPhone, open the URL in Safari, tap **Share → Add to Home Screen**.

The project has automated unit and content-bank checks. Browser-based visual inspection must still be completed after running it in a browser environment that can reach the development server.
