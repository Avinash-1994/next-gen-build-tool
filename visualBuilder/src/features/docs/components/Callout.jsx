import { Info, Lightbulb, AlertTriangle, AlertCircle, XCircle } from 'lucide-react'
import { cn } from '../../../lib/utils'

const calloutStyles = {
    note: {
        icon: Info,
        className: 'bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-900 dark:text-blue-100',
        iconClassName: 'text-blue-500',
    },
    tip: {
        icon: Lightbulb,
        className: 'bg-green-50 dark:bg-green-950/30 border-green-500 text-green-900 dark:text-green-100',
        iconClassName: 'text-green-500',
    },
    important: {
        icon: AlertCircle,
        className: 'bg-purple-50 dark:bg-purple-950/30 border-purple-500 text-purple-900 dark:text-purple-100',
        iconClassName: 'text-purple-500',
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-500 text-yellow-900 dark:text-yellow-100',
        iconClassName: 'text-yellow-500',
    },
    caution: {
        icon: XCircle,
        className: 'bg-red-50 dark:bg-red-950/30 border-red-500 text-red-900 dark:text-red-100',
        iconClassName: 'text-red-500',
    },
}

export default function Callout({ type = 'note', title, children }) {
    const style = calloutStyles[type] || calloutStyles.note
    const Icon = style.icon

    return (
        <div className={cn('my-6 p-4 rounded-lg border-l-4', style.className)}>
            <div className="flex gap-3">
                <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', style.iconClassName)} />
                <div className="flex-1">
                    {title && (
                        <div className="font-semibold mb-1 capitalize">{title || type}</div>
                    )}
                    <div className="text-sm leading-relaxed">{children}</div>
                </div>
            </div>
        </div>
    )
}
