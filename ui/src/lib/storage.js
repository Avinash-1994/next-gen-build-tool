import { openDB } from 'idb'

const DB_NAME = 'nextgen-builder'
const DB_VERSION = 1

// IndexedDB stores
const STORES = {
    PIPELINES: 'pipelines',
    PREFERENCES: 'preferences',
    CACHE: 'cache',
}

// Initialize IndexedDB
async function initDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Pipelines store
            if (!db.objectStoreNames.contains(STORES.PIPELINES)) {
                const pipelineStore = db.createObjectStore(STORES.PIPELINES, {
                    keyPath: 'id',
                    autoIncrement: true,
                })
                pipelineStore.createIndex('name', 'name')
                pipelineStore.createIndex('createdAt', 'createdAt')
                pipelineStore.createIndex('updatedAt', 'updatedAt')
            }

            // Preferences store
            if (!db.objectStoreNames.contains(STORES.PREFERENCES)) {
                db.createObjectStore(STORES.PREFERENCES)
            }

            // Cache store
            if (!db.objectStoreNames.contains(STORES.CACHE)) {
                db.createObjectStore(STORES.CACHE)
            }
        },
    })
}

// LocalStorage with error handling
class LocalStorageManager {
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : defaultValue
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error)
            return defaultValue
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value))
            return true
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error)
            // Handle quota exceeded
            if (error.name === 'QuotaExceededError') {
                console.warn('LocalStorage quota exceeded. Consider clearing old data.')
            }
            return false
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key)
            return true
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error)
            return false
        }
    }

    static clear() {
        try {
            localStorage.clear()
            return true
        } catch (error) {
            console.error('Error clearing localStorage:', error)
            return false
        }
    }
}

// IndexedDB Manager
class IndexedDBManager {
    // Save pipeline
    static async savePipeline(pipeline) {
        try {
            const db = await initDB()
            const id = await db.put(STORES.PIPELINES, {
                ...pipeline,
                updatedAt: new Date().toISOString(),
                createdAt: pipeline.createdAt || new Date().toISOString(),
            })
            return id
        } catch (error) {
            console.error('Error saving pipeline:', error)
            throw error
        }
    }

    // Get pipeline by ID
    static async getPipeline(id) {
        try {
            const db = await initDB()
            return await db.get(STORES.PIPELINES, id)
        } catch (error) {
            console.error('Error getting pipeline:', error)
            throw error
        }
    }

    // Get all pipelines
    static async getAllPipelines() {
        try {
            const db = await initDB()
            return await db.getAll(STORES.PIPELINES)
        } catch (error) {
            console.error('Error getting all pipelines:', error)
            throw error
        }
    }

    // Delete pipeline
    static async deletePipeline(id) {
        try {
            const db = await initDB()
            await db.delete(STORES.PIPELINES, id)
            return true
        } catch (error) {
            console.error('Error deleting pipeline:', error)
            throw error
        }
    }

    // Search pipelines by name
    static async searchPipelines(query) {
        try {
            const db = await initDB()
            const all = await db.getAll(STORES.PIPELINES)
            return all.filter((p) =>
                p.name.toLowerCase().includes(query.toLowerCase())
            )
        } catch (error) {
            console.error('Error searching pipelines:', error)
            throw error
        }
    }

    // Save preference
    static async savePreference(key, value) {
        try {
            const db = await initDB()
            await db.put(STORES.PREFERENCES, value, key)
            return true
        } catch (error) {
            console.error('Error saving preference:', error)
            throw error
        }
    }

    // Get preference
    static async getPreference(key, defaultValue = null) {
        try {
            const db = await initDB()
            const value = await db.get(STORES.PREFERENCES, key)
            return value !== undefined ? value : defaultValue
        } catch (error) {
            console.error('Error getting preference:', error)
            return defaultValue
        }
    }

    // Cache data
    static async cacheData(key, value, ttl = null) {
        try {
            const db = await initDB()
            await db.put(STORES.CACHE, {
                value,
                timestamp: Date.now(),
                ttl,
            }, key)
            return true
        } catch (error) {
            console.error('Error caching data:', error)
            throw error
        }
    }

    // Get cached data
    static async getCachedData(key) {
        try {
            const db = await initDB()
            const cached = await db.get(STORES.CACHE, key)

            if (!cached) return null

            // Check TTL
            if (cached.ttl && Date.now() - cached.timestamp > cached.ttl) {
                await db.delete(STORES.CACHE, key)
                return null
            }

            return cached.value
        } catch (error) {
            console.error('Error getting cached data:', error)
            return null
        }
    }

    // Clear cache
    static async clearCache() {
        try {
            const db = await initDB()
            await db.clear(STORES.CACHE)
            return true
        } catch (error) {
            console.error('Error clearing cache:', error)
            throw error
        }
    }
}

// Unified Storage API
export const Storage = {
    // LocalStorage (for simple preferences)
    local: LocalStorageManager,

    // IndexedDB (for complex data)
    db: IndexedDBManager,

    // Auto-save pipeline
    async autosavePipeline(pipeline) {
        return await IndexedDBManager.cacheData('autosave:pipeline', pipeline, null)
    },

    // Get auto-saved pipeline
    async getAutosavedPipeline() {
        return await IndexedDBManager.getCachedData('autosave:pipeline')
    },

    // Clear auto-save
    async clearAutosave() {
        const db = await initDB()
        await db.delete(STORES.CACHE, 'autosave:pipeline')
    },

    // Storage usage info
    async getStorageUsage() {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate()
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                percentage: ((estimate.usage / estimate.quota) * 100).toFixed(2),
            }
        }
        return null
    },
}

export default Storage
