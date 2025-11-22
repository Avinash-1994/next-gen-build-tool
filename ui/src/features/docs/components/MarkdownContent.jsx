import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import CodeBlock from './CodeBlock'
import Callout from './Callout'

const components = {
    // Custom code blocks with better styling
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '')
        const language = match ? match[1] : ''

        // Extract actual text content from children
        const getTextContent = (child) => {
            if (typeof child === 'string') return child
            if (Array.isArray(child)) return child.map(getTextContent).join('')
            if (child?.props?.children) return getTextContent(child.props.children)
            return ''
        }

        const textContent = getTextContent(children)

        if (inline) {
            return (
                <code
                    className="px-2 py-1 mx-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 text-sm font-mono border border-slate-200 dark:border-slate-700"
                    {...props}
                >
                    {textContent}
                </code>
            )
        }

        return (
            <div className="my-6">
                <CodeBlock language={language} code={textContent.replace(/\n$/, '')} />
            </div>
        )
    },

    // Custom headings with better styling and borders
    h1: ({ children, ...props }) => (
        <h1
            className="text-4xl font-bold mt-12 mb-6 pb-4 border-b-2 border-gradient-to-r from-primary to-purple-500 scroll-mt-20"
            id={slugify(children)}
            {...props}
        >
            {children}
        </h1>
    ),
    h2: ({ children, ...props }) => (
        <h2
            className="text-3xl font-bold mt-10 mb-5 pb-3 border-b border-slate-200 dark:border-slate-800 scroll-mt-20"
            id={slugify(children)}
            {...props}
        >
            {children}
        </h2>
    ),
    h3: ({ children, ...props }) => (
        <h3
            className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-slate-100 scroll-mt-20"
            id={slugify(children)}
            {...props}
        >
            {children}
        </h3>
    ),
    h4: ({ children, ...props }) => (
        <h4
            className="text-xl font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200 scroll-mt-20"
            id={slugify(children)}
            {...props}
        >
            {children}
        </h4>
    ),

    // Enhanced paragraphs
    p: ({ children, ...props }) => (
        <p className="my-5 leading-8 text-slate-700 dark:text-slate-300 text-base" {...props}>
            {children}
        </p>
    ),

    // Styled links with hover effect
    a: ({ href, children, ...props }) => (
        <a
            href={href}
            className="text-primary hover:text-primary/80 underline decoration-2 decoration-primary/30 hover:decoration-primary/60 underline-offset-2 transition-all font-medium"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
        >
            {children}
        </a>
    ),

    // Enhanced lists with better spacing
    ul: ({ children, ...props }) => (
        <ul className="my-6 ml-6 space-y-3 list-none" {...props}>
            {children}
        </ul>
    ),
    ol: ({ children, ...props }) => (
        <ol className="my-6 ml-6 space-y-3 list-decimal marker:text-primary marker:font-semibold" {...props}>
            {children}
        </ol>
    ),
    li: ({ children, ...props }) => (
        <li className="pl-2 leading-7" {...props}>
            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-3 -ml-6"></span>
            {children}
        </li>
    ),

    // Enhanced blockquotes with callout support
    blockquote: ({ children, ...props }) => {
        // Try to extract text content for callout detection
        const firstChild = Array.isArray(children) ? children[0] : children
        let textContent = ''

        try {
            // Check if it's a paragraph with text
            if (firstChild?.props?.children) {
                const innerContent = firstChild.props.children
                textContent = typeof innerContent === 'string' ? innerContent : ''
            } else if (typeof firstChild === 'string') {
                textContent = firstChild
            }
        } catch (e) {
            // If we can't extract text, just render as blockquote
        }

        const calloutMatch = textContent.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/)

        if (calloutMatch) {
            const type = calloutMatch[1].toLowerCase()
            // Remove the callout marker from content
            const cleanedContent = textContent.replace(/^\[!.*?\]\s*/, '')
            return <Callout type={type}>{cleanedContent}</Callout>
        }

        return (
            <blockquote
                className="my-6 pl-6 py-4 border-l-4 border-primary bg-primary/5 rounded-r-lg italic text-slate-600 dark:text-slate-400"
                {...props}
            >
                {children}
            </blockquote>
        )
    },

    // Beautiful tables
    table: ({ children, ...props }) => (
        <div className="my-8 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full border-collapse" {...props}>
                {children}
            </table>
        </div>
    ),
    thead: ({ children, ...props }) => (
        <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900" {...props}>
            {children}
        </thead>
    ),
    th: ({ children, ...props }) => (
        <th
            className="px-6 py-4 text-left font-bold text-sm text-slate-900 dark:text-slate-100 border-b-2 border-slate-300 dark:border-slate-700"
            {...props}
        >
            {children}
        </th>
    ),
    tbody: ({ children, ...props }) => (
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800" {...props}>
            {children}
        </tbody>
    ),
    tr: ({ children, ...props }) => (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors" {...props}>
            {children}
        </tr>
    ),
    td: ({ children, ...props }) => (
        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300" {...props}>
            {children}
        </td>
    ),

    // Enhanced images with captions and styling (fixed nesting)
    img: ({ src, alt, ...props }) => (
        <span className="block my-8">
            <span className="block rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-auto"
                    loading="lazy"
                    {...props}
                />
            </span>
            {alt && (
                <span className="block mt-3 text-center text-sm text-slate-600 dark:text-slate-400 italic">
                    {alt}
                </span>
            )}
        </span>
    ),

    // Horizontal rule with style
    hr: ({ ...props }) => (
        <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" {...props} />
    ),

    // Strong and emphasis
    strong: ({ children, ...props }) => (
        <strong className="font-bold text-slate-900 dark:text-slate-100" {...props}>
            {children}
        </strong>
    ),
    em: ({ children, ...props }) => (
        <em className="italic text-slate-800 dark:text-slate-200" {...props}>
            {children}
        </em>
    ),
}

// Helper to create slug from heading text
function slugify(children) {
    return String(children)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export default function MarkdownContent({ content }) {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
