import { Play, Square, Trash2, Terminal, Wifi, WifiOff } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { usePipelineStore } from '../../../stores/pipelineStore'
import BuildAPI from '../../../api/buildAPI'

export default function BuildControls() {
    const { generateConfig } = usePipelineStore()
    const [isBuilding, setIsBuilding] = useState(false)
    const [logs, setLogs] = useState([
        { level: 'info', message: 'Build system ready', time: new Date().toLocaleTimeString() },
    ])
    const [buildId, setBuildId] = useState(null)
    const [wsConnected, setWsConnected] = useState(false)
    const wsRef = useRef(null)
    const logsEndRef = useRef(null)

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    // Setup WebSocket connection
    useEffect(() => {
        try {
            wsRef.current = BuildAPI.connectWebSocket(
                (data) => {
                    // WebSocket message received
                    setLogs(prev => [...prev, {
                        level: data.level || 'info',
                        message: data.message,
                        time: new Date(data.time || Date.now()).toLocaleTimeString(),
                    }])

                    // If build completed, update state
                    if (data.level === 'success' || data.level === 'error') {
                        setIsBuilding(false)
                    }
                },
                (error) => {
                    console.error('WebSocket error:', error)
                    setWsConnected(false)
                }
            )

            // Check WebSocket state
            if (wsRef.current && wsRef.current.readyState === 1) {
                setWsConnected(true)
            }
        } catch (err) {
            console.log('WebSocket connection failed, using mock API')
            setWsConnected(false)
        }

        // Cleanup WebSocket on unmount
        return () => {
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [])

    const handleStartBuild = async () => {
        setIsBuilding(true)
        setLogs([{ level: 'info', message: 'Starting build...', time: new Date().toLocaleTimeString() }])

        try {
            const config = generateConfig()
            const response = await BuildAPI.startBuild(config)
            setBuildId(response.buildId)

            setLogs(prev => [...prev, {
                level: 'info',
                message: `Build started with ID: ${response.buildId}`,
                time: new Date().toLocaleTimeString(),
            }])

            // If not using WebSocket, poll for build status
            if (!wsConnected && response.buildId) {
                pollBuildStatus(response.buildId)
            }
        } catch (error) {
            setLogs(prev => [...prev, {
                level: 'error',
                message: `Failed to start build: ${error.message}`,
                time: new Date().toLocaleTimeString(),
            }])
            setIsBuilding(false)
        }
    }

    const pollBuildStatus = async (id) => {
        const interval = setInterval(async () => {
            try {
                const status = await BuildAPI.getBuildStatus(id)
                if (status.status === 'completed' || status.status === 'failed') {
                    clearInterval(interval)
                    setIsBuilding(false)
                    setLogs(prev => [...prev, {
                        level: status.status === 'completed' ? 'success' : 'error',
                        message: status.status === 'completed'
                            ? '✓ Build completed successfully!'
                            : `✗ Build failed with exit code ${status.exitCode}`,
                        time: new Date().toLocaleTimeString(),
                    }])
                }
            } catch (err) {
                console.error('Failed to poll build status:', err)
                clearInterval(interval)
                setIsBuilding(false)
            }
        }, 1000)
    }

    const handleStopBuild = async () => {
        if (buildId) {
            try {
                await BuildAPI.stopBuild(buildId)
                setLogs(prev => [...prev, {
                    level: 'warning',
                    message: 'Build stopped by user',
                    time: new Date().toLocaleTimeString(),
                }])
            } catch (error) {
                setLogs(prev => [...prev, {
                    level: 'error',
                    message: `Failed to stop build: ${error.message}`,
                    time: new Date().toLocaleTimeString(),
                }])
            }
        }
        setIsBuilding(false)
        setBuildId(null)
    }

    const handleClearLogs = () => {
        setLogs([])
    }

    const getLevelColor = (level) => {
        switch (level) {
            case 'success':
                return 'text-green-600 dark:text-green-400'
            case 'error':
                return 'text-red-600 dark:text-red-400'
            case 'warning':
                return 'text-yellow-600 dark:text-yellow-400'
            default:
                return 'text-foreground'
        }
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Terminal className="h-5 w-5" />
                        Build Console
                        {wsConnected ? (
                            <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" title="WebSocket connected" />
                        ) : (
                            <WifiOff className="h-4 w-4 text-muted-foreground" title="WebSocket disconnected (using mock API)" />
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {isBuilding ? (
                            <Button size="sm" variant="destructive" onClick={handleStopBuild}>
                                <Square className="h-3.5 w-3.5 mr-1.5" />
                                Stop
                            </Button>
                        ) : (
                            <Button size="sm" onClick={handleStartBuild}>
                                <Play className="h-3.5 w-3.5 mr-1.5" />
                                Start Build
                            </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={handleClearLogs}>
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
                <div className="h-full overflow-y-auto bg-black/5 dark:bg-black/50 p-3 font-mono text-xs">
                    {logs.length === 0 ? (
                        <div className="text-muted-foreground italic">No logs yet...</div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="mb-1 flex gap-2">
                                <span className="text-muted-foreground">[{log.time}]</span>
                                <span className={getLevelColor(log.level)}>{log.message}</span>
                            </div>
                        ))
                    )}
                    {isBuilding && (
                        <div className="mt-2 flex items-center gap-2 text-primary">
                            <div className="animate-pulse">●</div>
                            <span>Building...</span>
                        </div>
                    )}
                    <div ref={logsEndRef} />
                </div>
            </CardContent>
        </Card>
    )
}
