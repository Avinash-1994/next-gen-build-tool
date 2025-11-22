import { useState } from 'react'
import { Check, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { cn } from '../../../lib/utils'

export default function TutorialLayout({ steps, title, description, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [completedSteps, setCompletedSteps] = useState(new Set())

    const markStepComplete = (stepIndex) => {
        setCompletedSteps(prev => new Set([...prev, stepIndex]))
    }

    const goToNextStep = () => {
        if (currentStep < steps.length - 1) {
            markStepComplete(currentStep)
            setCurrentStep(currentStep + 1)
        } else {
            markStepComplete(currentStep)
            if (onComplete) onComplete()
        }
    }

    const goToPrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const currentStepData = steps[currentStep]
    const progress = ((completedSteps.size) / steps.length) * 100

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Interactive Tutorial</span>
                </div>
                <h1 className="text-4xl font-bold mb-2">{title}</h1>
                <p className="text-lg text-muted-foreground">{description}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                        Step {currentStep + 1} of {steps.length}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {Math.round(progress)}% Complete
                    </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Steps Sidebar + Content */}
            <div className="grid grid-cols-12 gap-8">
                {/* Steps List */}
                <div className="col-span-3">
                    <Card className="p-4">
                        <h3 className="font-semibold mb-4 text-sm">Steps</h3>
                        <div className="space-y-2">
                            {steps.map((step, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentStep(index)}
                                    className={cn(
                                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                                        currentStep === index
                                            ? 'bg-primary text-primary-foreground'
                                            : completedSteps.has(index)
                                                ? 'bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100'
                                                : 'hover:bg-accent'
                                    )}
                                >
                                    {completedSteps.has(index) ? (
                                        <Check className="h-4 w-4 flex-shrink-0" />
                                    ) : (
                                        <div className="h-4 w-4 rounded-full border-2 flex-shrink-0" />
                                    )}
                                    <span className="truncate">{step.title}</span>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Current Step Content */}
                <div className="col-span-9">
                    <Card className="p-8">
                        <div className="mb-6">
                            <div className="text-sm text-primary font-medium mb-2">
                                Step {currentStep + 1}
                            </div>
                            <h2 className="text-2xl font-bold mb-4">{currentStepData.title}</h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                {currentStepData.content}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={goToPrevStep}
                                disabled={currentStep === 0}
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>

                            {currentStep < steps.length - 1 ? (
                                <Button onClick={goToNextStep}>
                                    Next Step
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button onClick={goToNextStep} className="bg-green-600 hover:bg-green-700">
                                    <Check className="h-4 w-4 mr-2" />
                                    Complete Tutorial
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Completion Message */}
                    {completedSteps.size === steps.length && (
                        <Card className="mt-6 p-6 bg-green-50 dark:bg-green-950/30 border-green-500">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-600 rounded-full p-2">
                                    <Check className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Tutorial Complete! 🎉</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Great job! You've completed the entire tutorial. Ready for the next challenge?
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
