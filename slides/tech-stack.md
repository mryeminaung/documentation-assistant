---
marp: true
paginate: true
size: 16:9
---

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;700&display=swap');
:root { --bg:#ffffff; --ink:#111827; --muted:#9ca3af; --accent:#111827; --line:#e5e7eb; --code:#f6f7f9; }
section {
  background:var(--bg); color:var(--ink);
  font-family:'Inter','Noto Sans','Pyidaungsu',sans-serif;
  font-size:26px; line-height:1.6; padding:64px 88px;
}
h1 { color:var(--ink); font-weight:700; font-size:1.7em; letter-spacing:-.01em; }
h1, h2, h3 { font-family:'Space Grotesk','Inter','Noto Sans','Pyidaungsu',sans-serif; }
h2 { color:var(--ink); font-weight:600; }
h3 { color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:.06em; font-size:.8em; }
strong { color:var(--ink); font-weight:700; }
a { color:#2563eb; text-decoration:none; }
code { background:var(--code); color:#be123c; padding:.06em .35em; border-radius:4px; font-family:'JetBrains Mono',monospace; }
pre  { background:var(--code); border:1px solid var(--line); border-radius:8px; }
pre code { background:none; color:#111827; }
blockquote { border-left:3px solid var(--line); color:var(--muted); padding:.4em 1em; }
table th { background:var(--code); }
table td, table th { border-color:var(--line); }
header,footer,section::after { color:var(--muted); font-size:.5em; }
section.cover h1 { font-size:2.3em; }
section.cover h2 { color:var(--muted); font-weight:400; }
section.lead { background:#fafafa; }
</style>

<!-- _class: cover -->

# Tech Stack

## Documentation Architecture & AI Tooling

Ye Min Aung · @mryeminaung · documentation-assistant

---

### Overview

# What it is

- A web app that explains, comments, and documents code using Claude API
- Paste code → pick a task → get clean, focused documentation
- Five tasks: Explain · Comment · Document · Summarize · Rename
- Supports JavaScript, TypeScript, Python, Java, C++, and Dart

---

### Tech Stack

# Frontend

- **React 18** — UI library for component-based architecture
- **Vite** — Fast dev server and build tool
- **Tailwind CSS** — Utility-first CSS framework

# Backend

- **Node.js + Express** — REST API server
- **Anthropic Claude API** — AI-powered code documentation
- **ESM modules** — Modern JavaScript throughout

---

### AI Agent

# Subagent: `documentation-expert`

- **Path:** `.claude/agents/documentation-expert.md`
- **Role:** Senior software engineer specializing in code documentation
- **Capabilities:**
  - Explain code step-by-step
  - Generate inline comments
  - Write Markdown documentation
  - Summarize files
  - Suggest better variable/function names

---

### AI Skill

# Skill: `code-documentation`

- **Path:** `.claude/skills/code-documentation/SKILL.md`
- **Purpose:** Task-specific instructions for all 5 documentation tasks
- **Covers:**
  - Comment syntax per language (JSDoc, docstrings, Javadoc, etc.)
  - Documentation structure (Purpose, Parameters, Returns, Usage)
  - Naming conventions (camelCase, snake_case)
  - Rules: Preserve logic, never hallucinate, stay concise

---

### Methodology

# How it works

1. **User selects task** — Explain, Comment, Document, Summarize, or Rename
2. **User selects language** — JS, TS, Python, Java, C++, or Dart
3. **User pastes code** — Into the code editor
4. **Server builds prompt** — Task-specific prompt template
5. **Claude API call** — Sends code + instructions to Claude
6. **Response displayed** — Clean, formatted documentation

---

### Prompt Engineering

# Server-side prompt builders

```javascript
// Each task has a dedicated prompt builder
function explain({ code, language }) {
  return {
    system: `You are a precise, senior software engineer...`,
    user: `Explain what this ${language} code does, step by step...`,
  };
}
```

- `server/src/prompts/templates.js` — One prompt builder per task
- `server/src/services/claudeService.js` — Handles API calls and errors
- `server/src/middleware/` — Rate limiting, validation, error handling

---

### Trigger & Commands

# How to fire the skill/agent

**Skill Trigger:**
- When user asks what code does
- When user wants comments or documentation generated
- When user wants a file summarized
- When user wants naming improvements

**Command:**
```bash
# In Claude Code, invoke the skill:
@code-documentation

# Or use the agent directly:
@documentation-expert
```

---

### Project Structure

# Folder layout

```
documentation-assistant/
├── client/              # React + Vite frontend
│   └── src/
│       ├── components/  # UI components
│       ├── hooks/       # Custom React hooks
│       └── lib/         # Constants and utilities
├── server/              # Express backend
│   └── src/
│       ├── prompts/     # Task-specific prompt builders
│       ├── services/    # Claude API integration
│       └── middleware/  # Rate limiting, validation
├── .claude/
│   ├── skills/          # code-documentation skill
│   └── agents/          # documentation-expert agent
└── slides/              # This deck
```

---

### Get started

# Links

- **Live:** https://documentation-assistant.vercel.app/
- **Repo:** github.com/mryeminaung/documentation-assistant
- **Stack:** React + Vite + Tailwind · Node + Express · Claude API
- **License:** MIT
