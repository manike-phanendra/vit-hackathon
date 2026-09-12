import { getPendingOfflineEvents, markEventsSynced } from './offlineDb';
import { fetchApi } from './api';

export async function processOfflineSyncQueue(userId = 'USR-101', deviceId = 'DEV-MOBILE-01') {
  if (!navigator.onLine) return { synced: 0, pending: 0, status: 'OFFLINE' };

  try {
    const pendingEvents = await getPendingOfflineEvents();
    if (!pendingEvents || pendingEvents.length === 0) {
      return { synced: 0, pending: 0, status: 'IDLE' };
    }

    const payload = {
      device_id: deviceId,
      user_id: userId,
      events: pendingEvents.map(e => ({
        event_id: e.event_id,
        event_type: e.event_type,
        payload: e.payload,
        device_version: 1
      }))
    };

    const res = await fetchApi('/sync', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res.synced_count > 0) {
      const syncedIds = pendingEvents.map(e => e.event_id);
      await markEventsSynced(syncedIds);
    }

    return {
      synced: res.synced_count,
      rejected: res.rejected_count,
      pending: 0,
      status: 'SUCCESS'
    };
  } catch (err) {
    console.error("Offline sync error:", err);
    return { synced: 0, pending: 0, status: 'ERROR' };
  }
}
