# AGENT RULES

## Core Rules

* Follow SERVICE_GUIDE.md
* Follow DESIGN.md
* Do not change the service concept

## Scope Control

Do NOT implement:

* authentication
* payment
* shipping
* external APIs
* print-ready PDF generation

## Priority

1. Records CRUD
2. Orders flow
3. JSON export
4. UI polish

## Code Rules

* Keep code simple and readable
* Avoid over-engineering
* Use RESTful API design

## Architecture Rules

The current codebase is intentionally small, but new work should move it toward clearer boundaries.

### Frontend

* Keep `client/src/App.tsx` focused on app composition, page selection, and wiring.
* Move reusable state, loading, and event flows out of `App.tsx` into hooks or feature modules.
* Keep API details inside `client/src/api/client.ts` or feature-specific API modules.
* Do not expose multi-step backend workflows to page components when a single backend use case can represent the action.

### Backend

* Prefer the flow `router -> service/usecase -> repository`.
* Routers should focus on HTTP concerns: request parsing, response status, and calling a use case.
* Services/use cases should hold application flow and business rules.
* Repositories should hold SQLite queries and persistence details.
* Domain rules should not depend directly on Express request/response objects.
* Avoid adding new direct SQL calls inside routers when creating or changing core behavior.

### Order Flow

* The order creation workflow should be hidden behind a backend use case.
* The frontend should request order creation with business inputs such as `petId`, `title`, `startDate`, and `endDate`.
* The backend should handle book draft creation, record selection, finalization, and order creation internally.
* Keep JSON export as structured API-ready data, but do not integrate real external print APIs.

## Protected Documents

Do not edit the following files unless the user explicitly asks for documentation changes:

* README.md
* DESIGN.md
* SERVICE_GUIDE.md
* AGENT_RULES.md

Agents may read these files for context, but must not modify them during implementation tasks.

Before committing, check the changed file list. If any protected document is changed, ask the user before committing.

## Submission Rules

* The app must run with Docker Compose
* README.md must be enough for reviewers to run the project
* Include seed or dummy data so the service can be reviewed without login
* Do not commit API keys, passwords, or secrets
* Keep `.env` files out of Git and provide `.env.example` if environment variables are needed
* Test with `docker-compose up` before submission

## Git Rules

* Use Conventional Commits for every commit message
* Use `feat:` for new features
* Use `fix:` for bug fixes
* Use `docs:` for documentation changes
* Use `chore:` for setup, tooling, and maintenance changes
* Use `refactor:` for code changes that do not add features or fix bugs
* Use `test:` for test additions or changes
* Keep commit messages short and clear
* Example: `feat: add records crud api`

## Commit and Push Rules

* Ask the user before creating a commit
* Ask the user before pushing to remote
* If the user explicitly says "commit and push", both actions are allowed for that task

## AI Usage

* AI can generate boilerplate
* All logic must be reviewed before use
