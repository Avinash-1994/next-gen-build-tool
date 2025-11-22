import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { docsNavigation } from '../data/docsData'
import { cn } from '../../../lib/utils'

function NavSection({ section, isActive }) {
    const [isOpen, setIsOpen] = useState(isActive)
    const location = useLocation()

    const hasItems = section.items && section.items.length > 0

    if (!hasItems) {
        // Single item section (like FAQ)
        const isCurrentPage = location.pathname === section.path
        return (
            <Link
                to={section.path}
                className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    isCurrentPage
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'hover:bg-accent'
                )}
            >
                <span>{section.icon}</span>
                <span>{section.title}</span>
            </Link>
        )
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors"
            >
                {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                ) : (
                    <ChevronRight className="h-4 w-4" />
                )}
                <span>{section.icon}</span>
                <span className="font-medium">{section.title}</span>
            </button>

            {isOpen && (
                <div className="ml-6 mt-1 space-y-1">
                    {section.items.map((item) => {
                        const isCurrentPage = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    'block px-3 py-1.5 rounded-lg text-sm transition-colors',
                                    isCurrentPage
                                        ? 'bg-primary text-primary-foreground font-medium'
                                        : 'hover:bg-accent'
                                )}
                            >
                                {item.title}
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default function DocsSidebar() {
    const location = useLocation()

    // Determine which section is active
    const getActiveSectionIndex = () => {
        for (let i = 0; i < docsNavigation.length; i++) {
            const section = docsNavigation[i]
            if (section.items) {
                if (section.items.some(item => item.path === location.pathname)) {
                    return i
                }
            } else if (section.path === location.pathname) {
                return i
            }
        }
        return 0 // Default to first section
    }

    return (
        <aside className="w-64 border-r bg-card h-full overflow-y-auto">
            <div className="p-4 space-y-1">
                <div className="mb-4">
                    <h2 className="text-lg font-bold mb-1">Documentation</h2>
                    <p className="text-xs text-muted-foreground">
                        Complete guide to the Next-Gen Build Tool
                    </p>
                </div>

                {docsNavigation.map((section, index) => (
                    <NavSection
                        key={section.path}
                        section={section}
                        isActive={index === getActiveSectionIndex()}
                    />
                ))}
            </div>
        </aside>
    )
}
