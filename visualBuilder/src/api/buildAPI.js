// API client for build tool server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api'
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3030/ws'

export class BuildAPI {
    // Save pipeline configuration
    static async saveConfig(config) {
        const response = await fetch(`${API_BASE_URL}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        })
        if (!response.ok) throw new Error('Failed to save configuration')
        return response.json()
    }

    // Load pipeline configuration
    static async loadConfig() {
        const response = await fetch(`${API_BASE_URL}/config`)
        if (!response.ok) throw new Error('Failed to load configuration')
        return response.json()
    }

    // Trigger a build
    static async startBuild(config) {
        const response = await fetch(`${API_BASE_URL}/build`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        })
        if (!response.ok) throw new Error('Failed to start build')
        return response.json()
    }

    // Stop a running build
    static async stopBuild(buildId) {
        const response = await fetch(`${API_BASE_URL}/build/${buildId}`, {
            method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to stop build')
        return response.json()
    }

    // Get build status
    static async getBuildStatus(buildId) {
        const response = await fetch(`${API_BASE_URL}/build/${buildId}/status`)
        if (!response.ok) throw new Error('Failed to get build status')
        return response.json()
    }

    // Get build metrics
    static async getMetrics() {
        const response = await fetch(`${API_BASE_URL}/metrics`)
        if (!response.ok) throw new Error('Failed to get metrics')
        return response.json()
    }

    // WebSocket connection for live build logs
    static connectWebSocket(onMessage, onError) {
        const ws = new WebSocket(`${WS_BASE_URL}/build-logs`)

        ws.onopen = () => {
            console.log('WebSocket connected')
        }

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                onMessage(data)
            } catch (err) {
                console.error('Failed to parse WebSocket message:', err)
            }
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
            if (onError) onError(error)
        }

        ws.onclose = () => {
            console.log('WebSocket disconnected')
        }

        return ws
    }
}

// Mock API for development (when backend is not available)
export class MockBuildAPI {
    static async saveConfig(config) {
        console.log('Mock: Saving config', config)
        localStorage.setItem('pipeline-config', JSON.stringify(config))
        return { success: true, message: 'Configuration saved locally' }
    }

    static async loadConfig() {
        console.log('Mock: Loading config')
        const config = localStorage.getItem('pipeline-config')
        return config ? JSON.parse(config) : null
    }

    static async startBuild(config) {
        console.log('Mock: Starting build', config)
        return {
            buildId: `build-${Date.now()}`,
            status: 'running',
            startTime: new Date().toISOString()
        }
    }

    static async stopBuild(buildId) {
        console.log('Mock: Stopping build', buildId)
        return { success: true, buildId, status: 'stopped' }
    }

    static async getBuildStatus(buildId) {
        console.log('Mock: Getting build status', buildId)
        return {
            buildId,
            status: 'completed',
            duration: 1200,
            exitCode: 0
        }
    }

    static async getMetrics() {
        console.log('Mock: Getting metrics')
        return {
            bundleSize: 245000,
            gzippedSize: 78000,
            buildTime: 1200,
            dependencies: 42,
            breakdown: {
                js: 180000,
                css: 45000,
                other: 20000
            }
        }
    }

    static connectWebSocket(onMessage, onError) {
        console.log('Mock: WebSocket connection (simulated)')

        // Simulate WebSocket messages
        const interval = setInterval(() => {
            const mockMessages = [
                { level: 'info', message: 'Resolving dependencies...', time: new Date().toISOString() },
                { level: 'info', message: 'Transforming source files...', time: new Date().toISOString() },
                { level: 'info', message: 'Bundling modules...', time: new Date().toISOString() },
                { level: 'success', message: '✓ Build completed successfully!', time: new Date().toISOString() },
            ]

            mockMessages.forEach((msg, index) => {
                setTimeout(() => onMessage(msg), index * 800)
            })

            // Stop after sending all messages
            setTimeout(() => clearInterval(interval), 3500)
        }, 4000)

        // Return mock WebSocket object
        return {
            close: () => clearInterval(interval),
            send: () => console.log('Mock: WebSocket send'),
            readyState: 1, // OPEN
        }
    }
}

// Export the appropriate API based on environment
const useMockAPI = import.meta.env.MODE === 'development' && !import.meta.env.VITE_USE_REAL_API

export default useMockAPI ? MockBuildAPI : BuildAPI
