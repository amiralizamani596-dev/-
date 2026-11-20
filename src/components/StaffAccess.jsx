export default function StaffAccess({ onAdminSelect, onTeacherSelect, onBack }) {
  return (
    <div className="login-page">
      <a href="#staff-access-main" className="skip-link">پرش به انتخاب نوع ورود</a>

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
            بازگشت به سایت
          </button>
        </div>
      </header>

      <main id="staff-access-main" className="login-main">
        <div className="container staff-access-layout">
          <div className="section-head staff-access-head">
            <span className="eyebrow">ورود کارکنان مدرسه</span>
            <h1>ورود مدیر یا دبیر</h1>
            <p>نقش خود را انتخاب کنید تا وارد پنل مربوطه شوید. هر نقش دسترسی‌ها و امکانات اختصاصی خود را دارد.</p>
          </div>

          <div className="staff-access-grid">
            <article className="card staff-access-card">
              <div className="staff-access-icon" aria-hidden="true">مد</div>
              <div className="staff-access-body">
                <span className="staff-access-tag">مدیریت</span>
                <h2>ورود مدیر</h2>
                <p>مدیریت دانش‌آموزان، کلاس‌ها، گزارش‌ها، اعلان‌ها و تنظیمات سامانه از یک پنل متمرکز.</p>
                <ul className="staff-access-list">
                  <li>مدیریت کاربران و نقش‌ها</li>
                  <li>کنترل کلاس‌ها و گزارش‌ها</li>
                  <li>ارسال اعلان و نظارت بر سامانه</li>
                </ul>
              </div>
              <button type="button" className="btn btn-primary staff-access-btn" onClick={onAdminSelect}>
                ادامه به عنوان مدیر
              </button>
            </article>

            <article className="card staff-access-card">
              <div className="staff-access-icon teacher" aria-hidden="true">دب</div>
              <div className="staff-access-body">
                <span className="staff-access-tag">آموزش</span>
                <h2>ورود دبیر</h2>
                <p>ثبت حضور و غیاب، نمرات، تکالیف و ارتباط آموزشی با دانش‌آموزان و مدیر مدرسه.</p>
                <ul className="staff-access-list">
                  <li>ثبت حضور و غیاب و نمرات</li>
                  <li>مدیریت تکالیف و محتوای درسی</li>
                  <li>پیگیری کلاس‌ها و گزارش عملکرد</li>
                </ul>
              </div>
              <button type="button" className="btn btn-primary staff-access-btn" onClick={onTeacherSelect}>
                ادامه به عنوان دبیر
              </button>
            </article>
          </div>

          <div className="staff-access-note card">
            <strong>راهنما:</strong>
            <span> اگر دانش‌آموز هستید، از صفحه اصلی گزینه «ورود به حساب دانش‌آموز» را انتخاب کنید.</span>
          </div>
        </div>
      </main>
    </div>
  )
}
