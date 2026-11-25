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

function requireAuth(req, res) {
  const session = getSession(req)
  if (!session) {
    res.status(401).json({ ok: false, reason: 'unauthorized', message: 'نشست فعال پیدا نشد.' })
    return null
  }
  return session
}

function requireRole(req, res, role) {
  const session = requireAuth(req, res)
  if (!session) return null
  if (session.role !== role) {
    res.status(403).json({ ok: false, reason: 'forbidden', message: 'دسترسی به این بخش مجاز نیست.' })
    return null
  }
  return session
}

function uid(prefix) {
  return `${prefix}-${crypto.randomBytes(6).toString('hex')}`
}

const weeklySchedule = [
  { day: 'شنبه', items: ['زنگ اول: فیزیک', 'زنگ دوم: تربیت بدنی', 'زنگ سوم: تفکر و سبک زندگی'] },
  { day: 'یکشنبه', items: ['زنگ اول: ادبیات فارسی', 'زنگ دوم: مطالعات اجتماعی', 'زنگ سوم: شیمی', 'زنگ چهارم: زبان انگلیسی'] },
  { day: 'دوشنبه', items: ['زنگ اول: ریاضی', 'زنگ دوم: قرآن', 'زنگ سوم: ریاضی', 'زنگ چهارم: عربی'] },
  { day: 'سه‌شنبه', items: ['زنگ اول: ادبیات فارسی', 'زنگ دوم: کار و فناوری', 'زنگ سوم: مطالعات اجتماعی/نگارش', 'زنگ چهارم: دینی'] },
  { day: 'چهارشنبه', items: ['زنگ اول: فرهنگ و هنر', 'زنگ دوم: ریاضی', 'زنگ سوم: زیست'] },
  { day: 'پنجشنبه', items: ['کلاسی ندارید'] },
  { day: 'جمعه', items: ['کلاسی ندارید'] },
]

