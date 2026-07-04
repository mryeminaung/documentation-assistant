# AI Documentation Assistant

A web application that uses the Claude API to help developers understand, document, and clean up their code — explain a snippet, generate comments, produce Markdown docs, summarize a file, or get better variable names, all from one interface.

### Live Demo

`I will add live demo URL later`

## Overview

Pasting code into a chat window and re-typing the same instructions every time gets old fast. AI Documentation Assistant wraps five common "help me understand/document this code" tasks into a focused UI: pick a task, pick a language, paste code, get a clean response back — with the prompt engineering already handled server-side.

The project is intentionally small in scope: no accounts, no history, no database. It's a single-page tool built to be finished in a few days and easy to extend later.

## Features

- **Explain Code** — a step-by-step, plain-language walkthrough of what a snippet does
- **Generate Comments** — adds inline comments to code without changing any logic
- **Generate Documentation** — produces Markdown docs (purpose, parameters, returns, usage example)
- **Summarize File** — a short, high-level summary of an entire file
- **Improve Variable Names** — a table of naming suggestions with reasons, logic untouched
- Task and language selection, a code editor pane, and a response panel in one screen
- Loading, empty, and error states, plus a copy-to-clipboard toast
- Responsive layout — usable on mobile, tablet, and desktop

## Screenshots

> I will add screenshots or a short screen recording here once the UI is running locally.

| Explain Code              | Generate Documentation |
| ------------------------- | ---------------------- |
| `screenshots/explain.png` | `screenshots/docs.png` |

| Mobile view              | Error state             |
| ------------------------ | ----------------------- |
| `screenshots/mobile.png` | `screenshots/error.png` |

## Technologies

**Frontend**

- React 18 + Vite
- Tailwind CSS

**Backend**

- Node.js + Express
- Anthropic Claude API (`@anthropic-ai` Messages API via `fetch`)

**Tooling**

- ESM modules throughout (`type: "module"`)
- `dotenv` for environment configuration
- `cors` for local cross-origin requests between client and server

## Installation

Clone the repository and install dependencies for both the client and the server — they're separate packages.

```bash
git clone https://github.com/mryeminaung/documentation-assistant.git
cd ai-doc-assistant

cd client && npm install
cd ../server && npm install
```

## Environment Variables

The server needs an Anthropic API key. Copy the example file and fill in your own values:

```bash
cd server
cp .env.example .env
```

`server/.env`:

| Variable            | Required | Default                 | Description                                   |
| ------------------- | -------- | ----------------------- | --------------------------------------------- |
| `ANTHROPIC_API_KEY` | Yes      | —                       | Your Anthropic API key. Never commit this.    |
| `ANTHROPIC_MODEL`   | No       | `claude-sonnet-5`       | Which Claude model to call.                   |
| `PORT`              | No       | `8000`                  | Port the Express server listens on.           |
| `CLIENT_ORIGIN`     | No       | `http://localhost:3000` | Allowed CORS origin, for local dev with Vite. |

The client has no required environment variables — in development, Vite proxies `/api` requests to the backend (see `client/vite.config.js`).

## Running Locally

Run the client and server in two terminals.

**Terminal 1 — backend**

```bash
cd server
npm run dev
```

Starts the Express server at `http://localhost:8000`.

**Terminal 2 — frontend**

```bash
cd client
npm run dev
```

Starts the Vite dev server at `http://localhost:3000`. Open that URL in your browser.

To build the frontend for production:

```bash
cd client
npm run build
```

## Folder Structure

```
ai-doc-assistant/
├── client/                        # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── LanguageSelector.jsx
│   │   │   ├── TaskTabs.jsx
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── GenerateButton.jsx
│   │   │   ├── LoadingIndicator.jsx
│   │   │   ├── ResponsePanel.jsx
│   │   │   ├── CopyButton.jsx
│   │   │   └── Toast.jsx
│   │   ├── hooks/
│   │   │   ├── useClaudeRequest.js
│   │   │   └── useToast.js
│   │   ├── lib/
│   │   │   └── constants.js       # task list, language list
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                        # Node + Express
│   ├── src/
│   │   ├── routes/
│   │   │   └── generate.routes.js # POST /api/generate
│   │   ├── controllers/
│   │   │   └── generate.controller.js
│   │   ├── services/
│   │   │   └── claudeService.js   # calls the Anthropic API
│   │   ├── prompts/
│   │   │   └── templates.js       # one prompt template per task
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── AppError.js
│   │   │   └── validateGenerateRequest.js
│   │   ├── config/
│   │   │   └── index.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Future Improvements

- Streaming responses (SSE) instead of waiting for the full completion
- File upload or GitHub repo linking, instead of paste-only input
- Syntax highlighting in the code editor (e.g. CodeMirror or Monaco)
- Multi-turn follow-up questions about the same code
- Save/view history of past analyses (would require a database)
- Authentication and per-user rate limiting
- Unit tests for prompt builders and request validation
