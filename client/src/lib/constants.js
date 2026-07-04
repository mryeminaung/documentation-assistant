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
		label: "About Creator",
		description: "Suggests clearer names with reasons, as a table.",
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
  'Dart',
]

export const DEFAULT_LANGUAGE = 'JavaScript'
export const DEFAULT_TASK = TASKS[0].id