const portalData = {
  student: {
    profile: { name: 'دانش‌آموز نمونه', className: 'هشتم پویش', nationalId: '—', phone: '—' },
    schedule: weeklySchedule,
    homework: [
      { id: 'hw-1', title: 'حل تمرین‌های فصل ۳', subject: 'ریاضی', due: '۱۴۰۵/۰۹/۰۳', status: 'pending', teacher: 'خانم کریمی', note: 'تمرین‌های ۱ تا ۱۰ در دفتر نوشته شود.' },
      { id: 'hw-2', title: 'گزارش آزمایش حرکت', subject: 'فیزیک', due: '۱۴۰۵/۰۹/۰۵', status: 'submitted', teacher: 'آقای مرادی', note: 'فایل گزارش در کلاس ارائه می‌شود.' },
      { id: 'hw-3', title: 'خلاصه‌نویسی درس ۴', subject: 'ادبیات فارسی', due: '۱۴۰۵/۰۹/۰۲', status: 'late', teacher: 'خانم احمدی', note: 'خلاصه حداقل یک صفحه باشد.' },
      { id: 'hw-4', title: 'پرسش‌های کتبی درس ۵', subject: 'مطالعات اجتماعی', due: '۱۴۰۵/۰۹/۰۷', status: 'pending', teacher: 'آقای حسینی', note: 'پاسخ‌ها کامل و خوانا نوشته شود.' },
    ],
    grades: [
      { id: 'gr-1', subject: 'ریاضی', assessment: 'آزمون فصل ۲', date: '۱۴۰۵/۰۸/۲۰', score: 19, outOf: 20, status: 'عالی' },
      { id: 'gr-2', subject: 'فیزیک', assessment: 'کوییز درس ۳', date: '۱۴۰۵/۰۸/۲۵', score: 17, outOf: 20, status: 'خوب' },
      { id: 'gr-3', subject: 'ادبیات فارسی', assessment: 'املا و نگارش', date: '۱۴۰۵/۰۸/۱۸', score: 18.5, outOf: 20, status: 'عالی' },
      { id: 'gr-4', subject: 'شیمی', assessment: 'آزمون میان‌ترم', date: '۱۴۰۵/۰۸/۲۸', score: 16, outOf: 20, status: 'قابل قبول' },
    ],
    messages: [
      { id: 'msg-1', title: 'یادآوری آزمون ریاضی', from: 'خانم کریمی (ریاضی)', date: '۱۴۰۵/۰۸/۳۰', body: 'آزمون فصل ۳ روز دوشنبه برگزار می‌شود. تمرین‌های پایان فصل را مرور کنید.', read: false },
      { id: 'msg-2', title: 'برنامه کلاس جبرانی', from: 'معاون آموزشی', date: '۱۴۰۵/۰۸/۲۹', body: 'کلاس جبرانی فیزیک روز چهارشنبه ساعت سوم در آزمایشگاه برگزار می‌شود.', read: false },
      { id: 'msg-3', title: 'تأیید دریافت تکلیف', from: 'آقای مرادی (فیزیک)', date: '۱۴۰۵/۰۸/۲۷', body: 'گزارش آزمایش شما دریافت شد. نتیجه بررسی به‌زودی اعلام می‌شود.', read: true },
    ],
  },
  teacher: {
    profile: { name: 'دبیر نمونه', lesson: 'ریاضی', phone: '—' },
    schedule: weeklySchedule,
    attendance: {
      className: 'هشتم پویش',
      date: '۱۴۰۵/۰۹/۰۱',
      students: [
        { id: 'att-1', name: 'علی رضایی', status: 'present' },
        { id: 'att-2', name: 'مریم کاظمی', status: 'present' },
        { id: 'att-3', name: 'سینا احمدی', status: 'late' },
        { id: 'att-4', name: 'نگار حسینی', status: 'absent' },
        { id: 'att-5', name: 'پارسا محمدی', status: 'present' },
        { id: 'att-6', name: 'الهام کریمی', status: 'present' },
      ],
    },
    grades: [
      { id: 'tg-1', student: 'علی رضایی', className: 'هشتم پویش', assessment: 'آزمون فصل ۳ ریاضی', date: '۱۴۰۵/۰۹/۰۱', score: '۱۹', outOf: 20 },
      { id: 'tg-2', student: 'مریم کاظمی', className: 'هشتم پویش', assessment: 'آزمون فصل ۳ ریاضی', date: '۱۴۰۵/۰۹/۰۱', score: '۱۸', outOf: 20 },
      { id: 'tg-3', student: 'سینا احمدی', className: 'هشتم پویش', assessment: 'کوییز هفتگی', date: '۱۴۰۵/۰۸/۲۸', score: '۸', outOf: 10 },
      { id: 'tg-4', student: 'نگار حسینی', className: 'هشتم پویش', assessment: 'فعالیت کلاسی', date: '۱۴۰۵/۰۸/۲۷', score: '-', outOf: 20 },
    ],
    homework: [
      { id: 'th-1', title: 'تمرین‌های فصل ۳', className: 'هشتم پویش', due: '۱۴۰۵/۰۹/۰۳', status: 'active', submissions: '۱۸/۲۴' },
      { id: 'th-2', title: 'جزوه جمع‌بندی فیزیک', className: 'نهم تلاش', due: '۱۴۰۵/۰۹/۰۴', status: 'review', submissions: '۲۰/۲۲' },
      { id: 'th-3', title: 'پروژه تحقیق علوم', className: 'هشتم پویش', due: '۱۴۰۵/۰۸/۲۹', status: 'closed', submissions: '۲۴/۲۴' },
    ],
    messages: [
      { id: 'tm-1', title: 'سؤال درباره تکلیف ریاضی', from: 'ولی دانش‌آموز: علی رضایی', date: '۱۴۰۵/۰۸/۳۰', body: 'سلام، لطفاً در مورد نحوه تحویل تمرین‌های فصل ۳ راهنمایی بفرمایید.', read: false },
      { id: 'tm-2', title: 'هماهنگی کلاس جبرانی', from: 'معاون آموزشی', date: '۱۴۰۵/۰۸/۲۹', body: 'کلاس جبرانی این هفته طبق برنامه جدید برگزار می‌شود. لطفاً حضور دانش‌آموزان را اطلاع‌رسانی کنید.', read: false },
      { id: 'tm-3', title: 'گزارش وضعیت کلاس', from: 'مدیر مدرسه', date: '۱۴۰۵/۰۸/۲۸', body: 'لطفاً گزارش کوتاه عملکرد کلاس هشتم پویش را تا پایان هفته ارسال کنید.', read: true },
    ],
  },
  admin: {
    profile: { name: 'مدیر نمونه', roleTitle: 'مدیر مدرسه', phone: '—' },
    students: [
      { id: 'st-1', name: 'علی رضایی', className: 'هشتم پویش', average: '۱۸.۹', status: 'active', contact: '۰۹۱۲۳۴۵۶۷۸۹' },
      { id: 'st-2', name: 'مریم کاظمی', className: 'هشتم پویش', average: '۱۹.۳', status: 'active', contact: '۰۹۱۲۷۶۵۴۳۲۱' },
      { id: 'st-3', name: 'سینا احمدی', className: 'نهم تلاش', average: '۱۶.۸', status: 'leave', contact: '۰۹۱۲۹۸۷۶۵۴۳' },
      { id: 'st-4', name: 'نگار حسینی', className: 'هفتم امید', average: '۱۷.۵', status: 'active', contact: '۰۹۱۲۰۰۱۱۲۲۳' },
    ],
    classes: [
      { id: 'cl-1', name: 'هشتم پویش', grade: 'پایه هشتم', teacher: 'خانم کریمی', students: 24, schedule: 'شنبه تا چهارشنبه - ۴ زنگ', status: 'active' },
      { id: 'cl-2', name: 'نهم تلاش', grade: 'پایه نهم', teacher: 'آقای مرادی', students: 22, schedule: 'شنبه، دوشنبه، چهارشنبه - ۳ زنگ', status: 'active' },
      { id: 'cl-3', name: 'هفتم امید', grade: 'پایه هفتم', teacher: 'خانم احمدی', students: 26, schedule: 'یکشنبه تا چهارشنبه - ۴ زنگ', status: 'active' },
    ],
    announcements: [
      { id: 'an-1', title: 'برگزاری جلسه اولیا', audience: 'اولیا و دبیران', date: '۱۴۰۵/۰۹/۰۴', status: 'sent', body: 'جلسه عمومی اولیا روز چهارشنبه ساعت ۱۷ در سالن مدرسه برگزار می‌شود.' },
      { id: 'an-2', title: 'تغییر برنامه امتحانات میان‌ترم', audience: 'دانش‌آموزان پایه هشتم و نهم', date: '۱۴۰۵/۰۹/۰۲', status: 'sent', body: 'برنامه امتحانات میان‌ترم با تغییرات جدید در سامانه منتشر شد.' },
      { id: 'an-3', title: 'یادآوری ثبت نمرات مستمر', audience: 'دبیران', date: '۱۴۰۵/۰۹/۰۱', status: 'draft', body: 'لطفاً نمرات مستمر کلاس‌ها تا پایان هفته در سامانه ثبت شود.' },
    ],
    reports: [
      { id: 'rp-1', title: 'گزارش حضور و غیاب هفتگی', type: 'حضور و غیاب', period: 'هفته چهارم آبان ۱۴۰۵', status: 'ready', summary: 'میانگین حضور مدرسه ۹۶٪ و ۸ مورد غیبت ثبت شده است.' },
      { id: 'rp-2', title: 'گزارش عملکرد تحصیلی پایه هشتم', type: 'عملکرد تحصیلی', period: 'آبان ۱۴۰۵', status: 'ready', summary: 'میانگین نمرات پایه هشتم ۱۸.۱ و روند پیشرفت مثبت است.' },
      { id: 'rp-3', title: 'گزارش فعالیت دبیران', type: 'فعالیت آموزشی', period: 'آبان ۱۴۰۵', status: 'in-progress', summary: 'در حال جمع‌آوری اطلاعات ثبت تکالیف، نمرات و بازخورد کلاس‌ها.' },
    ],
  },
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

app.get('/api/portal/bootstrap', (req, res) => {
  const session = requireAuth(req, res)
  if (!session) return
  const data = portalData[session.role]
  if (!data) return res.status(400).json({ ok: false, reason: 'invalid_role', message: 'نقش نامعتبر است.' })
  return res.json({ ok: true, role: session.role, data })
})

// --- Student mutations ---
app.post('/api/portal/student/homework/:id/submit', (req, res) => {
  const session = requireRole(req, res, 'student')
  if (!session) return
  const item = portalData.student.homework.find((h) => h.id === req.params.id)
  if (!item) return res.status(404).json({ ok: false, reason: 'not_found', message: 'تکلیف پیدا نشد.' })
  item.status = 'submitted'
  if (typeof req.body?.note === 'string' && req.body.note.trim()) item.note = req.body.note.trim()
  return res.json({ ok: true, item })
})

app.patch('/api/portal/student/messages/:id/read', (req, res) => {
  const session = requireRole(req, res, 'student')
  if (!session) return
  const item = portalData.student.messages.find((m) => m.id === req.params.id)
  if (!item) return res.status(404).json({ ok: false, reason: 'not_found', message: 'پیام پیدا نشد.' })
  item.read = true
  return res.json({ ok: true, item })
})

// --- Teacher mutations ---
app.put('/api/portal/teacher/attendance', (req, res) => {
  const session = requireRole(req, res, 'teacher')
  if (!session) return
  const { className, date, students } = req.body || {}
  if (!Array.isArray(students)) {
    return res.status(400).json({ ok: false, reason: 'invalid_payload', message: 'لیست دانش‌آموزان نامعتبر است.' })
  }
  const allowed = new Set(['present', 'absent', 'late'])
  for (const s of students) {
    const target = portalData.teacher.attendance.students.find((x) => x.id === s.id)
    if (target && allowed.has(s.status)) target.status = s.status
  }
  if (typeof className === 'string' && className.trim()) portalData.teacher.attendance.className = className.trim()
  if (typeof date === 'string' && date.trim()) portalData.teacher.attendance.date = date.trim()
  return res.json({ ok: true, attendance: portalData.teacher.attendance })
})

app.patch('/api/portal/teacher/grades/:id', (req, res) => {
  const session = requireRole(req, res, 'teacher')
  if (!session) return
  const item = portalData.teacher.grades.find((g) => g.id === req.params.id)
  if (!item) return res.status(404).json({ ok: false, reason: 'not_found', message: 'نمره پیدا نشد.' })
  const score = typeof req.body?.score === 'string' ? req.body.score.trim() : String(req.body?.score ?? '').trim()
  const outOf = Number(req.body?.outOf)
  if (!score) return res.status(400).json({ ok: false, reason: 'invalid_payload', message: 'نمره الزامی است.' })
  if (![5, 10, 20].includes(outOf)) return res.status(400).json({ ok: false, reason: 'invalid_payload', message: 'مقیاس نمره نامعتبر است.' })
  const n = Number(score.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/،/g, '.').replace(/,/g, '.'))
  if (Number.isNaN(n) || n < 0 || n > outOf) {
    return res.status(400).json({ ok: false, reason: 'invalid_payload', message: `نمره باید بین ۰ تا ${outOf} باشد.` })
  }
  item.score = score
  item.outOf = outOf
  return res.json({ ok: true, item })
})

