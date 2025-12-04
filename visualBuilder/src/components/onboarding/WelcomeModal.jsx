import { useState } from 'react'
import { X, Rocket, BookOpen, Workflow } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

export default function WelcomeModal({ isOpen, onClose, onStartTour }) {
    const [dontShowAgain, setDontShowAgain] = useState(false)

    if (!isOpen) return null

    const handleClose = () => {
        onClose(dontShowAgain)
    }

    const handleStartTour = () => {
        onClose(dontShowAgain)
        onStartTour()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-2xl p-8 m-4">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 hover:bg-accent rounded-lg transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <Rocket className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome to NextGen Pipeline Builder! 👋
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Build modern, visual pipelines with ease
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-lg bg-muted/50">
                        <Workflow className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-semibold mb-1">Visual Pipeline Builder</h3>
                        <p className="text-sm text-muted-foreground">
                            Drag, drop, and connect nodes to create complex build pipelines
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                        <BookOpen className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-semibold mb-1">Rich Documentation</h3>
                        <p className="text-sm text-muted-foreground">
                            Learn from guides, tutorials, and interactive examples
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                        <Rocket className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-semibold mb-1">Powerful Features</h3>
                        <p className="text-sm text-muted-foreground">
                            Undo/redo, auto-save, templates, and collaboration tools
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <Button
                        className="flex-1"
                        size="lg"
                        onClick={handleStartTour}
                    >
                        <Rocket className="h-4 w-4 mr-2" />
                        Take a Quick Tour
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1"
                        size="lg"
                        onClick={handleClose}
                    >
                        Skip Tour
                    </Button>
                </div>

                {/* Don't show again checkbox */}
                <label className="flex items-center justify-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    <input
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="rounded border-input"
                    />
                    Don't show this again
                </label>
            </Card>
        </div>
    )
}
