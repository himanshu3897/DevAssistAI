# DevAssist AI — AI-Powered Code Review & Test Assistant

A personal portfolio project demonstrating **C# / ASP.NET Core 8**, REST API design, and integration with an OpenAI-compatible AI endpoint. DevAssist AI lets a developer submit a small code snippet and request a review, refactoring ideas, or a draft of unit tests.

> **Status:** Starter implementation. Build and validate locally before presenting it as a working live demo. AI output is a draft and must be reviewed by a developer.

## What it demonstrates

- ASP.NET Core Minimal API and request validation
- Server-side AI provider integration (API keys are not sent to the browser)
- Three workflows: code review, refactoring suggestions, and unit-test drafting
- A responsive browser UI built with HTML, CSS, and JavaScript
- Configuration through environment variables
- Clear handling for missing configuration and provider failures

## Tech stack

- C#, .NET 8, ASP.NET Core
- REST API, HttpClient, System.Text.Json
- HTML, CSS, vanilla JavaScript

## Run locally

1. Install the .NET 8 SDK.
2. Open a terminal in the `DevAssistAI` directory.
3. Configure your AI provider environment variables:

**macOS / Linux**
```bash
export AI__ApiKey="YOUR_API_KEY"
export AI__Model="YOUR_MODEL_NAME"
# Optional; use your provider's OpenAI-compatible Chat Completions URL
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

Open the local URL printed by the application. Provider model names and endpoint formats vary; configure values supported by your chosen provider.

## API

`POST /api/analyze`

Example request:
```json
{
  "code": "public int Add(int a, int b) => a + b;",
  "task": "review",
  "language": "csharp"
}
```

Allowed task values: `review`, `refactor`, `tests`. A health endpoint is available at `GET /api/health`.

## Security and responsible use

- Never commit API keys, credentials, or private configuration.
- Do not submit confidential employer/client code, secrets, payment data, personal data, or regulated information to an external AI provider.
- The configured provider receives submitted code snippets.
- AI responses can be incorrect or insecure. Review output and validate it with compilation, tests, and security checks.
- This is a portfolio demo, not a production-ready code-analysis service. Production use would require authentication, rate limiting, privacy-aware logging, monitoring, and deployment hardening.

## About this portfolio

This is an original personal demo intended to showcase backend API development and practical AI integration. It is not represented as a client project or as a deployed production service.

## Author

**Himanshu Baneshi** — Senior .NET Full-Stack Developer

Core areas: C#, ASP.NET Core, REST APIs, SQL Server, Angular, React, and AI-assisted development (where applicable to the project).

---
If you find this useful, feel free to star the repository or open an issue with suggestions.
