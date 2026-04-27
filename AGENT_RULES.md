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
