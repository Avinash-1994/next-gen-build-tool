import Joyride, { STATUS } from 'react-joyride'

export default function ProductTour({ run, onComplete, onSkip }) {
    const steps = [
        {
            target: '.node-library',
            content: (
                <div>
                    <h3 className="text-lg font-bold mb-2">📦 Node Library</h3>
                    <p>Drag nodes from here to build your pipeline. Each node represents a build step like bundling, transpiling, or optimizing.</p>
                </div>
            ),
            placement: 'right',
            disableBeacon: true,
        },
        {
            target: '.react-flow',
            content: (
                <div>
                    <h3 className="text-lg font-bold mb-2">🎨 Canvas</h3>
                    <p>Drop nodes here and connect them by dragging from the output (right) to the input (left) of another node.</p>
                </div>
            ),
            placement: 'center',
        },
        {
            target: '.property-panel',
            content: (
                <div>
                    <h3 className="text-lg font-bold mb-2">⚙️ Property Panel</h3>
                    <p>Configure selected node properties here. Each node type has different configuration options.</p>
                </div>
            ),
            placement: 'left',
        },
        {
            target: '[title="Undo (Ctrl+Z)"]',
            content: (
                <div>
                    <h3 className="text-lg font-bold mb-2">↩️ Undo/Redo</h3>
                    <p>Made a mistake? Use <kbd className="px-2 py-1 bg-muted rounded">Ctrl+Z</kbd> to undo and <kbd className="px-2 py-1 bg-muted rounded">Ctrl+Y</kbd> to redo.</p>
                </div>
            ),
            placement: 'bottom',
        },
        {
            target: 'button:has-text("Save As...")',
            content: (
                <div>
                    <h3 className="text-lg font-bold mb-2">💾 Save & Load</h3>
                    <p>Save your pipelines, load them later, and share with your team. Auto-save happens every 5 seconds!</p>
                </div>
            ),
            placement: 'bottom',
        },
        {
            target: '.build-console',
            content: (
                <div>
                    <h3 className="text-lg font-bold mb-2">📊 Build Console</h3>
                    <p>View build output, logs, and analytics here. Click "Run Build" to execute your pipeline.</p>
                </div>
            ),
            placement: 'top',
        },
        {
            target: 'body',
            content: (
                <div>
                    <h3 className="text-lg font-bold mb-2">🎉 You're All Set!</h3>
                    <p className="mb-3">Here are some pro tips:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Shift+D</kbd> - Open debug tools</li>
                        <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Delete</kbd> - Remove selected node</li>
                        <li><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> - Clear selection</li>
                    </ul>
                    <p className="mt-3">Start building your pipeline! 🚀</p>
                </div>
            ),
            placement: 'center',
        },
    ]

    const handleJoyrideCallback = (data) => {
        const { status, type } = data

        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            if (status === STATUS.FINISHED) {
                onComplete?.()
            } else {
                onSkip?.()
            }
        }
    }

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: 'hsl(var(--primary))',
                    textColor: 'hsl(var(--foreground))',
                    backgroundColor: 'hsl(var(--card))',
                    arrowColor: 'hsl(var(--card))',
                    overlayColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                },
                tooltip: {
                    borderRadius: 8,
                    padding: 20,
                },
                buttonNext: {
                    backgroundColor: 'hsl(var(--primary))',
                    borderRadius: 6,
                    padding: '8px 16px',
                },
                buttonBack: {
                    color: 'hsl(var(--muted-foreground))',
                    marginRight: 10,
                },
                buttonSkip: {
                    color: 'hsl(var(--muted-foreground))',
                },
            }}
            locale={{
                back: 'Back',
                close: 'Close',
                last: 'Finish',
                next: 'Next',
                skip: 'Skip Tour',
            }}
        />
    )
}
