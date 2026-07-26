# Page Pulse API

Production-grade URL audit service for Digital Heroes SDE Task A.

Page Pulse accepts a public HTTP/HTTPS URL, fetches the page with timeout and SSRF protections, parses basic SEO/page metadata, caches repeat audits, and returns a structured JSON response with a request ID.

## Features

- URL validation with Zod
- SSRF checks for localhost, private IP ranges, DNS-resolved private targets, and redirects
- Request timeout and redirect limit
- Concurrency limiting for outbound audits
- Redis cache with configurable TTL
- Per-client rate limiting
- Structured Pino logging with request IDs
- Consistent error response contract
- Vitest/Supertest test suite
- GitHub Actions CI

## Environment

Create `.env`:

```bash
PORT=3000
REDIS_URL=redis://localhost:6379
CACHE_TTL=300
REQUEST_TIMEOUT=5000
MAX_CONCURRENT_REQUESTS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
LOG_LEVEL=info
```

## Run Locally

```bash
npm install
npm run dev
```

The API runs on `http://localhost:3000` by default.

## Test And Lint

```bash
npm test
npm run lint
```

## API Contract

### Health

`GET /health`

```json
{
  "success": true,
  "uptime": 123,
  "timestamp": "2026-07-25T12:22:18.000Z",
  "memory": {},
  "status": "healthy"
}
```

### Audit Website

`POST /api/v1/audit`

Request:

```json
{
  "url": "https://openai.com"
}
```

Success:

```json
{
  "success": true,
  "requestId": "a3b6...",
  "cached": false,
  "data": {
    "url": "https://openai.com",
    "status": 200,
    "responseTime": 154,
    "pageSize": 312842,
    "timestamp": "2026-07-25T12:22:18.000Z",
    "title": "OpenAI",
    "description": "Artificial Intelligence",
    "h1": "OpenAI",
    "images": 16,
    "links": 54
  }
}
```

Validation error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body"
  }
}
```

Timeout:

```json
{
  "success": false,
  "requestId": "a3b6...",
  "error": {
    "code": "TIMEOUT",
    "message": "Remote server exceeded timeout"
  }
}
```

Fetch failure:

```json
{
  "success": false,
  "requestId": "a3b6...",
  "error": {
    "code": "FETCH_FAILED",
    "message": "Unable to fetch target URL"
  }
}
```

Rate limit:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT",
    "message": "Too many requests"
  }
}
```

## Deployment Notes

Deploy the API to a Node-capable host with Redis available, then set the client `NEXT_PUBLIC_API_URL` to the deployed API origin.

Before submitting, add the final public GitHub repository URL and live deployed URL to the root README.

## AI Usage

AI was used to pressure-test the architecture, identify production-readiness gaps, and improve edge-case handling around startup, CI, Redis, and SSRF protection. I reviewed and adjusted the final code, tests, and documentation to match the assignment requirements and project structure.
