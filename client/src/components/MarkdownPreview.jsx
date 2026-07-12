import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownPreview({ content }) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-ink dark:prose-headings:text-[#E7E9EC] prose-p:text-ink dark:prose-p:text-[#E7E9EC] prose-code:text-accent prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#1e2330] prose-pre:border prose-pre:border-border">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
