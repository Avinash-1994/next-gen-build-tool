import { create } from 'zustand'
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'

// Helper to create a snapshot of the current state
const createSnapshot = (state) => ({
    nodes: JSON.parse(JSON.stringify(state.nodes)),
    edges: JSON.parse(JSON.stringify(state.edges)),
    config: JSON.parse(JSON.stringify(state.config)),
})

export const usePipelineStore = create((set, get) => ({
    nodes: [],
    edges: [],
    selectedNode: null,
    config: {},
    buildHistory: [],

    // Undo/Redo state
    history: {
        past: [],
        present: null,
        future: [],
        maxSize: 50,
    },

    // Initialize history with current state
    initHistory: () => {
        const snapshot = createSnapshot(get())
        set((state) => ({
            history: {
                ...state.history,
                present: snapshot,
            },
        }))
    },

    // Add current state to history before making changes
    pushHistory: () => {
        const { history, nodes, edges, config } = get()
        const snapshot = createSnapshot({ nodes, edges, config })

        // Don't add if state hasn't changed
        if (JSON.stringify(history.present) === JSON.stringify(snapshot)) {
            return
        }

        set((state) => ({
            history: {
                ...state.history,
                past: [...state.history.past, state.history.present].slice(-state.history.maxSize),
                present: snapshot,
                future: [], // Clear future when new action is performed
            },
        }))
    },

    // Undo action
    undo: () => {
        const { history } = get()
        if (history.past.length === 0) return

        const previous = history.past[history.past.length - 1]
        const newPast = history.past.slice(0, -1)

        set((state) => ({
            ...previous,
            selectedNode: null, // Clear selection on undo
            history: {
                ...state.history,
                past: newPast,
                present: previous,
                future: [state.history.present, ...state.history.future],
            },
        }))
    },

    // Redo action
    redo: () => {
        const { history } = get()
        if (history.future.length === 0) return

        const next = history.future[0]
        const newFuture = history.future.slice(1)

        set((state) => ({
            ...next,
            selectedNode: null, // Clear selection on redo
            history: {
                ...state.history,
                past: [...state.history.past, state.history.present],
                present: next,
                future: newFuture,
            },
        }))
    },

    // Check if can undo/redo
    canUndo: () => get().history.past.length > 0,
    canRedo: () => get().history.future.length > 0,

    // Clear history (e.g., after save)
    clearHistory: () => {
        set((state) => ({
            history: {
                ...state.history,
                past: [],
                future: [],
            },
        }))
    },

    // Node management (with history tracking)
    setNodes: (nodes) => {
        get().pushHistory()
        set({ nodes })
    },

    setEdges: (edges) => {
        get().pushHistory()
        set({ edges })
    },

    onNodesChange: (changes) => {
        // Only push history for non-selection changes
        const hasNonSelectionChanges = changes.some(
            (change) => change.type !== 'select' && change.type !== 'position'
        )

        if (hasNonSelectionChanges) {
            get().pushHistory()
        }

        set({
            nodes: applyNodeChanges(changes, get().nodes),
        })
    },

    onEdgesChange: (changes) => {
        // Only push history for non-selection changes
        const hasNonSelectionChanges = changes.some((change) => change.type !== 'select')

        if (hasNonSelectionChanges) {
            get().pushHistory()
        }

        set({
            edges: applyEdgeChanges(changes, get().edges),
        })
    },

    onConnect: (connection) => {
        get().pushHistory()
        set({
            edges: addEdge(connection, get().edges),
        })
    },

    addNode: (node) => {
        get().pushHistory()
        set({
            nodes: [...get().nodes, node],
        })
    },

    deleteNode: (nodeId) => {
        get().pushHistory()
        set({
            nodes: get().nodes.filter((n) => n.id !== nodeId),
            edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
        })
    },

    updateNodeData: (nodeId, data) => {
        get().pushHistory()
        set({
            nodes: get().nodes.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
            ),
        })
    },

    selectNode: (nodeId) => {
        const node = get().nodes.find((n) => n.id === nodeId)
        set({ selectedNode: node })
    },

    clearSelection: () => set({ selectedNode: null }),

    // Config management
    setConfig: (config) => {
        get().pushHistory()
        set({ config })
    },

    updateConfig: (updates) => {
        get().pushHistory()
        set({
            config: { ...get().config, ...updates },
        })
    },

    // Generate config from nodes
    generateConfig: () => {
        const { nodes, edges } = get()
        const pipeline = nodes.map((node) => ({
            id: node.id,
            type: node.data.type,
            name: node.data.label,
            config: node.data.config || {},
            position: { x: node.position.x, y: node.position.y },
        }))

        const connections = edges.map((edge) => ({
            source: edge.source,
            target: edge.target,
        }))

        return {
            pipeline,
            connections,
        }
    },

    // Load config into nodes
    loadConfig: (config) => {
        get().pushHistory()
        if (config.pipeline) {
            const nodes = config.pipeline.map((step) => ({
                id: step.id,
                type: step.type || 'default',
                position: step.position || { x: 0, y: 0 },
                data: {
                    type: step.type,
                    label: step.name,
                    config: step.config || {},
                },
            }))

            const edges = config.connections || []

            set({ nodes, edges, config })
        }
    },

    // Reset pipeline
    reset: () => {
        get().pushHistory()
        set({ nodes: [], edges: [], selectedNode: null, config: {} })
    },
}))
