const steps = [
  { num: '۱', title: 'ثبت‌نام مدیر', desc: 'با شماره همراه ثبت‌نام می‌کنید و پرونده مدرسه در چند دقیقه ساخته می‌شود.' },
  { num: '۲', title: 'تعریف مدرسه', desc: 'کلاس‌ها، معلمان و دانش‌آموزان را وارد می‌کنید؛ معمولاً کمتر از یک بعدازظهر.' },
  { num: '۳', title: 'شروع سال تحصیلی', desc: 'معلم‌ها و اولیا اپ را نصب می‌کنند و مدرسه روی ریل می‌افتد.' },
]

export default function Steps() {
  return (
    <section id="steps" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">مسیر راه‌اندازی</span>
          <h2>از ثبت‌نام تا اولین زنگ، سه قدم</h2>
          <p>لازم نیست کسی را آموزش بدهید یا سیستم پیچیده‌ای بخرید. یک بعدازظهر کافی است.</p>
        </div>
        <div className="steps-grid">
          {steps.map((s) => (
            <article key={s.num} className="card step-card">
              <span className="step-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
        <div className="steps-note">راه‌اندازی رایگان است؛ هزینه فقط بابت اشتراک ماهانه یا سالانه خواهد بود.</div>
      </div>
    </section>
  )
}
