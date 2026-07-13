# Documentation Assistant

A web application that uses the Claude API to help developers understand, document, and clean up their code — explain a snippet, generate comments, produce Markdown docs, summarize a file, or get better variable names, all from one interface.

## Live Demo

Explore the fully interactive application directly in your browser:

🔗 **[Launch Documentation Assistant](https://documentation-assistant.vercel.app/)**

## Overview

Pasting code into a chat window and re-typing the same instructions every time gets old fast. Documentation Assistant wraps five common "help me understand/document this code" tasks into a focused UI: pick a task, pick a language, paste code, get a clean response back — with the prompt engineering already handled server-side.

The project is intentionally small in scope: no accounts, no history, no database. It's a single-page tool built to be finished in a few days and easy to extend later.

## Features

- **Explain Code** — a step-by-step, plain-language walkthrough of what a snippet does
- **Generate Comments** — adds inline comments to code without changing any logic
- **Generate Documentation** — produces Markdown docs (purpose, parameters, returns, usage example)
- **Summarize File** — a short, high-level summary of an entire file
- **Improve Variable Names** — a table of naming suggestions with reasons, logic untouched
- **File Upload & Drag-and-Drop** — upload `.js`, `.py`, `.go`, and more directly into the editor
- **13 Language Support** — JavaScript, TypeScript, Python, Java, C, C#, C++, Go, Ruby, PHP, SQL, Shell, Dart
- **Language Icons** — real SVG icons for each language in the selector
- Task and language selection, a code editor pane, and a response panel in one screen
- Loading, empty, and error states, plus a copy-to-clipboard toast
- Responsive layout — usable on mobile, tablet, and desktop
- Light/dark mode with theme toggle

## Screenshots

<table>
  <tr>
    <th style="text-align: center;">About</th>
    <th style="text-align: center;">Explain Code</th>
    <th style="text-align: center;">Generate Comments</th>
  </tr>
  <tr>
    <td style="text-align: center;"><img src="screenshots/00-about-assistant.png" alt="About" width="100%" height="200" /></td>
    <td style="text-align: center;"><img src="screenshots/01-explain-code.png" alt="Explain Code" width="100%" height="200" /></td>
    <td style="text-align: center;"><img src="screenshots/02-generate-comments.png" alt="Generate Comments" width="100%" height="200" /></td>
  </tr>
  <tr>
    <th style="text-align: center;">Generate Documentation</th>
    <th style="text-align: center;">Summarize File</th>
    <th style="text-align: center;">Improve Variable Names</th>
  </tr>
  <tr>
    <td style="text-align: center;"><img src="screenshots/03-generate-docs.png" alt="Generate Docs" width="100%" height="200" /></td>
    <td style="text-align: center;"><img src="screenshots/04-summarize-file.png" alt="Summarize" width="100%" height="200" /></td>
    <td style="text-align: center;"><img src="screenshots/05-refactor-names.png" alt="Rename" width="100%" height="200" /></td>
  </tr>
</table>

## Technologies

**Frontend**

- React 18 + Vite
- Tailwind CSS
- CodeMirror (code editor)
- react-icons (language icons)
- lucide-react (UI icons)

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
documentation-assistant/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   ├── About.jsx
│       │   ├── CodeEditor.jsx
│       │   ├── CopyButton.jsx
│       │   ├── GenerateButton.jsx
│       │   ├── Header.jsx
│       │   ├── LanguageSelector.jsx
│       │   ├── LoadingIndicator.jsx
│       │   ├── ResponsePanel.jsx
│       │   ├── TaskTabs.jsx
│       │   └── Toast.jsx
│       ├── hooks/
│       │   ├── useClaudeRequest.js
│       │   └── useToast.js
│       └── lib/
│           └── constants.js
├── screenshots/
│   ├── 00-about-assistant.png
│   ├── 01-explain-code.png
│   ├── 02-generate-comments.png
│   ├── 03-generate-docs.png
│   ├── 04-summarize-file.png
│   └── 05-refactor-names.png
├── server/
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── config/
│       │   └── index.js
│       ├── controllers/
│       │   └── generate.controller.js
│       ├── middleware/
│       │   ├── errorHandler.js
│       │   └── rateLimiter.js
│       ├── prompts/
│       │   └── templates.js
│       ├── routes/
│       │   └── generate.routes.js
│       ├── services/
│       │   └── claudeService.js
│       └── utils/
│           ├── AppError.js
│           └── validateGenerateRequest.js
├── slides/
│   ├── pitch.md
│   └── product-intro.md
├── LICENSE
└── README.md
```

## Future Improvements

- Streaming responses (SSE) instead of waiting for the full completion
- Multi-turn follow-up questions about the same code
- Save/view history of past analyses (would require a database)
- Authentication and per-user rate limiting
- Unit tests for prompt builders and request validation
