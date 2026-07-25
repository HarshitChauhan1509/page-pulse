# Page Pulse

Production-grade URL audit service built for **Digital Heroes SDE Task A**.

The project has two parts:

- `server` - Express API for validating, fetching, caching, and auditing URLs
- `client` - Next.js frontend for submitting audits and displaying results

## Submission Links

- Live URL: add your deployed frontend URL here
- API URL: add your deployed backend URL here
- GitHub repository: add your public repository URL here

## Run Locally

Start Redis locally, then run the API:

```bash
cd server
npm install
npm run dev
```

Run the frontend:

```bash
cd client
npm install
npm run dev
```

Set `client/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Verification

Backend:

```bash
cd server
npm test
npm run lint
```

Frontend:

```bash
cd client
npm run lint
npm run build
```

## API

See `server/README.md` for the full API contract.

## Digital Heroes Credit

The frontend footer includes the required visible credit line:

`Built for Digital Heroes Training Task`

The credit links to `https://digitalheroesco.com`.
