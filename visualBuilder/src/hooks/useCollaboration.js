import { useEffect, useRef, useState } from 'react';

export function useCollaboration() {
    const ws = useRef(null);
    const [cursors, setCursors] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    // Throttle cursor updates
    const lastUpdate = useRef(0);

    useEffect(() => {
        // Connect to builder server
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = '3030'; // Builder server port

        ws.current = new WebSocket(`${protocol}//${host}:${port}`);

        ws.current.onopen = () => {
            console.log('[collab] Connected to builder server');
            setIsConnected(true);
            // Request initial config
            ws.current.send(JSON.stringify({ type: 'get_config' }));
        };

        ws.current.onclose = () => {
            console.log('[collab] Disconnected');
            setIsConnected(false);
        };

        ws.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                handleMessage(message);
            } catch (e) {
                console.error('[collab] Failed to parse message:', e);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const handleMessage = (message) => {
        switch (message.type) {
            case 'cursor_update':
                setCursors(prev => ({
                    ...prev,
                    [message.id]: { x: message.x, y: message.y, user: message.user }
                }));
                break;
            case 'config_update':
                // Dispatch event for other components to listen to
                window.dispatchEvent(new CustomEvent('builder:config-update', {
                    detail: message.config
                }));
                break;
        }
    };

    const sendCursorMove = (x, y) => {
        const now = Date.now();
        if (now - lastUpdate.current > 50 && ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type: 'cursor_move',
                x,
                y,
                user: 'User-' + Math.floor(Math.random() * 1000) // Simple ID for now
            }));
            lastUpdate.current = now;
        }
    };

    return {
        isConnected,
        cursors,
        sendCursorMove
    };
}
