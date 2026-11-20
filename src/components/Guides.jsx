import { useEffect, useState } from 'react'

const guides = [
  {
    tag: 'ویژه دبیران',
    title: 'ثبت حضور و نمرات پس از هر جلسه',
    desc: 'راهنمایی کاربردی برای ثبت منظم حضور و غیاب، نمرات و یادداشت‌های کلاسی تا پرونده هر دانش‌آموز همیشه به‌روز بماند.',
    steps: [
      'وارد پنل کاربری خود شوید و کلاس/درس مربوطه را از برنامه هفتگی انتخاب کنید.',
      'در همان روز، حضور، غیبت و تأخیر دانش‌آموزان را ثبت کنید تا گزارش‌ها دقیق بماند.',
      'نمرات فعالیت کلاسی یا آزمون را همراه با تاریخ و عنوان کوتاه وارد کنید.',
      'در صورت نیاز، یادداشت آموزشی یا مورد انضباطی مهم را در پرونده دانش‌آموز ثبت کنید.',
      'پیش از پایان هفته، موارد ناقص (غیبت بدون توضیح یا نمره ثبت‌نشده) را بررسی و تکمیل کنید.',
    ],
  },
  {
    tag: 'ویژه دانش‌آموزان',
    title: 'پیگیری برنامه، تکالیف و وضعیت تحصیلی',
    desc: 'با بررسی روزانه برنامه و تکالیف، می‌توانید بدون عجله و فراموشی، وضعیت درسی خود را بهتر مدیریت کنید.',
    steps: [
      'از صفحه اصلی روی «ورود به حساب دانش‌آموز» کلیک کنید و وارد پنل خود شوید.',
      'برنامه هفتگی را بررسی کنید تا زمان کلاس‌ها، امتحانات و تکالیف پیشِ رو را بدانید.',
      'بخش تکالیف را به‌صورت منظم چک کنید و موعد تحویل هر مورد را یادداشت کنید.',
      'کارنامه و نمرات ثبت‌شده را مرور کنید تا نقاط قوت و درس‌های نیازمند تمرین را بشناسید.',
      'اعلان‌ها و پیام‌های مدرسه را روزانه بررسی کنید تا از تغییرات برنامه یا اطلاعیه‌ها جا نمانید.',
    ],
  },
  {
    tag: 'ویژه مدیران',
    title: 'راه‌اندازی مدرسه در یک روز',
    desc: 'تعریف ساختار مدرسه، افزودن کلاس‌ها و کاربران، تنظیم دسترسی‌ها و آماده‌سازی برای شروع سال تحصیلی.',
    steps: [
      'از صفحه اصلی روی «ورود مدیر» کلیک کنید تا پنل مدیریت باز شود.',
      'اطلاعات پایه مدرسه، پایه‌ها و کلاس‌ها را تعریف کنید.',
      'حساب معلمان و دانش‌آموزان را ایجاد و به کلاس‌ها اختصاص دهید.',
      'نقش‌ها و سطح دسترسی‌ها را بررسی و تنظیم کنید.',
      'برنامه کلاسی و اطلاعیه آغاز سال را ثبت و برای کاربران اعلام کنید.',
    ],
  },
]

export default function Guides() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!active) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [active])

  return (
    <section id="guides" className="section alt">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">راهنما</span>
          <h2>راهنمای شروع و استفاده</h2>
          <p>راهنماهای قدم‌به‌قدم برای نقش‌های مختلف، تا بدون سردرگمی سریع شروع کنید.</p>
        </div>
        <div className="grid guides-grid">
          {guides.map((g) => (
            <article key={g.title} className="card guide-card">
              <span className="guide-tag">{g.tag}</span>
              <h3>{g.title}</h3>
              <p>{g.desc}</p>
              <button
                type="button"
                className="guide-link guide-btn"
                onClick={() => setActive(g)}
                title={`نمایش مراحل راهنمای ${g.tag}`}
                aria-label={`نمایش راهنمای ${g.title}`}
              >
                مشاهده راهنمای گام‌به‌گام ←
              </button>
            </article>
          ))}
        </div>
      </div>

      {active && (
        <div className="guide-modal-backdrop" onClick={() => setActive(null)} role="presentation">
          <div
            className="guide-modal card"
            role="dialog"
            aria-modal="true"
            aria-label={`راهنمای ${active.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="guide-tag">{active.tag}</span>
            <h3>{active.title}</h3>
            <p className="muted" style={{ margin: '0 0 .75rem' }}>{active.desc}</p>
            <ol className="guide-steps">
              {active.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <div className="guide-modal-actions">
              <button type="button" className="btn btn-primary" onClick={() => setActive(null)}>متوجه شدم و بستن</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