app.post('/api/portal/teacher/homework', (req, res) => {
  const session = requireRole(req, res, 'teacher')
  if (!session) return
  const { title, className, due } = req.body || {}
  if (!title || !className || !due) {
    return res.status(400).json({ ok: false, reason: 'invalid_payload', message: 'عنوان، کلاس و موعد تحویل الزامی است.' })
  }
  const item = { id: uid('th'), title: String(title).trim(), className: String(className).trim(), due: String(due).trim(), status: 'active', submissions: '۰/۰' }
  portalData.teacher.homework.unshift(item)
  return res.status(201).json({ ok: true, item })
})

app.patch('/api/portal/teacher/messages/:id/read', (req, res) => {
  const session = requireRole(req, res, 'teacher')
  if (!session) return
  const item = portalData.teacher.messages.find((m) => m.id === req.params.id)
  if (!item) return res.status(404).json({ ok: false, reason: 'not_found', message: 'پیام پیدا نشد.' })
  item.read = true
  return res.json({ ok: true, item })
})

// --- Admin mutations ---
app.post('/api/portal/admin/students', (req, res) => {
  const session = requireRole(req, res, 'admin')
  if (!session) return
  const { name, className, contact } = req.body || {}
  if (!name || !className) return res.status(400).json({ ok: false, reason: 'invalid_payload', message: 'نام و کلاس الزامی است.' })
  const item = { id: uid('st'), name: String(name).trim(), className: String(className).trim(), average: '—', status: 'active', contact: String(contact || '—').trim() || '—' }
  portalData.admin.students.unshift(item)
  return res.status(201).json({ ok: true, item })
})

