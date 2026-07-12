import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { html } from '@codemirror/lang-html'

const languageMap = {
  JavaScript: () => javascript({ jsx: true }),
  TypeScript: () => javascript({ jsx: true, typescript: true }),
  Python: () => python(),
  Java: () => java(),
  // No dedicated CodeMirror lang; fall back to plain text
  'C++': () => [],
  C: () => [],
  'C#': () => [],
  Go: () => [],
  Ruby: () => [],
  PHP: () => [],
  SQL: () => [],
  Shell: () => [],
  Dart: () => [],
}

export function getLanguageExtension(language) {
  const factory = languageMap[language]
  return factory ? factory() : []
}
