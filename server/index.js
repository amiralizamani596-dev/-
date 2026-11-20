import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import crypto from 'node:crypto'

const app = express()
const PORT = Number(process.env.PORT || 3001)
const SESSION_COOKIE = 'madreseyar_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours
const isProd = process.env.NODE_ENV === 'production'

const DEMO_USERS = {
  student: { username: 'student', password: '1234', role: 'student', displayName: 'دانش‌آموز' },
  teacher: { username: 'teacher', password: '1234', role: 'teacher', displayName: 'دبیر' },
  admin: { username: 'admin', password: '1234', role: 'admin', displayName: 'مدیر' },
}

/** @type {Map<string, { role: string, username: string, displayName: string, createdAt: number }>} */
const sessions = new Map()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: SESSION_TTL_MS,
  }
}

function getSession(req) {
  const id = req.cookies?.[SESSION_COOKIE]
  if (!id) return null
  const session = sessions.get(id)
  if (!session) return null
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(id)
    return null
  }
  return { id, ...session }
}

function createSession(user) {
  const id = crypto.randomBytes(24).toString('hex')
  sessions.set(id, {
    role: user.role,
    username: user.username,
    displayName: user.displayName,
    createdAt: Date.now(),
  })
  return id
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'madreseyar-server', time: new Date().toISOString() })
})

app.post('/api/auth/login', (req, res) => {
  const { role, username, password } = req.body || {}

  if (!role || !DEMO_USERS[role]) {
    return res.status(400).json({ ok: false, reason: 'invalid_role', message: 'نقش نامعتبر است.' })
  }
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ ok: false, reason: 'invalid_payload', message: 'نام کاربری یا رمز عبور نامعتبر است.' })
  }

  const expected = DEMO_USERS[role]
  const u = username.trim()
  const ok = u === expected.username && password === expected.password

  if (!ok) {
    return res.status(401).json({ ok: false, reason: 'invalid_credentials', message: 'نام کاربری یا رمز عبور نادرست است.' })
  }

  const user = {
    username: expected.username,
    role: expected.role,
    displayName: expected.displayName,
  }
  const sessionId = createSession(user)
  res.cookie(SESSION_COOKIE, sessionId, cookieOptions())

  return res.json({
    ok: true,
    role,
    mode: 'api',
    user,
  })
})

app.get('/api/auth/me', (req, res) => {
  const session = getSession(req)
  if (!session) {
    return res.status(401).json({ ok: false, reason: 'unauthorized', message: 'نشست فعال پیدا نشد.' })
  }
  return res.json({
    ok: true,
    role: session.role,
    mode: 'api',
    user: {
      username: session.username,
      role: session.role,
      displayName: session.displayName,
    },
  })
})

app.post('/api/auth/logout', (req, res) => {
  const session = getSession(req)
  if (session) sessions.delete(session.id)
  res.clearCookie(SESSION_COOKIE, { ...cookieOptions(), maxAge: undefined })
  return res.json({ ok: true })
})

app.use((req, res) => {
  res.status(404).json({ ok: false, reason: 'not_found', path: req.path })
})

app.listen(PORT, () => {
  console.log(`[madreseyar-server] listening on http://localhost:${PORT}`)
})
