const features = [
  { title: 'حضور و غیاب هوشمند', desc: 'ثبت لحظه‌ای حضور، غیبت و تأخیر توسط معلم و ارسال گزارش بدون کاغذبازی.', icon: '✓' },
  { title: 'کارنامه و تحلیل نمرات', desc: 'ثبت نمره‌ها، محاسبه خودکار معدل و نمایش روند پیشرفت هر دانش‌آموز در طول سال.', icon: '📊' },
  { title: 'اطلاع‌رسانی به خانواده', desc: 'غیبت، نمره و اطلاعیه‌ها همان لحظه از طریق پنل و اعلان در اختیار اولیا قرار می‌گیرد.', icon: '🔔' },
  { title: 'برنامه هفتگی و امتحانات', desc: 'برنامه کلاسی، تقویم آزمون‌ها و رویدادهای مدرسه در یک نمای منظم و در دسترس.', icon: '📅' },
  { title: 'مدیریت پرونده‌ها', desc: 'پرونده دانش‌آموز، معلم و کلاس؛ ثبت‌نام، جابه‌جایی و بایگانی با چند کلیک.', icon: '🗂️' },
  { title: 'دسترسی نقش‌محور', desc: 'هر نقش فقط داده‌های مرتبط با خودش را می‌بیند؛ مرزها روشن و کنترل‌شده.', icon: '🔒' },
]

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">امکانات سامانه</span>
          <h2>هر چیزی که یک مدرسه واقعاً لازم دارد</h2>
          <p>نه بیشتر، نه کمتر. امکانات این سامانه از دل کار روزمره مدرسه بیرون آمده‌اند، نه از فهرست ویژگی‌های یک نرم‌افزار اداری.</p>
        </div>
        <div className="grid features-grid">
          {features.map((f, i) => (
            <article key={f.title} className="card feature-card">
              <div className="feature-top">
                <span className="feature-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="feature-icon" aria-hidden="true">{f.icon}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
