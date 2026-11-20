import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Features from './components/Features'
import Roles from './components/Roles'
import Steps from './components/Steps'
import Security from './components/Security'
import FAQ from './components/FAQ'
import Guides from './components/Guides'
import Footer from './components/Footer'
import StudentPortal from './components/StudentPortal'
import LoginPage from './components/LoginPage'
import StaffAccess from './components/StaffAccess'
import { SESSION_STORAGE_KEY } from './config/auth'
import { isMockMode } from './config/app'
import { getSession, signOut } from './services/session'

const VIEW_HASH = {
  home: '#home',
  'student-login': '#student-login',
  'staff-access': '#staff-access',
  'admin-login': '#admin-login',
  'teacher-login': '#teacher-login',
}

function viewFromHash(hash) {
  const h = (hash || '').toLowerCase()
  if (h === VIEW_HASH['student-login']) return 'student-login'
  if (h === VIEW_HASH['staff-access']) return 'staff-access'
  if (h === VIEW_HASH['admin-login']) return 'admin-login'
  if (h === VIEW_HASH['teacher-login']) return 'teacher-login'
  return 'home'
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    return {
      view: typeof data.view === 'string' ? data.view : 'home',
      studentAuthed: !!data.studentAuthed,
      adminAuthed: !!data.adminAuthed,
      teacherAuthed: !!data.teacherAuthed,
    }
  } catch {
    return null
  }
}

function getInitialState() {
  const fromUrl = viewFromHash(window.location.hash)
  const saved = readSession()
  const view = fromUrl !== 'home' ? fromUrl : (saved?.view && VIEW_HASH[saved.view] ? saved.view : 'home')
  return {
    view,
    studentAuthed: !!saved?.studentAuthed,
    adminAuthed: !!saved?.adminAuthed,
    teacherAuthed: !!saved?.teacherAuthed,
  }
}

