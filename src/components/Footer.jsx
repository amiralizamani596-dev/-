const year = new Date().getFullYear()

export default function Footer() {
  const go = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="contact" className="site-footer">
      <div className="container footer-cta card">
        <div>
          <span className="eyebrow">در ارتباط باشید</span>
          <h2>مدرسه‌تان را امروز هوشمندتر کنید</h2>
          <p>برای آشنایی بیشتر، دریافت مشاوره یا راه‌اندازی سامانه، با ما در تماس باشید.</p>
        </div>
        <div className="footer-cta-actions">
          <a href="tel:09399080218" className="btn btn-primary">تماس: ۰۹۳۹۹۰۸۰۲۱۸</a>
          <a href="mailto:amiralizamani596@gmail.com" className="btn btn-secondary">amiralizamani596@gmail.com</a>
        </div>
      </div>

      <div className="container footer-main">
        <div className="footer-brand">
          <div className="brand footer-brand-mark">
            <span className="brand-mark" aria-hidden="true">م</span>
            <span className="brand-text"><strong>مدرسه‌یار</strong><small>سامانه هوشمند مدیریت مدرسه</small></span>
          </div>
          <p>سامانه مدیریت مدرسه و اطلاع‌رسانی به اولیا؛ حضور و غیاب، نمرات، کارنامه و ارتباط با خانواده در یک بستر یکپارچه و امن.</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>بخش‌ها</h4>
            <a href="#features" onClick={(e) => go(e, 'features')}>امکانات</a>
            <a href="#roles" onClick={(e) => go(e, 'roles')}>نقش‌ها</a>
            <a href="#steps" onClick={(e) => go(e, 'steps')}>راه‌اندازی</a>
            <a href="#security" onClick={(e) => go(e, 'security')}>امنیت</a>
          </div>
          <div className="footer-col">
            <h4>دسترسی</h4>
            <a href="#faq" onClick={(e) => go(e, 'faq')}>پرسش‌های پرتکرار</a>
            <a href="#guides" onClick={(e) => go(e, 'guides')}>راهنما</a>
            <a href="#home" onClick={(e) => go(e, 'home')} title="اسکرول به ابتدای صفحه">بازگشت به بالا</a>
          </div>
          <div className="footer-col">
            <h4>تماس</h4>
            <a href="tel:09399080218">۰۹۳۹۹۰۸۰۲۱۸</a>
            <a href="mailto:amiralizamani596@gmail.com">amiralizamani596@gmail.com</a>
            <span className="muted">شنبه تا چهارشنبه، ۹ تا ۱۷</span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {year} مدرسه‌یار — تمامی حقوق محفوظ است.</p>
        <p className="muted">ساخته‌شده برای مدرسه‌های ایران</p>
      </div>
    </footer>
  )
}
