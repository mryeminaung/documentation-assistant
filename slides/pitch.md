---
marp: true
paginate: true
transition: fade
# PechaKucha: 6 slides, 20s auto-advance. Do not change the count.
auto-advance: 20
---
<!-- slide 1 -->
# Who's my person?

Developers who get handed unfamiliar code — a legacy file, a teammate's PR, an open-source repo — and need to understand it fast, without pinging someone else to explain it.
<!-- 20s -->
---
<!-- slide 2 -->
# Their problem

Explaining, commenting, and documenting code is necessary but tedious. It gets skipped under deadline pressure, so codebases quietly accumulate undocumented, unclear functions that cost the *next* person even more time.

---
<!-- slide 3 -->
# What I built

**AI Documentation Assistant** — a web app where you paste code, pick a task (explain / comment / document / summarize / rename), and get a clean, focused response back using the Claude API. React + Vite + Tailwind frontend, Node + Express backend.

---
<!-- slide 4 -->
# How I built it
- MCP: `filesystem` server (`.mcp.json`) — lets Claude Code read/write across the project when documenting multiple files, not just one pasted snippet
- Skill: `.claude/skills/code-documentation/SKILL.md` — task-specific instructions for all 5 documentation tasks across 6 languages
- Agent: `.claude/agents/documentation-expert.md` — a subagent scoped to explaining/documenting code, preloaded with the skill above
---
<!-- slide 5 -->
# Why it matters

Good documentation shouldn't depend on whoever has the most free time that week. A fast, no-setup tool for explaining and documenting code lowers the barrier enough that it actually gets done — better onboarding, fewer "wait, what does this do?" Slack messages.

---
<!-- slide 6 -->
# Done checklist
- [x] repo public
- [x] MCP + skill + agent used
- [x] report.md in team repo
