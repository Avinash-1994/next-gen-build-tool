import { useState, useEffect } from 'react'
import { X, FolderOpen, Trash2, Download, Search, Clock, FileText } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import Storage from '../../../lib/storage'

export default function PipelineManager({ isOpen, onClose, onLoad }) {
    const [pipelines, setPipelines] = useState([])
    const [filteredPipelines, setFilteredPipelines] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // Load pipelines
    useEffect(() => {
        if (isOpen) {
            loadPipelines()
        }
    }, [isOpen])

    // Filter pipelines when search query changes
    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = pipelines.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            setFilteredPipelines(filtered)
        } else {
            setFilteredPipelines(pipelines)
        }
    }, [searchQuery, pipelines])

    const loadPipelines = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const allPipelines = await Storage.db.getAllPipelines()
            // Sort by updatedAt descending
            allPipelines.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            setPipelines(allPipelines)
            setFilteredPipelines(allPipelines)
        } catch (err) {
            setError('Failed to load pipelines')
            console.error('Error loading pipelines:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLoad = (pipeline) => {
        onLoad(pipeline)
        onClose()
    }

    const handleDelete = async (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await Storage.db.deletePipeline(id)
                await loadPipelines() // Refresh list
            } catch (err) {
                alert('Failed to delete pipeline')
                console.error('Error deleting pipeline:', err)
            }
        }
    }

    const handleExport = (pipeline) => {
        const exportData = {
            name: pipeline.name,
            description: pipeline.description,
            pipeline: pipeline.pipeline,
            connections: pipeline.connections,
            exportedAt: new Date().toISOString(),
        }

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${pipeline.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`

        return date.toLocaleDateString()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Saved Pipelines</h2>
                    <button onClick={onClose} className="p-1 hover:bg-accent rounded">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search pipelines..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                                <p className="mt-2 text-sm text-muted-foreground">Loading pipelines...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <p className="text-red-600 dark:text-red-400">{error}</p>
                                <Button onClick={loadPipelines} variant="outline" size="sm" className="mt-2">
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    ) : filteredPipelines.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">
                                    {searchQuery ? 'No pipelines found' : 'No saved pipelines yet'}
                                </p>
                                {!searchQuery && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Create a pipeline and click Save to store it
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredPipelines.map((pipeline) => (
                                <div
                                    key={pipeline.id}
                                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">{pipeline.name}</h3>
                                            {pipeline.description && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {pipeline.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDate(pipeline.updatedAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FileText className="h-3 w-3" />
                                                    {pipeline.pipeline?.length || 0} nodes
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleLoad(pipeline)}
                                                title="Load pipeline"
                                            >
                                                <FolderOpen className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleExport(pipeline)}
                                                title="Export as JSON"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(pipeline.id, pipeline.name)}
                                                title="Delete pipeline"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isLoading && !error && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground text-center">
                            {filteredPipelines.length} pipeline{filteredPipelines.length !== 1 ? 's' : ''}
                            {searchQuery && ' found'}
                        </p>
                    </div>
                )}
            </Card>
        </div>
    )
}
