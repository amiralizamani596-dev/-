import { AUTH_CONFIG } from '../config/auth'
import { APP_CONFIG, isMockMode } from '../config/app'

function apiUrl(path) {
  const base = APP_CONFIG.apiBaseUrl || ''
  return `${base}${path}`
}

async function readJson(res) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

/**
 * Centralized auth/session service.
 * Default mode is "mock" to preserve current frontend-only behavior.
 * In api mode, requests go to the backend and use an HttpOnly session cookie.
 */
export async function signIn(role, username, password) {
  const expected = AUTH_CONFIG[role]
  if (!expected) return { ok: false, reason: 'invalid_role' }

  const u = typeof username === 'string' ? username.trim() : ''
  const p = typeof password === 'string' ? password : ''

  if (isMockMode) {
    const ok = u === expected.username && p === expected.password
    return ok ? { ok: true, role, mode: 'mock' } : { ok: false, reason: 'invalid_credentials' }
  }

  try {
    const res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, username: u, password: p }),
    })

    const data = await readJson(res)

    if (res.ok && data?.ok) {
      return data
    }

    if (data?.reason === 'invalid_credentials' || res.status === 401) {
      return { ok: false, reason: 'invalid_credentials', message: data?.message }
    }
    if (data?.reason) {
      return { ok: false, reason: data.reason, message: data.message }
    }

    return {
      ok: false,
      reason: 'api_error',
      message: 'ورود از طریق سرور انجام نشد. لطفاً دوباره تلاش کنید.',
    }
  } catch {
    return {
      ok: false,
      reason: 'network_error',
      message: 'اتصال به سرور برقرار نشد. سرور بک‌اند را اجرا کنید یا به حالت mock برگردید.',
    }
  }
}

export async function getSession() {
  if (isMockMode) {
    return { ok: false, reason: 'mock_mode' }
  }

  try {
    const res = await fetch(apiUrl('/api/auth/me'), {
      method: 'GET',
      credentials: 'include',
    })
    const data = await readJson(res)
    if (res.ok && data?.ok) return data
    return { ok: false, reason: data?.reason || 'unauthorized' }
  } catch {
    return { ok: false, reason: 'network_error' }
  }
}

export async function signOut() {
  if (isMockMode) {
    return { ok: true, mode: 'mock' }
  }

  try {
    const res = await fetch(apiUrl('/api/auth/logout'), {
      method: 'POST',
      credentials: 'include',
    })
    const data = await readJson(res)
    if (res.ok && data?.ok) return data
    return { ok: false, reason: data?.reason || 'api_error' }
  } catch {
    return { ok: false, reason: 'network_error' }
  }
}
