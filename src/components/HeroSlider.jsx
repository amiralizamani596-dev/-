import { useEffect, useMemo, useState } from 'react'

export default function HeroSlider({ role, onNotify, onNavigate }) {
  const slides = useMemo(
    () => [
      {
        id: 1,
        tag: 'مدیریت یکپارچه',
        title: 'همه امور مدرسه دانش‌آموز در یک پنل مدرن',
        text: 'برنامه کلاسی، تکالیف، نمرات و اطلاع‌رسانی‌ها را به‌صورت ساده و سریع دنبال کنید.',
        cta: 'مشاهده امکانات',
        tone: 'tone-a',
      },
      {
        id: 2,
        tag: role === 'admin' ? 'ویژه مدیر' : 'ویژه دانش‌آموز',
        title:
          role === 'admin'
            ? 'کنترل کامل فرآیندها و گزارش‌گیری هوشمند'
            : 'پیگیری پیشرفت تحصیلی با گزارش‌های شفاف',
        text:
          role === 'admin'
            ? 'مدیر وبسایت می‌تواند دانش‌آموزان، اعلان‌ها و وضعیت تحصیلی را در یک داشبورد حرفه‌ای مدیریت کند.'
            : 'دانش‌آموز می‌تواند وضعیت دروس، حضور و غیاب و پیام‌های مدرسه را در هر زمان بررسی کند.',
        cta: role === 'admin' ? 'مدیریت سامانه' : 'ورود دانش‌آموز',
        tone: 'tone-b',
      },
      {
        id: 3,
        tag: 'ارتباط سریع',
        title: 'ارتباط مؤثر بین دانش‌آموز، مدرسه و مدیر',
        text: 'با اعلان‌های به‌موقع و رابط کاربری حرفه‌ای، هیچ فعالیت مهمی از دست نمی‌رود.',
        cta: 'شروع کنید',
        tone: 'tone-c',
      },
    ],
    [role],
  )

  const [index, setIndex] = useState(0)
  const [prevRole, setPrevRole] = useState(role)
  if (role !== prevRole) {
    setPrevRole(role)
    setIndex(0)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [slides.length])

  const go = (dir) => {
    setIndex((i) => (i + dir + slides.length) % slides.length)
  }

  const current = slides[index]

  const handlePrimary = () => {
    onNavigate?.('panel')
    onNotify?.(role === 'admin' ? 'پنل مدیریت آماده استفاده است.' : 'پنل دانش‌آموز آماده استفاده است.')
  }

  const handleSecondary = () => {
    onNavigate?.('services')
  }

  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className={`hero-slide ${current.tone}`}>
          <div className="hero-content">
            <span className="badge">{current.tag}</span>
            <h1>{current.title}</h1>
            <p>{current.text}</p>
            <div className="hero-actions">
              <button className="btn btn-primary" type="button" onClick={handlePrimary}>{current.cta}</button>
              <button className="btn btn-secondary" type="button" onClick={handleSecondary}>آشنایی بیشتر</button>
            </div>
            <div className="hero-meta">
              <div><strong>+۲۴</strong><span>امکان آموزشی</span></div>
              <div><strong>۲ نقش</strong><span>دانش‌آموز و مدیر</span></div>
              <div><strong>۷/۲۴</strong><span>دسترسی آنلاین</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="glass-card main">
              <h3>داشبورد امروز</h3>
              <ul>
                <li><span>کلاس‌های امروز</span><b>۴ جلسه</b></li>
                <li><span>تکالیف فعال</span><b>۳ مورد</b></li>
                <li><span>اعلان جدید</span><b>۲ پیام</b></li>
              </ul>
            </div>
            <div className="glass-card mini">
              <p>وضعیت کلی</p>
              <strong>پایدار و به‌روز</strong>
            </div>
          </div>
        </div>

        <div className="slider-controls">
          <button type="button" onClick={() => go(1)} aria-label="اسلاید قبلی">‹</button>
          <div className="dots" role="tablist" aria-label="اسلایدها">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`dot ${i === index ? 'active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`اسلاید ${i + 1}`}
                aria-selected={i === index}
              />
            ))}
          </div>
          <button type="button" onClick={() => go(-1)} aria-label="اسلاید بعدی">›</button>
        </div>
      </div>
    </section>
  )
}
