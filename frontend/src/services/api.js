// API Client with Backend URL and Network Status Helper

const API_BASE_URL = 'http://localhost:8000';

export async function fetchApi(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Network request failed' }));
      throw new Error(err.detail || 'API Request failed');
    }
    return await response.json();
  } catch (error) {
    console.warn(`[API] Endpoint ${endpoint} unreachable or offline.`, error.message);
    throw error;
  }
}
