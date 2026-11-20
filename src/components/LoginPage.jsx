import { useState } from 'react'
import { signIn } from '../services/session'

export default function LoginPage({
  onSuccess,
  onBack,
  role = 'student',
  eyebrow = 'حساب کاربری دانش‌آموز',
  title = 'ورود به پنل دانش‌آموز',
  description = 'برای دسترسی به برنامه کلاسی، تکالیف، نمرات و اعلان‌ها وارد حساب خود شوید.',
  submitLabel = 'ورود به حساب',
  sideBadge = 'دسترسی سریع و امن',
  sideTitle = 'همه چیز دانش‌آموز در یک پنل',
  sideItems = [
    'مشاهده برنامه هفتگی و کلاس‌ها',
    'پیگیری تکالیف و وضعیت ارسال',
    'دسترسی به نمرات و کارنامه',
    'دریافت اعلان‌ها و پیام‌های مدرسه',
  ],
  sideStats = [
    { value: '۷/۲۴', label: 'دسترسی آنلاین' },
    { value: 'یکپارچه', label: 'اطلاعات تحصیلی' },
  ],
  footnote = 'در صورت فراموشی اطلاعات ورود، با مسئول مدرسه یا پشتیبانی تماس بگیرید.',
  backLabel = 'بازگشت به سایت',
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const u = username.trim()
    const p = password

    if (!u || !p) {
      setError('لطفاً نام کاربری و رمز عبور را وارد کنید.')
      return
    }

    setSubmitting(true)
    try {
      const result = await signIn(role, u, p)
      if (result?.ok) {
        onSuccess?.(result)
      } else if (result?.reason === 'invalid_credentials') {
        setError('نام کاربری یا رمز عبور نادرست است.')
      } else if (result?.message) {
        setError(result.message)
      } else {
        setError('ورود انجام نشد. لطفاً دوباره تلاش کنید.')
      }
    } catch {
      setError('خطا در ورود. لطفاً دوباره تلاش کنید.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <a href="#login-main" className="skip-link">پرش به فرم ورود</a>

      <header className="login-topbar">
        <div className="container login-topbar-inner">
          <button type="button" className="brand login-brand" onClick={onBack} aria-label="بازگشت به صفحه اصلی">
            <span className="brand-mark" aria-hidden="true">م</span>
            <span className="brand-text">
              <strong>مدرسه‌یار</strong>
              <small>سامانه هوشمند مدیریت مدرسه</small>
            </span>
          </button>
          <button type="button" className="btn btn-secondary login-back-btn" onClick={onBack}>
            {backLabel}
          </button>
        </div>
      </header>

      <main id="login-main" className="login-main">
        <div className="container login-layout">
          <section className="login-card card" aria-labelledby="login-title">
            <div className="login-card-head">
              <span className="eyebrow">{eyebrow}</span>
              <h1 id="login-title">{title}</h1>
              <p>{description}</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <label className="login-field">
                <span>نام کاربری</span>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  inputMode="text"
                  placeholder="نام کاربری خود را وارد کنید"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  aria-invalid={error ? 'true' : 'false'}
                />
              </label>

              <label className="login-field">
                <span>رمز عبور</span>
                <div className="login-password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    placeholder="رمز عبور خود را وارد کنید"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={error ? 'true' : 'false'}
                  />
                  <button
                    type="button"
                    className="login-toggle-pass"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                    title={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                  >
                    {showPassword ? 'پنهان' : 'نمایش'}
                  </button>
                </div>
              </label>

              {error && (
                <div className="login-error" role="alert">
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary login-submit" disabled={submitting}>
                {submitting ? 'در حال بررسی...' : submitLabel}
              </button>
            </form>

            <div className="login-card-foot">
              <p className="muted">{footnote}</p>
            </div>
          </section>

          <aside className="login-side" aria-hidden="true">
            <div className="login-side-card">
              <div className="login-side-badge">{sideBadge}</div>
              <h2>{sideTitle}</h2>
              <ul className="login-side-list">
                {sideItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="login-side-stats">
                {sideStats.map((s) => (
                  <div key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
