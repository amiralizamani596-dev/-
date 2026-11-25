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

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(apiUrl(path), {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await readJson(res)
  if (res.ok && data?.ok) return data
  return {
    ok: false,
    reason: data?.reason || (res.status === 401 ? 'unauthorized' : res.status === 403 ? 'forbidden' : 'api_error'),
    message: data?.message || 'درخواست از سرور ناموفق بود.',
    status: res.status,
  }
}

export async function getPortalBootstrap() {
  if (isMockMode) return { ok: false, reason: 'mock_mode' }
  try {
    return await request('/api/portal/bootstrap')
  } catch {
    return { ok: false, reason: 'network_error', message: 'اتصال به سرور برقرار نشد.' }
  }
}

async function mutation(path, method, body) {
  if (isMockMode) return { ok: false, reason: 'mock_mode' }
  try {
    return await request(path, { method, body })
  } catch {
    return { ok: false, reason: 'network_error', message: 'اتصال به سرور برقرار نشد.' }
  }
}

export const portalApi = {
  student: {
    submitHomework: (id, body) => mutation(`/api/portal/student/homework/${encodeURIComponent(id)}/submit`, 'POST', body),
    markMessageRead: (id) => mutation(`/api/portal/student/messages/${encodeURIComponent(id)}/read`, 'PATCH'),
  },
  teacher: {
    saveAttendance: (body) => mutation('/api/portal/teacher/attendance', 'PUT', body),
    updateGrade: (id, body) => mutation(`/api/portal/teacher/grades/${encodeURIComponent(id)}`, 'PATCH', body),
    addHomework: (body) => mutation('/api/portal/teacher/homework', 'POST', body),
    markMessageRead: (id) => mutation(`/api/portal/teacher/messages/${encodeURIComponent(id)}/read`, 'PATCH'),
  },
  admin: {
    addStudent: (body) => mutation('/api/portal/admin/students', 'POST', body),
    updateStudent: (id, body) => mutation(`/api/portal/admin/students/${encodeURIComponent(id)}`, 'PATCH', body),
    deleteStudent: (id) => mutation(`/api/portal/admin/students/${encodeURIComponent(id)}`, 'DELETE'),
    addClass: (body) => mutation('/api/portal/admin/classes', 'POST', body),
    updateClass: (id, body) => mutation(`/api/portal/admin/classes/${encodeURIComponent(id)}`, 'PATCH', body),
    deleteClass: (id) => mutation(`/api/portal/admin/classes/${encodeURIComponent(id)}`, 'DELETE'),
    addAnnouncement: (body) => mutation('/api/portal/admin/announcements', 'POST', body),
    updateAnnouncement: (id, body) => mutation(`/api/portal/admin/announcements/${encodeURIComponent(id)}`, 'PATCH', body),
    refreshReport: (id) => mutation(`/api/portal/admin/reports/${encodeURIComponent(id)}/refresh`, 'POST'),
  },
}