import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            preferences: {
                autoSaveInterval: 5000,
                theme: 'system',
                editorSettings: {
                    fontSize: 14,
                    tabSize: 2,
                    minimap: true,
                },
            },

            // User management
            setUser: (user) => set({ user, isAuthenticated: !!user }),

            logout: () => set({ user: null, isAuthenticated: false }),

            // Preferences
            updatePreferences: (updates) =>
                set((state) => ({
                    preferences: { ...state.preferences, ...updates },
                })),

            updateEditorSettings: (settings) =>
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        editorSettings: { ...state.preferences.editorSettings, ...settings },
                    },
                })),

            // Mock login (for demo purposes)
            login: async (credentials) => {
                // In a real app, this would call an API
                const mockUser = {
                    id: '1',
                    name: 'Demo User',
                    email: credentials.email,
                    avatar: null,
                }
                set({ user: mockUser, isAuthenticated: true })
                return mockUser
            },
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({
                user: state.user,
                preferences: state.preferences,
            }),
        }
    )
)