function App() {
  const [initial] = useState(getInitialState)
  const [view, setViewState] = useState(initial.view)
  const [studentAuthed, setStudentAuthed] = useState(isMockMode ? initial.studentAuthed : false)
  const [adminAuthed, setAdminAuthed] = useState(isMockMode ? initial.adminAuthed : false)
  const [teacherAuthed, setTeacherAuthed] = useState(isMockMode ? initial.teacherAuthed : false)
  const [sessionChecked, setSessionChecked] = useState(isMockMode)

  const navigate = (nextView, { replace = false } = {}) => {
    setViewState(nextView)
    const hash = VIEW_HASH[nextView] || VIEW_HASH.home
    const url = `${window.location.pathname}${window.location.search}${hash}`
    if (replace) {
      window.history.replaceState(null, '', url)
    } else if (window.location.hash !== hash) {
      window.history.pushState(null, '', url)
    }
  }

  useEffect(() => {
    const onHashChange = () => {
      setViewState(viewFromHash(window.location.hash))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const hash = VIEW_HASH[view] || VIEW_HASH.home
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`)
    }
  }, [view])

  useEffect(() => {
    if (!isMockMode) {
      let cancelled = false
      ;(async () => {
        const result = await getSession()
        if (cancelled) return
        if (result?.ok) {
          setStudentAuthed(result.role === 'student')
          setAdminAuthed(result.role === 'admin')
          setTeacherAuthed(result.role === 'teacher')
        } else {
          setStudentAuthed(false)
          setAdminAuthed(false)
          setTeacherAuthed(false)
        }
        setSessionChecked(true)
      })()
      return () => {
        cancelled = true
      }
    }
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ view, studentAuthed, adminAuthed, teacherAuthed }),
      )
    } catch {
      // ignore storage errors
    }
  }, [view, studentAuthed, adminAuthed, teacherAuthed])

  useEffect(() => {
    let title = 'مدرسه‌یار | سامانه هوشمند مدیریت مدرسه'
    if (view === 'student-login') title = studentAuthed ? 'پنل دانش‌آموز | مدرسه‌یار' : 'ورود دانش‌آموز | مدرسه‌یار'
    else if (view === 'staff-access') title = 'ورود مدیر یا دبیر | مدرسه‌یار'
    else if (view === 'admin-login') title = adminAuthed ? 'پنل مدیر | مدرسه‌یار' : 'ورود مدیر | مدرسه‌یار'
    else if (view === 'teacher-login') title = teacherAuthed ? 'پنل دبیر | مدرسه‌یار' : 'ورود دبیر | مدرسه‌یار'
    document.title = title
  }, [view, studentAuthed, adminAuthed, teacherAuthed])

  const goHome = () => {
    setStudentAuthed(false)
    setAdminAuthed(false)
    setTeacherAuthed(false)
    if (!isMockMode) {
      void signOut()
    }
    navigate('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goStaffAccess = () => {
    setAdminAuthed(false)
    setTeacherAuthed(false)
    navigate('staff-access')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!sessionChecked) {
    return (
      <div className="app">
        <div className="login-page" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <div className="card" style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--muted)' }}>
            در حال بررسی نشست...
          </div>
        </div>
      </div>
    )
  }

  if (view === 'student-login') {
    if (!studentAuthed) {
      return (
        <div className="app">
          <LoginPage
            role="student"
            onSuccess={() => {
              setStudentAuthed(true)
              window.scrollTo({ top: 0 })
            }}
            onBack={goHome}
            eyebrow="حساب کاربری دانش‌آموز"
            title="ورود به پنل دانش‌آموز"
            description="برای دسترسی به برنامه کلاسی، تکالیف، نمرات و اعلان‌ها وارد حساب خود شوید."
            submitLabel="ورود به حساب"
            sideBadge="دسترسی سریع و امن"
            sideTitle="همه چیز دانش‌آموز در یک پنل"
            sideItems={[
              'مشاهده برنامه هفتگی و کلاس‌ها',
              'پیگیری تکالیف و وضعیت ارسال',
              'دسترسی به نمرات و کارنامه',
              'دریافت اعلان‌ها و پیام‌های مدرسه',
            ]}
            sideStats={[
              { value: '۷/۲۴', label: 'دسترسی آنلاین' },
              { value: 'یکپارچه', label: 'اطلاعات تحصیلی' },
            ]}
          />
        </div>
      )
    }

    return (
      <div className="app">
        <a href="#portal-main" className="skip-link">پرش به محتوای اصلی</a>
        <StudentPortal mode="student" onBack={goHome} />
      </div>
    )
  }

  if (view === 'staff-access') {
    return (
      <div className="app">
        <StaffAccess
          onAdminSelect={() => { navigate('admin-login'); window.scrollTo({ top: 0 }) }}
          onTeacherSelect={() => { navigate('teacher-login'); window.scrollTo({ top: 0 }) }}
          onBack={goHome}
        />
      </div>
    )
  }

  if (view === 'admin-login') {
    if (!adminAuthed) {
      return (
        <div className="app">
          <LoginPage
            role="admin"
            onSuccess={() => {
              setAdminAuthed(true)
              window.scrollTo({ top: 0 })
            }}
            onBack={goStaffAccess}
            backLabel="بازگشت به انتخاب نقش"
            eyebrow="پنل مدیریت مدرسه"
            title="ورود به پنل مدیر"
            description="برای مدیریت دانش‌آموزان، کلاس‌ها، گزارش‌ها و تنظیمات سامانه وارد حساب مدیریتی شوید."
            submitLabel="ورود به پنل مدیر"
            sideBadge="مدیریت متمرکز"
            sideTitle="کنترل و نظارت بر امور مدرسه"
            sideItems={[
              'مدیریت دانش‌آموزان و کلاس‌ها',
              'بررسی گزارش‌ها و وضعیت تحصیلی',
              'ارسال اعلان‌ها و پیام‌های مهم',
              'تنظیم نقش‌ها و دسترسی‌های سامانه',
            ]}
            sideStats={[
              { value: 'یکپارچه', label: 'مدیریت مدرسه' },
              { value: 'شفاف', label: 'گزارش‌گیری' },
            ]}
          />
        </div>
      )
    }

    return (
      <div className="app">
        <a href="#portal-main" className="skip-link">پرش به محتوای اصلی</a>
        <StudentPortal mode="admin" onBack={goHome} />
      </div>
    )
  }

  if (view === 'teacher-login') {
    if (!teacherAuthed) {
      return (
        <div className="app">
          <LoginPage
            role="teacher"
            onSuccess={() => {
              setTeacherAuthed(true)
              window.scrollTo({ top: 0 })
            }}
            onBack={goStaffAccess}
            backLabel="بازگشت به انتخاب نقش"
            eyebrow="پنل آموزشی دبیر"
            title="ورود به پنل دبیر"
            description="برای ثبت حضور و غیاب، نمرات، تکالیف و پیگیری وضعیت کلاس‌ها وارد حساب دبیر شوید."
            submitLabel="ورود به پنل دبیر"
            sideBadge="ابزارهای تدریس"
            sideTitle="مدیریت کلاس و یادگیری در یک جا"
            sideItems={[
              'ثبت حضور و غیاب و تأخیر دانش‌آموزان',
              'ثبت نمرات و ارزیابی‌های کلاسی',
              'ارسال تکلیف و محتوای درسی',
              'پیگیری برنامه هفتگی و گزارش کلاس',
            ]}
            sideStats={[
              { value: 'سریع', label: 'ثبت اطلاعات کلاس' },
              { value: 'منظم', label: 'پیگیری آموزشی' },
            ]}
          />
        </div>
      )
    }

    return (
      <div className="app">
        <a href="#portal-main" className="skip-link">پرش به محتوای اصلی</a>
        <StudentPortal mode="teacher" onBack={goHome} />
      </div>
    )
  }

  return (
    <div className="app">
      <a href="#main" className="skip-link">پرش به محتوای اصلی</a>
      <Navbar
        onStudentLogin={() => {
          setStudentAuthed(false)
          navigate('student-login')
          window.scrollTo({ top: 0 })
        }}
        onStaffLogin={() => {
          setAdminAuthed(false)
          setTeacherAuthed(false)
          navigate('staff-access')
          window.scrollTo({ top: 0 })
        }}
      />
      <main id="main">
        <Hero />
        <Stats />
        <Features />
        <Roles />
        <Steps />
        <Security />
        <FAQ />
        <Guides />
      </main>
      <Footer />
    </div>
  )
}

export default App
