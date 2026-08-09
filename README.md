<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6de3747a-d6f3-402f-bca6-08f139fb6d38

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

Persistence note (SQLite-backed storage):

- The server now uses a local SQLite database file `reports.db` in the project root to persist user-submitted complaints. This makes reports survive restarts and is more reliable than a single JSON file.
- Install the native dependency before running: `npm install` (this will install `better-sqlite3`). On some systems building the native addon requires Python and build tools (see better-sqlite3 docs if install fails).
- To reset stored complaints: stop the server, delete `reports.db`, and restart the app.

Admin & Auth:

- ADMIN_TOKEN: set an environment variable ADMIN_TOKEN for a simple admin bearer token used by admin endpoints (or authenticate with a JWT that has isAdmin: true). If not set, a default dev token 'admin-token-dev' is used (change for production).
- JWT_SECRET: set JWT_SECRET to a strong secret for user tokens. If absent a dev secret is used.

Available admin endpoints (require admin bearer token):
- GET  /api/admin/export       -> export all reports as JSON
- POST /api/admin/import       -> import reports JSON { reports: [...], replace: true }
- POST /api/admin/backup       -> create a timestamped DB backup in backups/ and return filename
- POST /api/admin/vacuum       -> run SQLite VACUUM to compact the DB

Auth endpoints:
- POST /api/auth/register { name, email, password } -> returns { id, name, email, token }
- POST /api/auth/login    { email, password } -> returns { id, name, email, token }

- Submitters who authenticate with the returned token will have their citizenId and citizenName attached to created reports automatically.

