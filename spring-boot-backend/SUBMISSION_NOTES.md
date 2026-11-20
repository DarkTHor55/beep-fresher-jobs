# Beep Fresher Jobs: submission notes

## Architecture

- Spring Boot fetches listings from JobsPipe, JSearch, and Jooble.
- `JobFilter` keeps India/fresher-oriented listings; `JobKeys` deduplicates by normalized listing URL and company/title/location.
- Accepted jobs are stored in a persistent H2 file database and exposed through the paginated `/api/jobs` endpoint.
- `GeminiJobTagger` sends batches of up to 40 public listings to Gemini Flash-Lite and requests structured role/city tags. Heuristic tagging is the fallback when the key is absent or a batch fails.
- Spring's scheduled refresh runs daily at 5:00 AM Asia/Kolkata while the backend process is running.
- The React/Vite frontend reads the API with TanStack Query and provides search, role/city filters, job detail, and pagination.

## What broke and what changed

- The frontend previously called React Query hooks without a `QueryClientProvider`; the app entry now wraps the app in the provider.
- API URLs had inconsistent `/api` prefixes and local ports; backend runs on port 28081 and the Vite dev proxy points to it.
- The daily refresh schedule is configured explicitly for 5:00 AM India time.
- Gemini tagging results were being fetched but not applied to persisted jobs. Role/city fields now use the AI result when available, and token usage is stored on each job.
- Provider and LLM credentials are read from environment variables so they are not committed in `application.properties`.

## LLM and cost

- Model: `gemini-3.5-flash-lite` through the Gemini Developer API.
- Prompt: classify each untrusted public listing's title, location, and short description into one allowed role and one allowed Indian city; normalize Bangalore to Bengaluru and Gurgaon/Gurugram/Noida/Delhi to Delhi NCR; return schema-constrained JSON; use `Unknown` when the city is not stated.
- Cost: Google currently lists a free tier for Gemini API usage, subject to project/account quotas. If usage remains within that tier, the model charge for 1,000 listings is ₹0; over-quota or paid-tier charges are not included. The backend logs input/output tokens so actual usage can be measured after a keyed run.
- Free-tier data-use terms and quotas should be checked in the Google AI Studio project. The prompt sends public listing text only.

## Validation status (20 November 2026)

- Backend Maven package: successful.
- Frontend production build: successful.
- Local API currently returns 99 jobs, so the 200+ target is not met yet.
- No 50-post hand-label audit has been completed. Do not report tagging accuracy until 50 records are independently labelled and compared with model output.
- No public deployment has been made: this checkout has no Git remote or hosting credentials. Deployment requires an always-on backend with persistent storage for H2, provider/Gemini environment variables, and the frontend's deployed API URL.
- A Loom walkthrough still needs to be recorded by the applicant.
