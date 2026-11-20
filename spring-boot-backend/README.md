# Beep Fresher Jobs - Spring Boot Backend

Pure Java Spring Boot backend for fresher/internship jobs aggregator.

## Project Structure

```
spring-boot-backend/
├── pom.xml
├── src/
│   └── main/
│       ├── java/com/beep/jobs/
│       │   ├── BeepJobsApplication.java
│       │   ├── controller/JobController.java
│       │   ├── service/JobService.java
│       │   ├── repository/JobRepository.java
│       │   ├── entity/Job.java
│       │   └── dto/JobResponse.java
│       └── resources/application.properties
└── README.md
```

## Prerequisites

- Java 21+
- Maven 3.8+

## How to Run

### Step 1: Navigate to project folder
```bash
cd "C:\Users\negir\OneDrive\Desktop\beep\spring-boot-backend"
```

### Step 2: Run with Maven
```bash
mvn spring-boot:run
```

Server starts at: http://localhost:28081

## Daily job refresh

The backend automatically refreshes jobs every day at 5:00 AM India time (Asia/Kolkata). The Spring Boot process must be running at that time; if it is down, the next scheduled run is the following day. The refresh reuses the configured source APIs, applies freshness filters and deduplication, then stores new jobs in the persistent H2 database.

### API keys and free LLM tagging

Copy `.env.example` to `.env` as a reference, then set these environment variables in your terminal or hosting dashboard: `JOBSPIPE_API_KEY`, `JSEARCH_API_KEY`, `JOOBLE_API_KEY`, and `GEMINI_API_KEY`. Spring Boot does not load `.env` automatically. Never commit real keys.

Gemini tagging uses the Google Gemini Developer API model `gemini-3.5-flash-lite`. Its free tier is subject to Google's account and rate limits; free-tier prompts and responses may be used to improve Google products, so this app sends public job listing text only. Without `GEMINI_API_KEY`, the service uses the built-in heuristic tagger. Logs report LLM token usage per batch.

Get a key from [Google AI Studio](https://aistudio.google.com/apikey), then set it in PowerShell for the current terminal before starting Spring:

```powershell
$env:GEMINI_API_KEY = 'your-key'
$env:JOBSPIPE_API_KEY = 'your-provider-key'
$env:JSEARCH_API_KEY = 'your-provider-key'
$env:JOOBLE_API_KEY = 'your-provider-key'
mvn spring-boot:run
```

For hosting, set secrets in the platform's environment variable settings instead of writing them into this repository.

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/jobs` | All active jobs |
| GET | `/api/jobs?q=software` | Search by title/company/description |
| GET | `/api/jobs?role=SWE` | Filter by role |
| GET | `/api/jobs?city=Bengaluru` | Filter by city |
| GET | `/api/jobs?q=intern&role=SWE&city=Bengaluru&page=1&pageSize=10` | Search + filters + pagination |
| GET | `/api/jobs/1` | Get single job by ID |
| GET | `/api/stats` | Legacy endpoint (not used by the jobs UI) |

## Example cURL Commands

```bash
# Health check
curl http://localhost:28081/api/health

# All jobs
curl http://localhost:8080/api/jobs

# Search with filters
curl "http://localhost:8080/api/jobs?q=intern&role=SWE&city=Bengaluru&page=1&pageSize=10"

# Single job
curl http://localhost:8080/api/jobs/1

# Stats
curl http://localhost:8080/api/stats

```

## Database

H2 file storage is used by default. The database is written to `./data/beep_fresher_db`; for deployment, set `DATABASE_URL` to an H2 file URL on a persistent disk (for example `jdbc:h2:file:/var/data/beep_fresher_db`).

## Table Columns

- id, source, sourceJobId, title, company, locationRaw, description, applyUrl, postedAt, fetchedAt, urlHash, isFresherOrIntern, roleTag, cityTag, tagConfidence, llmInputTokens, llmOutputTokens, status

## Deployment

The included Dockerfile builds and runs the backend on Java 21. The host must provide a persistent disk for the H2 file and keep the web process running for the 5:00 AM IST scheduled refresh. Configure CORS with `APP_CORS_ALLOWED_ORIGINS` to include the deployed frontend URL. The frontend is a separate Vite app and must be built with `VITE_API_BASE_URL` set to the deployed backend origin.
