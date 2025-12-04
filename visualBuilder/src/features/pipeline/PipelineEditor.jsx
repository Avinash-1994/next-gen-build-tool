import React, { useCallback, useEffect, useState } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCollaboration } from '../../hooks/useCollaboration';

const initialNodes = [
    { id: '1', position: { x: 100, y: 100 }, data: { label: 'Resolver' }, type: 'input' },
    { id: '2', position: { x: 300, y: 100 }, data: { label: 'Transformer' } },
    { id: '3', position: { x: 500, y: 100 }, data: { label: 'Bundler' } },
    { id: '4', position: { x: 700, y: 100 }, data: { label: 'Optimizer' } },
    { id: '5', position: { x: 900, y: 100 }, data: { label: 'Outputter' }, type: 'output' },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
    { id: 'e4-5', source: '4', target: '5', animated: true },
];

export default function PipelineEditor() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { sendCursorMove, cursors } = useCollaboration();

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onMouseMove = (event) => {
        // Send normalized coordinates (0-1) to handle different screen sizes
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        sendCursorMove(x, y);
    };

    return (
        <div className="h-[calc(100vh-4rem)] w-full" onMouseMove={onMouseMove}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />

                <Panel position="top-right" className="bg-card p-4 rounded shadow border border-border" role="complementary" aria-label="Pipeline Instructions">
                    <h3 className="font-bold mb-2">Pipeline Steps</h3>
                    <div className="text-sm text-muted-foreground">
                        Drag nodes to rearrange the build pipeline.
                    </div>
                </Panel>

                {/* Render Remote Cursors */}
                {Object.entries(cursors).map(([id, cursor]) => (
                    <div
                        key={id}
                        className="absolute pointer-events-none z-50 flex items-center gap-1"
                        style={{
                            left: `${cursor.x * 100}%`,
                            top: `${cursor.y * 100}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#EF4444" stroke="white" strokeWidth="2" />
                        </svg>
                        <span className="bg-red-500 text-white text-xs px-1 rounded">
                            {cursor.user}
                        </span>
                    </div>
                ))}
            </ReactFlow>
        </div>
    );
}
