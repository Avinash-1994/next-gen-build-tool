import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

export default function SaveDialog({ isOpen, onClose, onSave, initialName = '' }) {
    const [name, setName] = useState(initialName)
    const [description, setDescription] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isOpen) {
            setName(initialName)
            setDescription('')
            setError(null)
        }
    }, [isOpen, initialName])

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Please enter a pipeline name')
            return
        }

        setIsSaving(true)
        setError(null)

        try {
            await onSave({ name: name.trim(), description: description.trim() })
            onClose()
        } catch (err) {
            setError(err.message || 'Failed to save pipeline')
        } finally {
            setIsSaving(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSave()
        } else if (e.key === 'Escape') {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Save Pipeline</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-accent rounded"
                        disabled={isSaving}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Pipeline Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="My Awesome Pipeline"
                            className="w-full px-3 py-2 border rounded-lg bg-background"
                            autoFocus
                            disabled={isSaving}
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description (optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="What does this pipeline do?"
                            className="w-full px-3 py-2 border rounded-lg bg-background resize-none"
                            rows={3}
                            disabled={isSaving}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={onClose} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Pipeline
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
