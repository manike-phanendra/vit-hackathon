// User-Namespaced IndexedDB Helper for Shared Phone Data Isolation

const DB_NAME = 'KrishiShieldOfflineDB';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('user_caches')) {
        db.createObjectStore('user_caches', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('sync_queue')) {
        db.createObjectStore('sync_queue', { keyPath: 'event_id' });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// User-namespaced cache setting to prevent shared-phone data leaks
export async function setOfflineUserCache(userId, dataType, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('user_caches', 'readwrite');
    const store = tx.objectStore('user_caches');
    const key = `user_${userId}_${dataType}`;
    store.put({ key, userId, dataType, data, updatedAt: Date.now() });

    tx.oncomplete = () => resolve(true);
    tx.onerror = (e) => reject(e.target.error);
  });
}

export async function getOfflineUserCache(userId, dataType) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('user_caches', 'readonly');
    const store = tx.objectStore('user_caches');
    const key = `user_${userId}_${dataType}`;
    const request = store.get(key);

    request.onsuccess = () => {
      const res = request.result;
      resolve(res ? res.data : null);
    };
    request.onerror = (e) => reject(e.target.error);
  });
}

// Queue offline events for sync when network is restored
export async function queueOfflineEvent(eventId, userId, eventType, payload) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sync_queue', 'readwrite');
    const store = tx.objectStore('sync_queue');
    store.put({
      event_id: eventId,
      user_id: userId,
      event_type: eventType,
      payload,
      timestamp: Date.now(),
      synced: false
    });

    tx.oncomplete = () => resolve(true);
    tx.onerror = (e) => reject(e.target.error);
  });
}

export async function getPendingOfflineEvents() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sync_queue', 'readonly');
    const store = tx.objectStore('sync_queue');
    const request = store.getAll();

    request.onsuccess = () => {
      const all = request.result || [];
      resolve(all.filter(item => !item.synced));
    };
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function markEventsSynced(eventIds) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sync_queue', 'readwrite');
    const store = tx.objectStore('sync_queue');
    
    eventIds.forEach(id => store.delete(id));
    tx.oncomplete = () => resolve(true);
    tx.onerror = (e) => reject(e.target.error);
  });
}
