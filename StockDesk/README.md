# StockDesk — Inventory Dashboard (.NET 8 + React)

A portfolio demo for managing a small product catalogue.

## Features
- List and search inventory
- Add and delete products
- Stock quantity and low-stock indicators
- React + TypeScript UI calling an ASP.NET Core API

## Stack
C#, .NET 8, ASP.NET Core Minimal API, React, TypeScript, Vite.

## Run locally
1. Install the .NET 8 SDK and Node.js LTS.
2. Start the API: `cd StockDesk/StockDesk.Api && dotnet run` (listens at `http://localhost:5082`).
3. Start UI: `cd StockDesk/stockdesk-ui && npm install && npm run dev`.
4. Open the Vite URL, normally `http://localhost:5173`.

## API
- `GET /api/products`
- `POST /api/products` body: `{"name":"USB-C Hub","sku":"HUB-001","quantity":12,"price":29.99}`
- `DELETE /api/products/{id}`

## Limitations
Uses in-memory sample data, so changes reset when the API restarts. This is a starter demo, not production-ready. Add persistence, authentication/authorization, concurrency handling, validation, and tests before production use. Build and verify locally before describing it as tested.
