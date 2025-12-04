import { Check, Clock, AlertCircle } from 'lucide-react'

export default function SaveStatus({ status, lastSaved }) {
    const formatTime = (date) => {
        if (!date) return ''

        const now = new Date()
        const diff = now - new Date(date)
        const seconds = Math.floor(diff / 1000)
        const minutes = Math.floor(seconds / 60)

        if (seconds < 10) return 'just now'
        if (seconds < 60) return `${seconds}s ago`
        if (minutes < 60) return `${minutes}m ago`

        return new Date(date).toLocaleTimeString()
    }

    if (status === 'saving') {
        return (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                <span>Saving...</span>
            </div>
        )
    }

    if (status === 'saved') {
        return (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Check className="h-3 w-3" />
                <span>Saved {lastSaved && formatTime(lastSaved)}</span>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                <span>Save failed</span>
            </div>
        )
    }

    if (status === 'unsaved') {
        return (
            <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                <Clock className="h-3 w-3" />
                <span>Unsaved changes</span>
            </div>
        )
    }

    return null
}
