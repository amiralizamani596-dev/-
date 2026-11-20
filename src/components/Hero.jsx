export default function Hero() {
  const go = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">سامانه مدیریت مدرسه · نسخه ۱.۳</span>
          <h1>دفتر حضور و غیاب، دفتر نمره، دفتر انضباط؛ همه در یک پیشخوان.</h1>
          <p>
            مدرسه‌یار کار کاغذی مدرسه را جمع می‌کند و به‌جایش یک سامانه یکپارچه می‌گذارد که مدیر، معلم،
            دانش‌آموز و اولیا هرکدام سهم خودشان را همان لحظه‌ای که اتفاق می‌افتد می‌بینند.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => go('contact')} title="اسکرول به بخش تماس برای ثبت درخواست مشاوره" aria-label="درخواست مشاوره رایگان - انتقال به بخش تماس">
              درخواست مشاوره رایگان
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => go('features')} title="اسکرول به بخش امکانات سامانه" aria-label="آشنایی با امکانات - انتقال به بخش امکانات">
              آشنایی با امکانات
            </button>
          </div>
          <ul className="hero-points" aria-label="مزایا">
            <li>پیشخوان یکپارچه برای همه نقش‌ها</li>
            <li>گزارش‌گیری و اطلاع‌رسانی سریع</li>
            <li>راه‌اندازی آسان و پشتیبانی همراه</li>
          </ul>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-panel card">
            <div className="hero-panel-head">
              <span>دفتر کلاس — هشتم پویش</span>
              <span className="status-pill">ثبت شد · ۱۴:۰۷</span>
            </div>
            <div className="hero-table">
              <div className="hero-row head"><span>دانش‌آموز</span><span>حضور</span><span>نمره</span></div>
              <div className="hero-row"><span>ارشاویر برزین</span><span className="ok">✓</span><span>۱۹</span></div>
              <div className="hero-row"><span>متین خازنی</span><span className="ok">✓</span><span>۲۰</span></div>
              <div className="hero-row"><span>جلیل زارع</span><span className="no">✕</span><span>—</span></div>
              <div className="hero-row"><span>کریم دانشور</span><span className="ok">✓</span><span>۱۷.۵</span></div>
            </div>
            <div className="hero-note">غیبت‌ها همان لحظه به اولیا اطلاع داده شد.</div>
          </div>
          <div className="hero-float card">
            <strong>پیام به اولیا</strong>
            <p>جلیل زارع امروز غایب بود.</p>
            <small>ارسال‌شده — ۸:۱۲ صبح</small>
          </div>
          <div className="hero-float alt card">
            <strong>معدل کلاس</strong>
            <p className="big">۱۸.۶ <span>از ۲۰</span></p>
            <small>محاسبه خودکار، بدون خطای انسانی</small>
          </div>
        </div>
      </div>
    </section>
  )
}
