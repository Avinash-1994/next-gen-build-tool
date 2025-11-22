import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
    return (
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            {items.map((item, index) => (
                <div key={item.path} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight className="h-3 w-3" />}
                    {index === items.length - 1 ? (
                        <span className="font-medium text-foreground">{item.title}</span>
                    ) : (
                        <Link
                            to={item.path}
                            className="hover:text-foreground transition-colors"
                        >
                            {item.title}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    )
}
