import { AUTH_CONFIG } from '../config/auth'
import { APP_CONFIG, isMockMode } from '../config/app'

/**
 * Centralized auth/session service.
 * Default mode is "mock" to preserve current frontend-only behavior.
 * In api mode, requests go to the backend while mock remains available as fallback.
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

  const base = APP_CONFIG.apiBaseUrl
  const url = `${base}/api/auth/login`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, username: u, password: p }),
    })

    let data = null
    try {
      data = await res.json()
    } catch {
      data = null
    }

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
