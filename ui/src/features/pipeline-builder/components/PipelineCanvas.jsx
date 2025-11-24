import { useState, useCallback } from 'react'
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { usePipelineStore } from '../../../stores/pipelineStore'
import CustomNode from '../nodes/CustomNode'

const nodeTypes = {
    custom: CustomNode,
}

export default function PipelineCanvas() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
    } = usePipelineStore()

    return (
        <div className="flex-1 h-full bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-background"
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={16}
                    size={1}
                    className="bg-background"
                />
                <Controls className="bg-card border" />
                <MiniMap
                    className="bg-card border"
                    nodeStrokeWidth={3}
                    zoomable
                    pannable
                />
            </ReactFlow>
        </div>
    )
}
