import { useState, useEffect, useRef, useCallback } from 'react'
import { debounce } from 'lodash-es'

/**
 * Hook for auto-saving data with debouncing
 * @param {any} data - Data to auto-save
 * @param {Function} saveFn - Function to call for saving
 * @param {Object} options - Configuration options
 * @returns {Object} - Status info {isSaving, lastSaved, error}
 */
export function useAutoSave(data, saveFn, options = {}) {
    const {
        interval = 5000, // 5 seconds default
        enabled = true,
        onSaveSuccess,
        onSaveError,
    } = options

    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState(null)
    const [error, setError] = useState(null)

    const dataRef = useRef(data)
    const lastSavedData = useRef(null)

    // Update ref when data changes
    useEffect(() => {
        dataRef.current = data
    }, [data])

    // Debounced save function
    const debouncedSave = useCallback(
        debounce(async () => {
            // Don't save if data hasn't changed
            if (JSON.stringify(dataRef.current) === JSON.stringify(lastSavedData.current)) {
                return
            }

            setIsSaving(true)
            setError(null)

            try {
                await saveFn(dataRef.current)
                lastSavedData.current = JSON.parse(JSON.stringify(dataRef.current))
                setLastSaved(new Date())
                onSaveSuccess?.()
            } catch (err) {
                console.error('Auto-save error:', err)
                setError(err)
                onSaveError?.(err)
            } finally {
                setIsSaving(false)
            }
        }, interval),
        [saveFn, interval, onSaveSuccess, onSaveError]
    )

    // Trigger save when data changes
    useEffect(() => {
        if (enabled && data) {
            debouncedSave()
        }

        // Cleanup
        return () => {
            debouncedSave.cancel()
        }
    }, [data, enabled, debouncedSave])

    // Manual save function
    const saveNow = useCallback(async () => {
        debouncedSave.cancel() // Cancel any pending debounced saves
        setIsSaving(true)
        setError(null)

        try {
            await saveFn(dataRef.current)
            lastSavedData.current = JSON.parse(JSON.stringify(dataRef.current))
            setLastSaved(new Date())
            onSaveSuccess?.()
        } catch (err) {
            console.error('Manual save error:', err)
            setError(err)
            onSaveError?.(err)
        } finally {
            setIsSaving(false)
        }
    }, [saveFn, onSaveSuccess, onSaveError, debouncedSave])

    return {
        isSaving,
        lastSaved,
        error,
        saveNow, // Manual save trigger
    }
}

/**
 * Hook for state persistence with localStorage or IndexedDB
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if nothing is stored
 * @param {Object} options - Configuration  
 * @returns {Array} - [state, setState] tuple
 */
export function usePersistence(key, defaultValue, options = {}) {
    const {
        storage = 'local', // 'local' or 'indexed'
        serializer = JSON.stringify,
        deserializer = JSON.parse,
    } = options

    // Initialize state from storage
    const [state, setState] = useState(() => {
        try {
            if (storage === 'local') {
                const item = localStorage.getItem(key)
                return item ? deserializer(item) : defaultValue
            }
            // For IndexedDB, return default first, then load async
            return defaultValue
        } catch (error) {
            console.error(`Error loading persisted state for ${key}:`, error)
            return defaultValue
        }
    })

    // Load from IndexedDB if needed
    useEffect(() => {
        if (storage === 'indexed') {
            import('../lib/storage').then(({ Storage }) => {
                Storage.db.getPreference(key, defaultValue).then((value) => {
                    if (value !== null) {
                        setState(value)
                    }
                })
            })
        }
    }, [key, defaultValue, storage])

    // Save to storage when state changes
    useEffect(() => {
        try {
            if (storage === 'local') {
                localStorage.setItem(key, serializer(state))
            } else if (storage === 'indexed') {
                import('../lib/storage').then(({ Storage }) => {
                    Storage.db.savePreference(key, state)
                })
            }
        } catch (error) {
            console.error(`Error persisting state for ${key}:`, error)
        }
    }, [key, state, storage, serializer])

    return [state, setState]
}
