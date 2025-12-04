import { useEffect, useCallback } from 'react'

export function useKeyboardShortcuts(handlers) {
    const handleKeyDown = useCallback(
        (event) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
            const ctrlKey = isMac ? event.metaKey : event.ctrlKey

            // Check if we're in an input field
            const isInput = ['INPUT', 'TEXTAREA'].includes(event.target.tagName)
            const isContentEditable = event.target.isContentEditable

            // Debug Tools: Ctrl/Cmd + Shift + D
            if (ctrlKey && event.shiftKey && event.key === 'D' && !isInput) {
                event.preventDefault()
                handlers.onDebug?.()
            }

            // Undo: Ctrl/Cmd + Z
            if (ctrlKey && event.key === 'z' && !event.shiftKey && !isInput) {
                event.preventDefault()
                handlers.onUndo?.()
            }

            // Redo: Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z
            if (
                ((ctrlKey && event.key === 'y') || (ctrlKey && event.shiftKey && event.key === 'z')) &&
                !isInput
            ) {
                event.preventDefault()
                handlers.onRedo?.()
            }

            // Save: Ctrl/Cmd + S
            if (ctrlKey && event.key === 's' && !isInput) {
                event.preventDefault()
                handlers.onSave?.()
            }

            // New: Ctrl/Cmd + N
            if (ctrlKey && event.key === 'n' && !isInput && !isContentEditable) {
                event.preventDefault()
                handlers.onNew?.()
            }

            // Delete: Delete/Backspace (when not in input)
            if ((event.key === 'Delete' || event.key === 'Backspace') && !isInput && !isContentEditable) {
                event.preventDefault()
                handlers.onDelete?.()
            }

            // Duplicate: Ctrl/Cmd + D
            if (ctrlKey && event.key === 'd' && !event.shiftKey && !isInput) {
                event.preventDefault()
                handlers.onDuplicate?.()
            }

            // Select All: Ctrl/Cmd + A
            if (ctrlKey && event.key === 'a' && !isInput && !isContentEditable) {
                event.preventDefault()
                handlers.onSelectAll?.()
            }

            // Escape: Clear selection
            if (event.key === 'Escape') {
                handlers.onEscape?.()
            }
        },
        [handlers]
    )

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])
}