app.patch('/api/portal/admin/students/:id', (req, res) => {
  const session = requireRole(req, res, 'admin')
  if (!session) return
  const item = portalData.admin.students.find((s) => s.id === req.params.id)
  if (!item) return res.status(404).json({ ok: false, reason: 'not_found', message: 'دانش‌آموز پیدا نشد.' })
  for (const k of ['name', 'className', 'average', 'status', 'contact']) {
    if (typeof req.body?.[k] === 'string' && req.body[k].trim()) item[k] = req.body[k].trim()
  }
  return res.json({ ok: true, item })
})

app.delete('/api/portal/admin/students/:id', (req, res) => {
  const session = requireRole(req, res, 'admin')
  if (!session) return
  const idx = portalData.admin.students.findIndex((s) => s.id === req.params.id)
  if (idx < 0) return res.status(404).json({ ok: false, reason: 'not_found', message: 'دانش‌آموز پیدا نشد.' })
  portalData.admin.students.splice(idx, 1)
  return res.json({ ok: true, id: req.params.id })
})

app.post('/api/portal/admin/classes', (req, res) => {
  const session = requireRole(req, res, 'admin')
  if (!session) return
  const { name, grade, teacher } = req.body || {}
  if (!name) return res.status(400).json({ ok: false, reason: 'invalid_payload', message: 'نام کلاس الزامی است.' })
  const item = { id: uid('cl'), name: String(name).trim(), grade: String(grade || '—').trim(), teacher: String(teacher || '—').trim(), students: 0, schedule: '—', status: 'active' }
  portalData.admin.classes.unshift(item)
  return res.status(201).json({ ok: true, item })
})

