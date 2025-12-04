import { useState, useEffect } from 'react'
import { X, Download, Upload, History, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { usePipelineStore } from '../../stores/pipelineStore'
import { useUserStore } from '../../stores/userStore'

export default function StateInspector({ isOpen, onClose }) {
    const [selectedStore, setSelectedStore] = useState('pipeline')
    const [showHistory, setShowHistory] = useState(true)
    const [jsonView, setJsonView] = useState(true)

    const pipelineState = usePipelineStore()
    const userState = useUserStore()

    const stores = {
        pipeline: pipelineState,
        user: userState,
    }

    const currentState = stores[selectedStore]

    const handleExportState = () => {
        const state = {
            pipeline: {
                nodes: pipelineState.nodes,
                edges: pipelineState.edges,
                config: pipelineState.config,
                history: pipelineState.history,
            },
            user: {
                user: userState.user,
                preferences: userState.preferences,
            },
            exportedAt: new Date().toISOString(),
        }

        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `state-export-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImportState = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = (e) => {
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    try {
                        const state = JSON.parse(event.target.result)

                        if (state.pipeline) {
                            pipelineState.setNodes(state.pipeline.nodes || [])
                            pipelineState.setEdges(state.pipeline.edges || [])
                            pipelineState.setConfig(state.pipeline.config || {})
                        }

                        if (state.user) {
                            userState.setUser(state.user.user)
                            userState.updatePreferences(state.user.preferences || {})
                        }

                        alert('State imported successfully!')
                    } catch (err) {
                        alert('Error importing state: ' + err.message)
                    }
                }
                reader.readAsText(file)
            }
        }
        input.click()
    }

    const handleClearHistory = () => {
        if (confirm('Clear undo/redo history? This cannot be undone.')) {
            pipelineState.clearHistory()
        }
    }

    const handleUndo = () => {
        pipelineState.undo()
    }

    const handleRedo = () => {
        pipelineState.redo()
    }

    if (!isOpen) return null

    // Only show in development
    if (process.env.NODE_ENV === 'production') {
        return null
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold">🔍 State Inspector</h2>
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                            DEV ONLY
                        </span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-accent rounded">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Store Selector */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium">Store:</span>
                    <div className="flex gap-1">
                        {Object.keys(stores).map((store) => (
                            <Button
                                key={store}
                                variant={selectedStore === store ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedStore(store)}
                            >
                                {store}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                    <Button variant="outline" size="sm" onClick={handleExportState}>
                        <Download className="h-4 w-4 mr-2" />
                        Export State
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleImportState}>
                        <Upload className="h-4 w-4 mr-2" />
                        Import State
                    </Button>

                    {selectedStore === 'pipeline' && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleUndo}
                                disabled={!pipelineState.canUndo()}
                            >
                                ← Undo
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRedo}
                                disabled={!pipelineState.canRedo()}
                            >
                                Redo →
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleClearHistory}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear History
                            </Button>
                        </>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHistory(!showHistory)}
                        >
                            <History className="h-4 w-4 mr-2" />
                            {showHistory ? 'Hide' : 'Show'} History
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setJsonView(!jsonView)}
                        >
                            {jsonView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex gap-4">
                    {/* State View */}
                    <div className="flex-1 overflow-auto">
                        <div className="bg-muted rounded-lg p-4">
                            <pre className="text-xs font-mono">
                                {JSON.stringify(
                                    selectedStore === 'pipeline'
                                        ? {
                                            nodes: currentState.nodes,
                                            edges: currentState.edges,
                                            config: currentState.config,
                                            selectedNode: currentState.selectedNode,
                                        }
                                        : currentState,
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                    </div>

                    {/* History View */}
                    {showHistory && selectedStore === 'pipeline' && (
                        <div className="w-64 flex flex-col">
                            <h3 className="font-semibold mb-2 text-sm">History</h3>
                            <div className="flex-1 overflow-auto space-y-2">
                                {/* Future states */}
                                {pipelineState.history.future.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Future ({pipelineState.history.future.length})</p>
                                        {pipelineState.history.future.slice(0, 5).map((state, i) => (
                                            <div
                                                key={`future-${i}`}
                                                className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded text-xs opacity-50"
                                            >
                                                {state.nodes.length} nodes, {state.edges.length} edges
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Current state */}
                                <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded text-xs border-2 border-green-500">
                                    <strong>Current</strong>
                                    <div>{pipelineState.nodes.length} nodes, {pipelineState.edges.length} edges</div>
                                </div>

                                {/* Past states */}
                                {pipelineState.history.past.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Past ({pipelineState.history.past.length})</p>
                                        {pipelineState.history.past.slice(-5).reverse().map((state, i) => (
                                            <div
                                                key={`past-${i}`}
                                                className="p-2 bg-muted rounded text-xs"
                                            >
                                                {state.nodes.length} nodes, {state.edges.length} edges
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats */}
                {selectedStore === 'pipeline' && (
                    <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold">{pipelineState.nodes.length}</div>
                                <div className="text-xs text-muted-foreground">Nodes</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{pipelineState.edges.length}</div>
                                <div className="text-xs text-muted-foreground">Edges</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{pipelineState.history.past.length}</div>
                                <div className="text-xs text-muted-foreground">Past States</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{pipelineState.history.future.length}</div>
                                <div className="text-xs text-muted-foreground">Future States</div>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
