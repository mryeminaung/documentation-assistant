<!-- Before doing or changing anything, read CLAUDE.md and README.md first. --> 

## Project Overview

Documentation Assistant is an AI-powered tool that helps developers understand, analyze, and generate documentation for software projects.

The main goal of this project is to reduce the effort required to document codebases by using AI assistance to:

- Analyze project structure
- Understand source code
- Generate meaningful documentation
- Help developers quickly understand unfamiliar repositories

---

## Project Goals

1. Build a reliable documentation generation assistant.
2. Provide clear and useful explanations of code.
3. Generate developer-friendly documentation.
4. Maintain accuracy by using the existing codebase as the source of truth.
5. Create a simple workflow that developers can use with minimal setup.

---

## Development Guidelines

### General Rules

- Always understand the existing project structure before making changes.
- Do not modify files unrelated to the requested feature.
- Prefer simple and maintainable solutions.
- Follow existing coding patterns in the repository.
- Keep functions small and focused.
- Avoid unnecessary dependencies.

---

## Code Quality

When writing code:

- Write clean and readable code.
- Use meaningful variable and function names.
- Add comments only when the logic is not obvious.
- Handle errors properly.
- Avoid duplicated code.
- Keep the project easy for new contributors to understand.

---

## Documentation Rules

Since this project focuses on documentation:

- Generated documentation must be clear and beginner-friendly.
- Do not invent information that does not exist in the source code.
- Always verify generated content against the actual implementation.
- Explain:

  - Purpose of files
  - Important functions/classes
  - Data flow
  - Dependencies
  - Setup instructions

---

## AI Assistant Behavior

When assisting with this project:

1. First analyze the repository structure.
2. Understand the existing implementation before suggesting changes.
3. Explain the reason behind recommended changes.
4. Prefer incremental improvements.
5. Avoid large refactoring unless requested.

---

## Git Workflow

Before creating commits:

- Ensure the application builds successfully.
- Check for syntax errors.
- Verify that existing features still work.
- Review changed files before committing.
- Make sure the commit message clearly describes the actual changes.
- The commit message name must be related to the features added, bugs fixed, or improvements made.
- Avoid generic commit messages such as `update`, `changes`, or `modify`.

Common commit types:

- `feat:` — Add a new feature
- `fix:` — Fix a bug or unexpected behavior
- `docs:` — Update documentation
- `refactor:` — Improve code structure without changing functionality
- `test:` — Add or update tests
- `chore:` — Update configuration or maintenance tasks

Examples:

feat: add repository scanning feature
fix: handle missing documentation files
docs: update installation guide
refactor: simplify file processing logic
test: add documentation parser tests
chore: update project dependencies

---

## Feature Development Process

For new features:

1. Understand the requirement.
2. Review existing architecture.
3. Plan the implementation.
4. Implement the smallest working solution.
5. Test the feature.
6. Update documentation if needed.

---

## Security Guidelines

- Never expose API keys or secrets.
- Do not commit `.env` files.
- Validate external inputs.
- Handle file access carefully.
- Avoid executing unsafe user-provided code.

---

## Testing

Before considering a task complete:

- Test the changed functionality.
- Check edge cases.
- Verify error handling.
- Ensure documentation matches the implementation.

---

## Project Philosophy

The Documentation Assistant should help developers understand software faster.

Prioritize:

1. Accuracy over assumptions.
2. Simplicity over complexity.
3. Helpful explanations over technical jargon.
4. Maintainable code over quick hacks.
