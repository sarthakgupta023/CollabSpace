// TODO: once real auth is added, swap X-User-Id for an Authorization: Bearer <jwt> header.

const BASE_URL = '/api';

function getUserId() {
  return localStorage.getItem('userId');
}

export function getStoredUser() {
  return {
    userId: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
  };
}

async function request(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getUserId() ? { 'X-User-Id': getUserId() } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}): ${body || res.statusText}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  signup: (username) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ username }) }),

  createWorkspace: (ownerName) =>
    request('/workspaces', { method: 'POST', body: JSON.stringify({ ownerName }) }),

  joinWorkspace: (workspaceId, displayName) =>
    request(`/workspaces/${workspaceId}/join`, {
      method: 'POST',
      body: JSON.stringify({ displayName }),
    }),

  workspaceStatus: (workspaceId) => request(`/workspaces/${workspaceId}/status`),

  endWorkspace: (workspaceId) =>
    request(`/workspaces/${workspaceId}/end`, { method: 'POST' }),

  history: () => request('/history'),
};
