import cors from 'cors'
import express from 'express'

const app = express()
const PORT = Number(process.env.PORT || 3001)

const DEMO_USERS = {
  student: { username: 'student', password: '1234', role: 'student', displayName: 'دانش‌آموز' },
  teacher: { username: 'teacher', password: '1234', role: 'teacher', displayName: 'دبیر' },
  admin: { username: 'admin', password: '1234', role: 'admin', displayName: 'مدیر' },
}

app.use(cors())
app.use(express.json())

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

  return res.json({
    ok: true,
    role,
    mode: 'api',
    user: {
      username: expected.username,
      role: expected.role,
      displayName: expected.displayName,
    },
  })
})

app.use((req, res) => {
  res.status(404).json({ ok: false, reason: 'not_found', path: req.path })
})

app.listen(PORT, () => {
  console.log(`[madreseyar-server] listening on http://localhost:${PORT}`)
})
