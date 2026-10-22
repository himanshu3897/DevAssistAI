# TaskFlow — Task Manager (.NET 8 + Angular)

A portfolio demo for a small task-management workflow.

## Features
- Create, list, update status, and delete tasks
- ASP.NET Core Minimal API with simple in-memory data
- Angular standalone component and typed API service
- Loading/error messages and basic form validation

## Stack
C#, .NET 8, ASP.NET Core Minimal API, Angular 18, TypeScript, HttpClient.

## Run
1. Install the .NET 8 SDK and Node.js (LTS).
2. Start the API:
   `cd TaskFlow/TaskFlow.Api && dotnet run`
   API listens on `http://localhost:5081` by default.
3. In another terminal:
   `cd TaskFlow/taskflow-ui && npm install && npm start`
4. Open `http://localhost:4200`.

## API
- `GET /api/tasks`
- `POST /api/tasks` body: `{"title":"Review pull request"}`
- `PUT /api/tasks/{id}` body: `{"title":"Review PR","isCompleted":true}`
- `DELETE /api/tasks/{id}`

## Limitations
Uses in-memory data: restarting the API resets tasks. This is a learning/demo starter, not production-ready. Add persistence, authentication, pagination, and automated tests before production use. Build and verify locally before describing it as tested.
