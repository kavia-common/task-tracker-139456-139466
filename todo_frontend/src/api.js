import { getApiBaseUrl } from './config';

const BASE = getApiBaseUrl();

// Extract csrftoken from cookies (Django default name)
function getCookie(name) {
  if (!document?.cookie) return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return null;
}

async function request(path, { method = 'GET', body, headers = {}, includeJson = true } = {}) {
  const opts = {
    method,
    headers: {
      ...(includeJson ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    credentials: 'include', // send cookies for session auth
  };
  if (body !== undefined) {
    opts.body = includeJson ? JSON.stringify(body) : body;
  }
  // Add CSRF for unsafe methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
      opts.headers['X-CSRFToken'] = csrftoken;
    }
  }
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    let detail = '';
    try {
      const data = await res.json();
      detail = data?.detail || JSON.stringify(data);
    } catch {
      detail = await res.text();
    }
    const error = new Error(`HTTP ${res.status}: ${detail || res.statusText}`);
    error.status = res.status;
    throw error;
  }
  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

// PUBLIC_INTERFACE
export const AuthAPI = {
  /** Login with username and password using session auth. */
  login: (username, password) => request('/auth/login/', { method: 'POST', body: { username, password } }),
  /** Register new account and auto-login via session if backend supports. */
  register: (username, email, password) => request('/auth/register/', { method: 'POST', body: { username, email, password } }),
  /** Logout current session. */
  logout: () => request('/auth/logout/', { method: 'POST' }),
  /** Get current user (or 403/401 if not authenticated). */
  me: () => request('/auth/me/', { method: 'GET' }),
};

// PUBLIC_INTERFACE
export const TodosAPI = {
  /** List todos with optional filters { is_completed, search, page, page_size } */
  list: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.append(k, String(v));
    });
    const suffix = q.toString() ? `?${q.toString()}` : '';
    return request(`/todos/${suffix}`, { method: 'GET' });
  },
  /** Create a new todo item. */
  create: (todo) => request('/todos/', { method: 'POST', body: todo }),
  /** Update an existing todo by id. */
  update: (id, todo) => request(`/todos/${id}/`, { method: 'PUT', body: todo }),
  /** Partial update (patch). */
  patch: (id, fields) => request(`/todos/${id}/`, { method: 'PATCH', body: fields }),
  /** Delete by id. */
  remove: (id) => request(`/todos/${id}/`, { method: 'DELETE' }),
  /** Toggle completion by id. */
  toggle: (id) => request(`/todos/${id}/toggle/`, { method: 'POST', body: {} }),
};
