import { Search, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import { getAllDocPages } from '../data/docsData'

export default function DocsSearch() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const navigate = useNavigate()
    const inputRef = useRef(null)
    const fuse = useRef(null)

    // Initialize Fuse.js
    useEffect(() => {
        const pages = getAllDocPages()
        fuse.current = new Fuse(pages, {
            keys: ['title', 'section'],
            threshold: 0.3,
            includeScore: true,
        })
    }, [])

    // Keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(true)
            }
            if (e.key === 'Escape') {
                setIsOpen(false)
                setQuery('')
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    // Search
    useEffect(() => {
        if (query.trim() === '') {
            setResults([])
            return
        }

        if (fuse.current) {
            const searchResults = fuse.current.search(query)
            setResults(searchResults.slice(0, 5).map(r => r.item))
        }
    }, [query])

    const handleSelect = (path) => {
        navigate(path)
        setIsOpen(false)
        setQuery('')
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-accent transition-colors w-full max-w-sm"
            >
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Search docs...</span>
                <kbd className="ml-auto px-2 py-0.5 text-xs bg-secondary rounded border">
                    {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} K
                </kbd>
            </button>
        )
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsOpen(false)}
            />

            {/* Search Modal */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-card border rounded-lg shadow-lg z-50">
                <div className="flex items-center gap-2 p-4 border-b">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search documentation..."
                        className="flex-1 bg-transparent outline-none"
                    />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-accent rounded"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {query && results.length > 0 && (
                    <div className="max-h-96 overflow-y-auto">
                        {results.map((result, index) => (
                            <button
                                key={result.path}
                                onClick={() => handleSelect(result.path)}
                                className="w-full text-left p-4 hover:bg-accent transition-colors border-b last:border-b-0"
                            >
                                <div className="font-medium">{result.title}</div>
                                <div className="text-sm text-muted-foreground">{result.section}</div>
                            </button>
                        ))}
                    </div>
                )}

                {query && results.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        No results found for "{query}"
                    </div>
                )}

                {!query && (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        Start typing to search documentation
                    </div>
                )}
            </div>
        </>
    )
}
