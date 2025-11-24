import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOnboardingStore = create(
    persist(
        (set) => ({
            hasSeenWelcome: false,
            hasSeenTour: false,
            tourStep: 0,
            showTour: false,
            showWelcome: false,

            // Mark welcome as seen
            setWelcomeSeen: () => set({ hasSeenWelcome: true, showWelcome: false }),

            // Show welcome modal
            showWelcomeModal: () => set({ showWelcome: true }),

            // Start the tour
            startTour: () => set({ showTour: true, tourStep: 0, showWelcome: false }),

            // Complete the tour
            completeTour: () => set({ hasSeenTour: true, showTour: false, tourStep: 0 }),

            // Skip the tour
            skipTour: () => set({ showTour: false, tourStep: 0 }),

            // Update tour step
            setTourStep: (step) => set({ tourStep: step }),

            // Reset onboarding (for testing or settings)
            resetOnboarding: () =>
                set({
                    hasSeenWelcome: false,
                    hasSeenTour: false,
                    tourStep: 0,
                    showTour: false,
                    showWelcome: false,
                }),
        }),
        {
            name: 'onboarding-storage',
        }
    )
)
