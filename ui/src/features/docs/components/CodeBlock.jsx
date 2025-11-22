import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneDark, github } from 'react-syntax-highlighter/dist/esm/styles/hljs'

// Import specific languages to reduce bundle size
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import jsx from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css'
import dockerfile from 'react-syntax-highlighter/dist/esm/languages/hljs/dockerfile'
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml'

SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('js', javascript)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('ts', typescript)
SyntaxHighlighter.registerLanguage('tsx', typescript)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('sh', bash)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('dockerfile', dockerfile)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('yml', yaml)

export default function CodeBlock({ language, code, filename }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="group my-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            {(filename || language) && (
                <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b-2 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-semibold">
                            {filename || language}
                        </span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg transition-all shadow-sm hover:shadow"
                        title="Copy code"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span className="text-green-600 dark:text-green-400 font-semibold">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                <span className="text-slate-600 dark:text-slate-400">Copy</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            <div className="relative">
                {!filename && !language && (
                    <button
                        onClick={handleCopy}
                        className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-slate-800/90 hover:bg-slate-700 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Copy code"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 text-green-400" />
                                <span className="text-green-400">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 text-white" />
                                <span className="text-white">Copy</span>
                            </>
                        )}
                    </button>
                )}

                <SyntaxHighlighter
                    language={language || 'text'}
                    style={atomOneDark}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '0.9rem',
                        lineHeight: '1.7',
                    }}
                    codeTagProps={{
                        style: {
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                            fontWeight: '500',
                        },
                    }}
                    showLineNumbers={code.split('\n').length > 5}
                    lineNumberStyle={{
                        minWidth: '3em',
                        paddingRight: '1em',
                        color: '#6B7280',
                        opacity: 0.5,
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}
