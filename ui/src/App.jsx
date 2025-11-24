import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from './stores/themeStore'
import AppShell from './components/layout/AppShell'
import PipelineBuilder from './features/pipeline-builder/PipelineBuilder'
import DocsLayout from './features/docs/DocsLayout'
import DocsPage from './features/docs/DocsPage'
import FirstPipeline from './features/docs/tutorials/FirstPipeline'
import CustomPlugins from './features/docs/tutorials/CustomPlugins'
import MicroFrontends from './features/docs/tutorials/MicroFrontends'

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/builder" replace />} />
          <Route path="builder" element={<PipelineBuilder />} />
          <Route path="docs" element={<DocsLayout />}>
            <Route index element={<Navigate to="/docs/getting-started/introduction" replace />} />
            <Route path="tutorials/first-pipeline" element={<FirstPipeline />} />
            <Route path="tutorials/custom-plugins" element={<CustomPlugins />} />
            <Route path="tutorials/micro-frontends" element={<MicroFrontends />} />
            <Route path="*" element={<DocsPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
