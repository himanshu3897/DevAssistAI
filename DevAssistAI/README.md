# DevAssist AI

A personal portfolio demo built with ASP.NET Core 8. It connects a small REST API to an OpenAI-compatible Chat Completions endpoint and provides three developer workflows: code review, refactoring suggestions, and unit-test drafting.

## Features

- C# and ASP.NET Core Minimal API
- Request validation and friendly configuration/provider errors
- Server-side AI credentials (never put API keys in the browser or source control)
- Responsive HTML/CSS/JavaScript UI
- Environment-based AI endpoint and model configuration

## Requirements

- .NET 8 SDK
- An API key and model name from an OpenAI-compatible provider

## Run locally

From this directory:

**macOS / Linux**
```bash
export AI__ApiKey="YOUR_API_KEY"
export AI__Model="YOUR_MODEL_NAME"
# Optional: endpoint for your compatible provider
export AI__Endpoint="https://api.openai.com/v1/chat/completions"
dotnet run
```

**Windows PowerShell**
```powershell
$env:AI__ApiKey = "YOUR_API_KEY"
$env:AI__Model = "YOUR_MODEL_NAME"
$env:AI__Endpoint = "https://api.openai.com/v1/chat/completions"
dotnet run
```

Open the local URL printed by the application. The endpoint and model name must be supported by your selected provider. If the key/model is not configured, the API returns a setup error rather than pretending the request succeeded.

## API endpoints

- `GET /api/health` — basic health response
- `POST /api/analyze` — analyze a code snippet

Request example:
```json
{
  "code": "public int Add(int a, int b) => a + b;",
  "task": "review",
  "language": "csharp"
}
```

Allowed `task` values: `review`, `refactor`, `tests`.

## Security notes

Do not paste confidential employer/client code, secrets, customer data, payment data, or personal information into this demo. Submitted code is sent to the AI provider configured by the server. Review generated suggestions and validate them through compilation, tests, and security review.

This repository contains a starter implementation. It has not been represented as production-ready or as a deployed client deliverable. Before production use, add authentication, rate limiting, monitoring, a clear data-retention policy, and deployment hardening.
