import { useState } from 'react'

const studentCards = [
  { title: 'برنامه هفتگی', desc: 'مشاهده کلاس‌ها، ساعات برگزاری و معلمان هر درس.', meta: '۴ کلاس امروز' },
  { title: 'تکالیف و پروژه‌ها', desc: 'پیگیری تکالیف در حال انجام، موعد تحویل و وضعیت ارسال.', meta: '۳ تکلیف فعال' },
  { title: 'کارنامه و نمرات', desc: 'دسترسی سریع به نمرات آزمون‌ها و روند پیشرفت تحصیلی.', meta: 'میانگین: ۱۸.۴' },
  { title: 'حضور و غیاب', desc: 'بررسی وضعیت حضور، تأخیرها و گزارش‌های ماهانه.', meta: 'حضور: ۹۶٪' },
  { title: 'اعلان‌ها و پیام‌ها', desc: 'دریافت اطلاعیه‌های مدرسه و پیام‌های مرتبط با دروس.', meta: '۲ پیام جدید' },
  { title: 'تقویم آموزشی', desc: 'مشاهده رویدادها، امتحانات و برنامه‌های مهم مدرسه.', meta: '۵ رویداد پیش رو' },
]

const adminCards = [
  { title: 'مدیریت دانش‌آموزان', desc: 'ثبت، ویرایش و مشاهده پرونده تحصیلی دانش‌آموزان.', meta: '۳۲۰ دانش‌آموز' },
  { title: 'مدیریت کلاس‌ها', desc: 'برنامه‌ریزی کلاس‌ها، دروس و تخصیص معلمان.', meta: '۱۸ کلاس فعال' },
  { title: 'گزارش‌گیری عملکرد', desc: 'تهیه گزارش‌های تحصیلی، حضور و وضعیت عمومی.', meta: '۱۲ گزارش آماده' },
  { title: 'ارسال اعلان', desc: 'اطلاع‌رسانی سریع به دانش‌آموزان و گروه‌های مختلف.', meta: 'ارسال گروهی' },
  { title: 'کنترل نمرات', desc: 'بازبینی و تأیید نمرات ثبت‌شده توسط معلمان.', meta: '۸ مورد در انتظار' },
  { title: 'تنظیمات سامانه', desc: 'مدیریت دسترسی‌ها، نقش‌ها و پیکربندی وبسایت مدرسه.', meta: 'دسترسی کامل' },
]

const weeklySchedule = [
  { day: 'شنبه', items: ['زنگ اول: فیزیک', 'زنگ دوم: تربیت بدنی', 'زنگ سوم: تفکر و سبک زندگی'] },
  { day: 'یکشنبه', items: ['زنگ اول: ادبیات فارسی', 'زنگ دوم: مطالعات اجتماعی', 'زنگ سوم: شیمی', 'زنگ چهارم: زبان انگلیسی'] },
  { day: 'دوشنبه', items: ['زنگ اول: ریاضی', 'زنگ دوم: قرآن', 'زنگ سوم: ریاضی', 'زنگ چهارم: عربی'] },
  { day: 'سه‌شنبه', items: ['زنگ اول: ادبیات فارسی', 'زنگ دوم: کار و فناوری', 'زنگ سوم: مطالعات اجتماعی/نگارش', 'زنگ چهارم: دینی'] },
  { day: 'چهارشنبه', items: ['زنگ اول: فرهنگ و هنر', 'زنگ دوم: ریاضی', 'زنگ سوم: زیست'] },
  { day: 'پنجشنبه', items: ['کلاسی ندارید'] },
  { day: 'جمعه', items: ['کلاسی ندارید'] },
]

const scheduleModal = {
  title: 'برنامه کلاسی هفتگی',
  desc: 'برنامه کلاس‌های هفتگی به شرح زیر است:',
  schedule: weeklySchedule,
  action: 'بستن',
  done: 'برنامه کلاسی نمایش داده شد.',
}

const quickActions = {
  student: [
    { ...scheduleModal, title: 'مشاهده برنامه کلاسی', desc: 'برنامه کامل کلاس‌های هفته را مشاهده کنید.', action: 'بستن', done: 'برنامه کلاسی نمایش داده شد.' },
    { title: 'ارسال تکلیف', desc: 'می‌توانید تکلیف خود را انتخاب و برای بررسی ارسال کنید.', action: 'ارسال', done: 'تکلیف با موفقیت ارسال شد.', field: 'عنوان تکلیف' },
    { title: 'مشاهده آخرین نمرات', desc: 'آخرین نمرات ثبت‌شده در کارنامه شما آماده مشاهده است.', action: 'مشاهده', done: 'آخرین نمرات نمایش داده شد.' },
    { title: 'ارتباط با مدرسه', desc: 'پیام خود را برای مدرسه ثبت کنید تا در اسرع وقت پاسخ داده شود.', action: 'ثبت پیام', done: 'پیام شما برای مدرسه ثبت شد.', field: 'متن پیام' },
  ],
  admin: [
    { title: 'ثبت دانش‌آموز جدید', desc: 'اطلاعات دانش‌آموز جدید را وارد کنید.', action: 'ثبت', done: 'دانش‌آموز جدید با موفقیت ثبت شد.', field: 'نام دانش‌آموز' },
    { title: 'ایجاد اعلان مهم', desc: 'متن اعلان را برای ارسال به کاربران وارد کنید.', action: 'ارسال اعلان', done: 'اعلان مهم با موفقیت ارسال شد.', field: 'متن اعلان' },
    { title: 'بررسی گزارش هفتگی', desc: 'خلاصه گزارش هفتگی عملکرد و حضور آماده بررسی است.', action: 'مشاهده گزارش', done: 'گزارش هفتگی نمایش داده شد.' },
    { title: 'مدیریت نقش کاربران', desc: 'دسترسی و نقش کاربران سامانه را بررسی و به‌روزرسانی کنید.', action: 'ذخیره تغییرات', done: 'تنظیمات نقش کاربران به‌روزرسانی شد.' },
  ],
}