app.patch('/api/portal/admin/classes/:id', (req, res) => {
  const session = requireRole(req, res, 'admin')
  if (!session) return
  const item = portalData.admin.classes.find((c) => c.id === req.params.id)
  if (!item) return res.status(404).json({ ok: false, reason: 'not_found', message: 'کلاس پیدا نشد.' })
  for (const k of ['name', 'grade', 'teacher', 'schedule', 'status']) {
    if (typeof req.body?.[k] === 'string' && req.body[k].trim()) item[k] = req.body[k].trim()
  }
  if (typeof req.body?.students === 'number') item.students = req.body.students
  return res.json({ ok: true, item })
})

app.delete('/api/portal/admin/classes/:id', (req, res) => {
  const session = requireRole(req, res, 'admin')
  if (!session) return
  const idx = portalData.admin.classes.findIndex((c) => c.id === req.params.id)
  if (idx < 0) return res.status(404).json({ ok: false, reason: 'not_found', message: 'کلاس پیدا نشد.' })
  portalData.admin.classes.splice(idx, 1)
  return res.json({ ok: true, id: req.params.id })
})

app.post('/api/portal/admin/announcements', (req, res) => {
  const session = requireRole(req, res, 'admin')
  if (!session) return
  const { title, audience, body, status } = req.body || {}
  if (!title) return res.status(400).json({ ok: false, reason: 'invalid_payload', message: 'عنوان اعلان الزامی است.' })
  const item = { id: uid('an'), title: String(title).trim(), audience: String(audience || 'همه').trim(), date: new Date().toLocaleDateString('fa-IR-u-nu-latn'), status: status === 'draft' ? 'draft' : 'sent', body: String(body || '').trim() }
  portalData.admin.announcements.unshift(item)
  return res.status(201).json({ ok: true, item })
})

app.patch('/api/portal/admin/announcements/:id', (req, res) => {
  const session = requireRole(req, res, 'admin')
  if (!session) return
  const item = portalData.admin.announcements.find((a) => a.id === req.params.id)
  if (!item) return res.status(404).json({ ok: false, reason: 'not_found', message: 'اعلان پیدا نشد.' })
  for (const k of ['title', 'audience', 'body', 'status', 'date']) {
    if (typeof req.body?.[k] === 'string' && req.body[k].trim()) item[k] = req.body[k].trim()
  }
  return res.json({ ok: true, item })
})

app.post('/api/portal/admin/reports/:id/refresh', (req, res) => {
  const session = requireRole(req, res, 'admin')
  if (!session) return
  const item = portalData.admin.reports.find((r) => r.id === req.params.id)
  if (!item) return res.status(404).json({ ok: false, reason: 'not_found', message: 'گزارش پیدا نشد.' })
  item.status = 'ready'
  item.summary = item.summary || 'گزارش به‌روزرسانی شد.'
  return res.json({ ok: true, item })
})

app.use((req, res) => {
  res.status(404).json({ ok: false, reason: 'not_found', path: req.path })
})

app.listen(PORT, () => {
  console.log(`[madreseyar-server] listening on http://localhost:${PORT}`)
})
