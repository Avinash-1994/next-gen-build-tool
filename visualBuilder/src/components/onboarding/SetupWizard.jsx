import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check, X, Wand2 } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'
import { useOnboardingStore } from '../../stores/onboardingStore'

const TEMPLATES = [
    {
        id: 'blank',
        name: 'Blank Canvas',
        description: 'Start from scratch with an empty pipeline',
        icon: '✨'
    },
    {
        id: 'react',
        name: 'React Application',
        description: 'Pre-configured for React with TypeScript',
        icon: '⚛️'
    },
    {
        id: 'vue',
        name: 'Vue 3 Application',
        description: 'Modern Vue3 setup with Vite',
        icon: '🟢'
    },
    {
        id: 'full-stack',
        name: 'Full-Stack Pipeline',
        description: 'Complete pipeline with optimizations',
        icon: '🚀'
    }
]

export default function SetupWizard({ onClose, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0)
    const { theme, setTheme } = useThemeStore()
    const [preferences, setPreferences] = useState({
        packageManager: 'npm',
        editorTheme: 'vs-dark',
        fontSize: 14,
        template: 'blank'
    })

    const steps = [
        { title: 'Welcome', icon: '👋' },
        { title: 'Preferences', icon: '⚙️' },
        { title: 'Template', icon: '📋' },
        { title: 'Complete', icon: '✅' }
    ]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleComplete = () => {
        // Save preferences
        localStorage.setItem('nextgen-preferences', JSON.stringify(preferences))

        // Mark wizard as completed
        localStorage.setItem('setup-wizard-completed', 'true')

        // Call completion callback
        if (onComplete) {
            onComplete(preferences)
        }

        onClose()
    }

    const handleSkip = () => {
        localStorage.setItem('setup-wizard-completed', 'true')
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleSkip}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Wand2 className="h-8 w-8" />
                            <h2 className="text-3xl font-bold">Setup Wizard</h2>
                        </div>
                        <button
                            onClick={handleSkip}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={index} className="flex items-center">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${index === currentStep
                                        ? 'bg-white/20 text-white'
                                        : index < currentStep
                                            ? 'text-white/80'
                                            : 'text-white/50'
                                    }`}>
                                    <span className="text-2xl">{step.icon}</span>
                                    <span className="font-medium hidden sm:inline">{step.title}</span>
                                    {index < currentStep && <Check className="h-4 w-4" />}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-12 h-1 mx-2 rounded ${index < currentStep ? 'bg-white' : 'bg-white/30'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 min-h-[400px]">
                    {/* Step 1: Welcome */}
                    {currentStep === 0 && (
                        <div className="space-y-6 text-center">
                            <div className="text-6xl mb-4">🚀</div>
                            <h3 className="text-3xl font-bold">Welcome to NextGen Build Tool!</h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Let's get you set up in just a few steps. This wizard will help you customize
                                your experience and get started quickly.
                            </p>
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="text-3xl mb-2">🎨</div>
                                    <h4 className="font-semibold mb-1">Visual Builder</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Drag-and-drop interface
                                    </p>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <div className="text-3xl mb-2">⚡</div>
                                    <h4 className="font-semibold mb-1">Lightning Fast</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Optimized builds
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <div className="text-3xl mb-2">📚</div>
                                    <h4 className="font-semibold mb-1">Documentation</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Complete guides
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Preferences */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold mb-2">Customize Your Preferences</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Configure how you want to work with NextGen
                                </p>
                            </div>

                            {/* Theme Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Application Theme</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['light', 'dark', 'auto'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTheme(t)}
                                            className={`p-4 rounded-lg border-2 transition-all capitalize ${theme === t
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Package Manager */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Default Package Manager</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['npm', 'yarn', 'pnpm'].map((pm) => (
                                        <button
                                            key={pm}
                                            onClick={() => setPreferences({ ...preferences, packageManager: pm })}
                                            className={`p-4 rounded-lg border-2 transition-all ${preferences.packageManager === pm
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="font-mono font-semibold">{pm}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Editor Theme */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Code Editor Theme</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPreferences({ ...preferences, editorTheme: 'vs-dark' })}
                                        className={`p-4 rounded-lg border-2 transition-all ${preferences.editorTheme === 'vs-dark'
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Dark Theme
                                    </button>
                                    <button
                                        onClick={() => setPreferences({ ...preferences, editorTheme: 'vs' })}
                                        className={`p-4 rounded-lg border-2 transition-all ${preferences.editorTheme === 'vs'
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Light Theme
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Template Selection */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold mb-2">Choose a Starter Template</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Start with a pre-configured pipeline or build your own
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {TEMPLATES.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setPreferences({ ...preferences, template: template.id })}
                                        className={`p-6 rounded-lg border-2 transition-all text-left ${preferences.template === template.id
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-4xl mb-3">{template.icon}</div>
                                        <h4 className="font-semibold text-lg mb-1">{template.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {template.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Complete */}
                    {currentStep === 3 && (
                        <div className="space-y-6 text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-3xl font-bold">You're All Set!</h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Your preferences have been saved. You're ready to start building amazing projects
                                with NextGen Build Tool!
                            </p>

                            {/* Summary */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 max-w-md mx-auto text-left">
                                <h4 className="font-semibold mb-4">Your Preferences:</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Theme:</span>
                                        <span className="font-medium capitalize">{theme}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Package Manager:</span>
                                        <span className="font-mono font-medium">{preferences.packageManager}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Editor Theme:</span>
                                        <span className="font-medium">{preferences.editorTheme}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Template:</span>
                                        <span className="font-medium">
                                            {TEMPLATES.find(t => t.id === preferences.template)?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-4 mt-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Check className="h-4 w-4 text-green-600" />
                                    <span>Preferences saved</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <button
                        onClick={handleSkip}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                        Skip Setup
                    </button>
                    <div className="flex items-center gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                        >
                            {currentStep === steps.length - 1 ? (
                                <>
                                    Start Building
                                    <Check className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
