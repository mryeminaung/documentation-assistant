// Single source of truth for the five supported tasks.
// `label` is short (fits the folder-tab UI); `description` is used as
// helper text under the editor.
export const TASKS = [
	{
		id: "explain",
		label: "Explain Code",
		description: "Walks through what the code does, step by step.",
	},
	{
		id: "comment",
		label: "Generate Comments",
		description: "Adds inline comments without changing any logic.",
	},
	{
		id: "docs",
		label: "Generate Documentation",
		description: "Produces Markdown docs: purpose, params, returns, usage.",
	},
	{
		id: "summarize",
		label: "Summarize File",
		description: "Summarizes the whole file in a few sentences.",
	},
	{
		id: "rename",
		label: "Improve Variable Names",
		description: "Suggests clearer names with reasons, as a table.",
	},
	{
		id: "creator",
		label: "About Your Assistant",
		description: "Learn about this app and how to use it.",
	},
];

// Matches the six languages documented in the prompt templates,
// the code-documentation skill, and the documentation-expert agent.
// If you add a language here, extend those too.
export const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C',
  'C#',
  'Go',
  'Ruby',
  'PHP',
  'SQL',
  'Shell',
  'Dart',
]

// Maps file extensions to language names for auto-detection on upload
export const EXT_TO_LANG = {
  js: 'JavaScript',
  jsx: 'JavaScript',
  mjs: 'JavaScript',
  ts: 'TypeScript',
  tsx: 'TypeScript',
  py: 'Python',
  pyw: 'Python',
  java: 'Java',
  cpp: 'C++',
  cc: 'C++',
  cxx: 'C++',
  h: 'C++',
  hpp: 'C++',
  c: 'C',
  cs: 'C#',
  go: 'Go',
  rb: 'Ruby',
  php: 'PHP',
  sql: 'SQL',
  sh: 'Shell',
  bash: 'Shell',
  zsh: 'Shell',
  dart: 'Dart',
}

export const DEFAULT_LANGUAGE = 'JavaScript'
export const DEFAULT_TASK = TASKS[0].id
