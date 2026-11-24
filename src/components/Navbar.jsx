import { useState } from 'react'

const links = [
  { href: '#features', label: 'امکانات' },
  { href: '#roles', label: 'نقش‌ها' },
  { href: '#steps', label: 'راه‌اندازی' },
  { href: '#security', label: 'امنیت' },
  { href: '#faq', label: 'پرسش‌ها' },
]

export default function Navbar({ onStudentLogin, onStaffLogin }) {
  const [open, setOpen] = useState(false)

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <a href="#home" className="brand" onClick={(e) => go(e, '#home')} aria-label="مدرسه‌یار، صفحه اصلی">
          <span className="brand-mark" aria-hidden="true">م</span>
          <span className="brand-text">
            <strong>مدرسه‌یار</strong>
            <small>سامانه هوشمند مدیریت مدرسه</small>
          </span>
        </a>

        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'بستن منو' : 'باز کردن منو'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="site-nav" className={`site-nav ${open ? 'open' : ''}`} aria-label="ناوبری اصلی">
          <div className="site-nav-links">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>{l.label}</a>
            ))}
          </div>
          <div className="nav-actions">
            <button type="button" className="btn btn-secondary" onClick={() => { setOpen(false); onStaffLogin?.() }} title="انتخاب ورود مدیر یا دبیر" aria-label="ورود مدیر یا دبیر - انتخاب نقش و ورود">
              ورود مدیر یا دبیر
            </button>
            <button type="button" className="btn btn-primary" onClick={() => { setOpen(false); onStudentLogin?.() }} title="باز کردن حساب کاربری دانش‌آموز" aria-label="ورود به حساب دانش‌آموز - باز کردن پنل دانش‌آموز">
              ورود به حساب دانش‌آموز
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
