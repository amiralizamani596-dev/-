import { useState } from 'react'

const faqs = [
  { q: 'برای شروع کار چه چیزی لازم است؟', a: 'برای آغاز، اطلاعات پایه مدرسه و نقش‌ها (مدیر، معلم، دانش‌آموز و اولیا) تعریف می‌شود. پس از راه‌اندازی اولیه، کاربران می‌توانند بر اساس دسترسی خود از سامانه استفاده کنند.' },
  { q: 'این سامانه برای چه نقش‌هایی مناسب است؟', a: 'مدرسه‌یار برای مدیر، معلم، دانش‌آموز و اولیا طراحی شده است و هر نقش نمای اختصاصی خود را با دسترسی مناسب مشاهده می‌کند.' },
  { q: 'اطلاعات مدرسه چگونه نگهداری می‌شود؟', a: 'داده‌ها با در نظر گرفتن امنیت و تفکیک دسترسی نگهداری می‌شوند و برای هر نقش فقط اطلاعات مرتبط قابل مشاهده است. فرایندهای پشتیبان‌گیری و پایش نیز برای پایداری در نظر گرفته می‌شود.' },
  { q: 'اگر وسط سال تحصیلی شروع کنیم مشکلی پیش می‌آید؟', a: 'خیر. می‌توانید در هر زمان از سال تحصیلی شروع کنید؛ اطلاعات جاری را وارد کنید و از همان نقطه فرآیندها را دیجیتال ادامه دهید.' },
  { q: 'امکان گزارش‌گیری و پیگیری وضعیت وجود دارد؟', a: 'بله. حضور و غیاب، نمرات، روند تحصیلی و وضعیت کلاس‌ها به‌صورت قابل پیگیری و گزارش‌پذیر در سامانه در دسترس است.' },
  { q: 'پشتیبانی چگونه است؟', a: 'پشتیبانی به‌صورت انسانی و مستقیم انجام می‌شود. در ساعات کاری می‌توانید از طریق تلفن یا ایمیل با ما در ارتباط باشید.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="section">
      <div className="container faq-grid">
        <div>
          <div className="section-head">
            <span className="eyebrow">پرسش‌های پرتکرار</span>
            <h2>پاسخ سوال‌های رایج</h2>
            <p>اگر پاسخ خود را پیدا نکردید، می‌توانید مستقیماً با ما تماس بگیرید.</p>
          </div>
          <div className="faq-contact card">
            <h3>پاسخ نگرفتید؟</h3>
            <p>در ساعات کاری پاسخ‌گو هستیم؛ آماده گفت‌وگو و راهنمایی.</p>
            <a href="tel:09399080218" className="faq-link">۰۹۳۹۹۰۸۰۲۱۸</a>
            <a href="mailto:amiralizamani596@gmail.com" className="faq-link">amiralizamani596@gmail.com</a>
            <span className="muted">شنبه تا چهارشنبه، ۹ تا ۱۷</span>
          </div>
        </div>

        <div className="faq-list">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className={`faq-item card ${isOpen ? 'open' : ''}`}>
                <button type="button" className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span>{f.q}</span>
                  <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <div className="faq-a"><p>{f.a}</p></div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
