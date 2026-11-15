import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const components = {
  pre({ children, ...props }) {
    return (
      <pre {...props} className="max-w-full overflow-x-auto">
        {children}
      </pre>
    )
  },
  table({ children, ...props }) {
    return (
      <div className="my-5 max-w-full overflow-x-auto rounded-lg border border-border">
        <table {...props} className="m-0 min-w-full">
          {children}
        </table>
      </div>
    )
  },
}

export default function MarkdownPreview({ content }) {
  return (
    <div className="prose prose-sm min-w-0 max-w-none break-words text-ink dark:prose-invert dark:text-[#E7E9EC]
                    prose-headings:scroll-mt-4 prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-ink dark:prose-headings:text-[#E7E9EC]
                    prose-h1:mb-5 prose-h1:text-2xl prose-h2:mb-3 prose-h2:mt-8 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h2:text-xl prose-h3:mt-6 prose-h3:text-base
                    prose-p:my-3 prose-p:leading-7 prose-p:text-ink/90 dark:prose-p:text-[#E7E9EC]/90
                    prose-a:font-medium prose-a:text-accent-dim prose-a:underline prose-a:decoration-accent/30 prose-a:underline-offset-2 dark:prose-a:text-amber-400
                    prose-strong:text-ink dark:prose-strong:text-[#E7E9EC]
                    prose-code:rounded prose-code:bg-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:font-medium prose-code:text-accent-dim prose-code:before:content-none prose-code:after:content-none dark:prose-code:text-amber-300
                    prose-pre:my-5 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-[#1e2330] prose-pre:p-4 prose-pre:shadow-inner
                    prose-blockquote:border-l-accent prose-blockquote:bg-accent/5 prose-blockquote:py-0.5 prose-blockquote:not-italic
                    prose-li:my-1 prose-li:marker:text-accent
                    prose-table:text-sm prose-th:whitespace-nowrap prose-th:bg-panel prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 dark:prose-th:bg-[#1F242C]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