export default function Dashboard({ role, onNotify, onNavigate }) {
  const isAdmin = role === 'admin'
  const cards = isAdmin ? adminCards : studentCards
  const actions = isAdmin ? quickActions.admin : quickActions.student
  const [modal, setModal] = useState(null)
  const [inputValue, setInputValue] = useState('')

  const openModal = (item) => {
    setModal(item)
    setInputValue('')
  }

  const closeModal = () => {
    setModal(null)
    setInputValue('')
  }

  const confirmModal = () => {
    if (modal?.field && !inputValue.trim()) {
      onNotify?.('لطفاً اطلاعات مورد نیاز را وارد کنید.')
      return
    }
    onNotify?.(modal?.done || 'عملیات با موفقیت انجام شد.')
    closeModal()
  }

  const handleSupport = (e) => {
    e.preventDefault()
    onNavigate?.('contact')
    onNotify?.('بخش پشتیبانی آماده پاسخ‌گویی است.')
  }

  return (
    <>
      <section id="services" className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="badge">امکانات سامانه</span>
              <h2>مدیریت هوشمند امور مدرسه</h2>
              <p>
                مجموعه‌ای از ابزارهای کاربردی برای {isAdmin ? 'مدیر وبسایت' : 'دانش‌آموز'} با طراحی مدرن و دسترسی سریع.
              </p>
            </div>
          </div>
          <div className="grid cards-grid">
            {cards.map((card) => (
              <article key={card.title} className="info-card">
                <div className="info-card-top">
                  <h3>{card.title}</h3>
                  <span>{card.meta}</span>
                </div>
                <p>{card.desc}</p>
                <div className="card-actions">
                  <button
                    type="button"
                    className="card-btn"
                    onClick={() =>
                      openModal(
                        card.title === 'برنامه هفتگی'
                          ? scheduleModal
                          : { title: card.title, desc: card.desc, action: 'بستن', done: `بخش «${card.title}» باز شد.` },
                      )
                    }
                  >
                    مشاهده جزئیات
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="panel" className="section alt">
        <div className="container panel-grid">
          <div className="panel-main">
            <div className="section-header compact">
              <div>
                <span className="badge">{isAdmin ? 'پنل مدیر' : 'پنل دانش‌آموز'}</span>
                <h2>{isAdmin ? 'نمای کلی مدیریت' : 'نمای کلی وضعیت تحصیلی'}</h2>
                <p>خلاصه‌ای از مهم‌ترین اطلاعات برای تصمیم‌گیری سریع.</p>
              </div>
            </div>
            <div className="stats-grid">
              {(isAdmin
                ? [
                    ['دانش‌آموزان فعال', '۳۲۰'],
                    ['کلاس‌های امروز', '۱۸'],
                    ['اعلان‌های ارسال‌شده', '۲۷'],
                    ['درخواست‌های بررسی', '۸'],
                  ]
                : [
                    ['میانگین نمرات', '۱۸.۴'],
                    ['تکالیف باز', '۳'],
                    ['جلسات امروز', '۴'],
                    ['پیام‌های جدید', '۲'],
                  ]
              ).map(([label, value]) => (
                <div key={label} className="stat-card">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>

          <aside className="panel-side">
            <h3>دسترسی سریع</h3>
            <ul className="quick-list">
              {actions.map((item) => (
                <li key={item.title}>
                  <button type="button" className="quick-item" onClick={() => openModal(item)}>
                    <span>{item.title}</span>
                    <span className="quick-arrow" aria-hidden="true">‹</span>
                  </button>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary full" type="button" onClick={handleSupport}>
              درخواست پشتیبانی
            </button>
          </aside>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="badge">بخش پشتیبانی</span>
              <h2>پشتیبانی سامانه</h2>
              <p>برای راهنمایی، گزارش مشکل یا دریافت پشتیبانی می‌توانید از راه‌های زیر در تماس باشید.</p>
            </div>
          </div>
          <div className="contact-card support-card">
            <div className="support-profile">
              <div className="support-avatar" aria-hidden="true">ا</div>
              <div>
                <span className="support-label">مسئول پشتیبانی</span>
                <h3>امیر علی زمانی</h3>
                <p>پاسخ‌گویی به سوالات و پیگیری امور مربوط به سامانه مدیریت مدرسه</p>
              </div>
            </div>
            <div className="contact-actions">
              <a className="contact-pill contact-link" href="mailto:amiralizamani596@gmail.com">
                ایمیل: amiralizamani596@gmail.com
              </a>
              <a className="contact-pill contact-link" href="tel:09399080218">
                پشتیبانی: ۰۹۳۹۹۰۸۰۲۱۸
              </a>
            </div>
          </div>
        </div>
      </section>

      {modal && (
        <div className="modal-backdrop" onClick={closeModal} role="presentation">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={modal.title}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{modal.title}</h3>
            <p>{modal.desc}</p>
            {modal.schedule && (
              <div className="schedule-list">
                {modal.schedule.map((row) => (
                  <div key={row.day} className="schedule-row">
                    <strong className="schedule-day">{row.day}</strong>
                    <div className="schedule-items">
                      {row.items.map((item, i) => (
                        <div key={i} className="schedule-item">{item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {modal.field && (
              <label className="modal-field">
                <span>{modal.field}</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={modal.field}
                />
              </label>
            )}
            <div className="modal-actions">
              <button type="button" className="btn btn-primary" onClick={confirmModal}>
                {modal.action}
              </button>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
