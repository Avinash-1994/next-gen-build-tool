import { useState, useEffect, useCallback, useMemo } from 'react'
import { Save, Download, Upload, Trash2, Code, BarChart3, Undo2, Redo2, FolderOpen, Bug } from 'lucide-react'
import { usePipelineStore } from '../../stores/pipelineStore'
import { useOnboardingStore } from '../../stores/onboardingStore'
import { Button } from '../../components/ui/Button'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { useAutoSave } from '../../hooks/usePersistence'
import Storage from '../../lib/storage'
import NodeLibrary from './components/NodeLibrary'
import PipelineCanvas from './components/PipelineCanvas'
import PropertyPanel from './components/PropertyPanel'
import ConfigEditor from './components/ConfigEditor'
import BuildControls from './components/BuildControls'
import Analytics from './components/Analytics'
import SaveDialog from './components/SaveDialog'
import PipelineManager from './components/PipelineManager'
import SaveStatus from './components/SaveStatus'
import StateInspector from '../../components/debug/StateInspector'
import WelcomeModal from '../../components/onboarding/WelcomeModal'
import ProductTour from '../../components/onboarding/ProductTour'

export default function PipelineBuilder() {
    const { nodes, edges, generateConfig, reset, undo, redo, canUndo, canRedo, selectedNode, deleteNode, initHistory, clearSelection, loadConfig } = usePipelineStore()
    const { hasSeenWelcome, showWelcome, showTour, setWelcomeSeen, startTour, completeTour, skipTour } = useOnboardingStore()
    const [showConfigEditor, setShowConfigEditor] = useState(false)
    const [showAnalytics, setShowAnalytics] = useState(false)
    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const [showPipelineManager, setShowPipelineManager] = useState(false)
    const [showStateInspector, setShowStateInspector] = useState(false)
    const [currentPipelineId, setCurrentPipelineId] = useState(null)
    const [currentPipelineName, setCurrentPipelineName] = useState('')

    // Restore autosave with useCallback
    const restoreAutosave = useCallback(async () => {
        try {
            const autosaved = await Storage.getAutosavedPipeline()
            if (autosaved && autosaved.nodes && autosaved.nodes.length > 0) {
                const shouldRestore = confirm(
                    'Found an auto-saved pipeline. Would you like to restore it?'
                )
                if (shouldRestore) {
                    loadConfig(autosaved)
                }
            }
        } catch (err) {
            console.error('Error restoring autosave:', err)
        }
    }, [loadConfig])

    // Initialize history on mount
    useEffect(() => {
        initHistory()
        restoreAutosave()

        // Show welcome modal for first-time users
        if (!hasSeenWelcome) {
            // Delay slightly to ensure UI is rendered
            setTimeout(() => {
                useOnboardingStore.setState({ showWelcome: true })
            }, 1000)
        }
    }, [initHistory, restoreAutosave, hasSeenWelcome])

    // Memoize pipeline data to avoid calling generateConfig on every render
    const pipelineData = useMemo(() => {
        try {
            return { nodes, edges, config: generateConfig() }
        } catch (error) {
            console.error('Error generating config:', error)
            return { nodes, edges, config: {} }
        }
    }, [nodes, edges, generateConfig])

    // Auto-save pipeline every 5 seconds
    const { isSaving, lastSaved, error: saveError } = useAutoSave(
        pipelineData,
        async (data) => {
            await Storage.autosavePipeline(data)
        },
        {
            interval: 5000,
            enabled: nodes.length > 0, // Only auto-save if there are nodes
        }
    )

    const handleSaveAs = async ({ name, description }) => {
        const config = generateConfig()
        const pipelineData = {
            name,
            description,
            pipeline: config.pipeline,
            connections: config.connections,
        }

        try {
            const id = await Storage.db.savePipeline(pipelineData)
            setCurrentPipelineId(id)
            setCurrentPipelineName(name)
            alert(`Pipeline "${name}" saved successfully!`)
        } catch (err) {
            throw new Error('Failed to save pipeline')
        }
    }

    const handleSave = () => {
        if (currentPipelineId) {
            // Update existing pipeline
            handleSaveAs({
                id: currentPipelineId,
                name: currentPipelineName || 'Untitled Pipeline',
                description: '',
            })
        } else {
            // Show save dialog for new pipeline
            setShowSaveDialog(true)
        }
    }

    const handleLoadPipeline = (pipeline) => {
        loadConfig({
            pipeline: pipeline.pipeline,
            connections: pipeline.connections,
        })
        setCurrentPipelineId(pipeline.id)
        setCurrentPipelineName(pipeline.name)
    }

    const handleExport = () => {
        const config = generateConfig()
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${currentPipelineName || 'pipeline'}.json`.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImport = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = (e) => {
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    try {
                        const config = JSON.parse(event.target.result)
                        loadConfig(config)
                        setCurrentPipelineId(null)
                        setCurrentPipelineName(config.name || '')
                        alert('Configuration loaded successfully!')
                    } catch (err) {
                        alert('Error loading configuration: ' + err.message)
                    }
                }
                reader.readAsText(file)
            }
        }
        input.click()
    }

    const handleClear = () => {
        if (confirm('Are you sure you want to clear the pipeline?')) {
            reset()
            setCurrentPipelineId(null)
            setCurrentPipelineName('')
        }
    }

    const handleDelete = () => {
        if (selectedNode) {
            deleteNode(selectedNode.id)
        }
    }

    // Onboarding handlers
    const handleWelcomeClose = (dontShowAgain) => {
        if (dontShowAgain) {
            setWelcomeSeen()
        }
        useOnboardingStore.setState({ showWelcome: false })
    }

    const handleStartTour = () => {
        startTour()
    }

    const handleTourComplete = () => {
        completeTour()
    }

    const handleTourSkip = () => {
        skipTour()
    }

    // Keyboard shortcuts
    useKeyboardShortcuts({
        onUndo: () => canUndo() && undo(),
        onRedo: () => canRedo() && redo(),
        onSave: handleSave,
        onNew: handleClear,
        onDelete: handleDelete,
        onEscape: clearSelection,
        onDebug: () => setShowStateInspector(!showStateInspector),
    })

    // Save status
    const saveStatus = saveError ? 'error' : isSaving ? 'saving' : lastSaved ? 'saved' : nodes.length > 0 ? 'unsaved' : null

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)]">
            {/* Toolbar */}
            <div className="border-b bg-card px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">
                                {currentPipelineName || 'Pipeline Builder'}
                            </h1>
                            {saveStatus && <SaveStatus status={saveStatus} lastSaved={lastSaved} />}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {nodes.length} node{nodes.length !== 1 ? 's' : ''} in pipeline
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Undo/Redo */}
                        <div className="flex items-center gap-1 mr-2 pr-2 border-r">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={undo}
                                disabled={!canUndo()}
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={redo}
                                disabled={!canRedo()}
                                title="Redo (Ctrl+Y)"
                            >
                                <Redo2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <Button
                            variant={showAnalytics ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowAnalytics(!showAnalytics)}
                        >
                            <BarChart3 className="h-4 w-4 mr-1.5" />
                            {showAnalytics ? 'Hide' : 'Show'} Analytics
                        </Button>
                        <Button
                            variant={showConfigEditor ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowConfigEditor(!showConfigEditor)}
                        >
                            <Code className="h-4 w-4 mr-1.5" />
                            {showConfigEditor ? 'Hide' : 'Show'} Config
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPipelineManager(true)}
                        >
                            <FolderOpen className="h-4 w-4 mr-1.5" />
                            Open
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleImport}>
                            <Upload className="h-4 w-4 mr-1.5" />
                            Import
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="h-4 w-4 mr-1.5" />
                            Export
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleClear}>
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            Clear
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4 mr-1.5" />
                            {currentPipelineId ? 'Save' : 'Save As...'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Analytics Row */}
                {showAnalytics && (
                    <div className="p-4 border-b">
                        <Analytics />
                    </div>
                )}

                {/* Canvas Row */}
                <div className="flex flex-1 overflow-hidden">
                    <NodeLibrary />

                    <div className="flex flex-1">
                        {showConfigEditor ? (
                            <>
                                <div className="flex-1">
                                    <PipelineCanvas />
                                </div>
                                <div className="w-[500px]">
                                    <ConfigEditor />
                                </div>
                            </>
                        ) : (
                            <PipelineCanvas />
                        )}
                    </div>

                    <PropertyPanel />
                </div>

                {/* Build Console Row */}
                <div className="h-48 border-t p-4">
                    <BuildControls />
                </div>
            </div>

            {/* Dialogs */}
            <SaveDialog
                isOpen={showSaveDialog}
                onClose={() => setShowSaveDialog(false)}
                onSave={handleSaveAs}
                initialName={currentPipelineName}
            />
            <PipelineManager
                isOpen={showPipelineManager}
                onClose={() => setShowPipelineManager(false)}
                onLoad={handleLoadPipeline}
            />
            <StateInspector
                isOpen={showStateInspector}
                onClose={() => setShowStateInspector(false)}
            />

            {/* Onboarding */}
            <WelcomeModal
                isOpen={showWelcome}
                onClose={handleWelcomeClose}
                onStartTour={handleStartTour}
            />
            <ProductTour
                run={showTour}
                onComplete={handleTourComplete}
                onSkip={handleTourSkip}
            />
        </div>
    )
}
