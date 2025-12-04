import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { usePipelineStore } from '../../../stores/pipelineStore'
import { useThemeStore } from '../../../stores/themeStore'
import { Button } from '../../../components/ui/Button'
import { Code, Eye } from 'lucide-react'

export default function ConfigEditor() {
    const { generateConfig, loadConfig } = usePipelineStore()
    const { theme } = useThemeStore()
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('json')
    const [autoSync, setAutoSync] = useState(true)

    useEffect(() => {
        if (autoSync) {
            const config = generateConfig()
            const formatted = JSON.stringify(config, null, 2)
            setCode(formatted)
        }
    }, [usePipelineStore.getState().nodes, usePipelineStore.getState().edges, autoSync])

    const handleApplyConfig = () => {
        try {
            const config = JSON.parse(code)
            loadConfig(config)
            alert('Configuration applied successfully!')
        } catch (err) {
            alert('Invalid JSON: ' + err.message)
        }
    }

    const handleFormatCode = () => {
        try {
            const parsed = JSON.parse(code)
            setCode(JSON.stringify(parsed, null, 2))
        } catch (err) {
            alert('Cannot format: Invalid JSON')
        }
    }

    return (
        <div className="flex flex-col h-full bg-card border-l">
            <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <h3 className="text-sm font-semibold">Configuration</h3>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-xs border rounded px-2 py-1 bg-background"
                    >
                        <option value="json">JSON</option>
                        <option value="typescript">TypeScript</option>
                    </select>

                    <button
                        onClick={() => setAutoSync(!autoSync)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${autoSync
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                    >
                        {autoSync ? 'Auto-Sync ON' : 'Auto-Sync OFF'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 12,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                    }}
                />
            </div>

            <div className="p-3 border-t flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleFormatCode}>
                    Format
                </Button>
                <Button size="sm" onClick={handleApplyConfig} disabled={autoSync}>
                    Apply Config
                </Button>
                <div className="ml-auto text-xs text-muted-foreground">
                    {code.split('\n').length} lines
                </div>
            </div>
        </div>
    )
}
