use dashmap::DashMap;
use serde::{Serialize, Deserialize};
use std::sync::Arc;

#[derive(Serialize, Deserialize, Clone)]
pub struct CacheEntry {
    pub hash: String,
    pub content: String,
    // Add metadata like dependencies, timestamps, etc.
}

pub struct AssetCache {
    store: Arc<DashMap<String, CacheEntry>>,
}

impl AssetCache {
    pub fn new() -> Self {
        AssetCache {
            store: Arc::new(DashMap::new()),
        }
    }

    pub fn get(&self, key: &str) -> Option<CacheEntry> {
        self.store.get(key).map(|v| v.clone())
    }

    pub fn insert(&self, key: String, entry: CacheEntry) {
        self.store.insert(key, entry);
    }
    
    pub fn len(&self) -> usize {
        self.store.len()
    }
    
    pub fn clear(&self) {
        self.store.clear();
    }

    pub fn remove(&self, key: &str) {
        self.store.remove(key);
    }
}
