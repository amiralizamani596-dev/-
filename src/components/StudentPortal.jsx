import { useEffect, useMemo, useRef, useState } from 'react'

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

const teacherCards = [
  { title: 'برنامه هفتگی', desc: 'مشاهده برنامه کلاس‌ها، زنگ‌ها و دروس تحت تدریس.', meta: '۴ کلاس امروز' },
  { title: 'ثبت حضور و غیاب', desc: 'ثبت حضور، غیبت و تأخیر دانش‌آموزان در هر جلسه.', meta: 'کلاس هشتم پویش' },
  { title: 'ثبت نمرات', desc: 'ثبت نمرات مستمر، آزمون‌ها و ارزیابی‌های کلاسی.', meta: '۸ مورد در انتظار' },
  { title: 'تکالیف و محتوا', desc: 'ارسال تکلیف، فایل آموزشی و پیگیری وضعیت تحویل.', meta: '۳ تکلیف فعال' },
  { title: 'ارتباط با اولیا و مدیر', desc: 'ارسال پیام و پیگیری موارد مهم آموزشی و انضباطی.', meta: '۲ پیام جدید' },
  { title: 'گزارش عملکرد کلاس', desc: 'بررسی پیشرفت تحصیلی و وضعیت کلی کلاس‌ها.', meta: 'میانگین: ۱۷.۹' },
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
  teacher: [
    { ...scheduleModal, title: 'مشاهده برنامه کلاسی', desc: 'برنامه کامل کلاس‌ها و زنگ‌های تدریس را مشاهده کنید.', action: 'بستن', done: 'برنامه کلاسی نمایش داده شد.' },
    { title: 'ثبت حضور و غیاب', desc: 'وضعیت حضور، غیبت یا تأخیر دانش‌آموزان کلاس را ثبت کنید.', action: 'ثبت', done: 'حضور و غیاب با موفقیت ثبت شد.', field: 'نام کلاس یا درس' },
    { title: 'ثبت نمره', desc: 'نمره یا نتیجه ارزیابی دانش‌آموزان را ثبت کنید.', action: 'ثبت نمره', done: 'نمره با موفقیت ثبت شد.', field: 'عنوان آزمون یا فعالیت' },
    { title: 'ارسال تکلیف یا پیام', desc: 'تکلیف جدید یا پیام آموزشی برای کلاس ارسال کنید.', action: 'ارسال', done: 'مورد شما با موفقیت ارسال شد.', field: 'متن تکلیف یا پیام' },
  ],
  admin: [
    { title: 'ثبت دانش‌آموز جدید', desc: 'اطلاعات دانش‌آموز جدید را وارد کنید.', action: 'ثبت', done: 'دانش‌آموز جدید با موفقیت ثبت شد.', field: 'نام دانش‌آموز' },
    { title: 'ایجاد اعلان مهم', desc: 'متن اعلان را برای ارسال به کاربران وارد کنید.', action: 'ارسال اعلان', done: 'اعلان مهم با موفقیت ارسال شد.', field: 'متن اعلان' },
    { title: 'بررسی گزارش هفتگی', desc: 'خلاصه گزارش هفتگی عملکرد و حضور آماده بررسی است.', action: 'مشاهده گزارش', done: 'گزارش هفتگی نمایش داده شد.' },
    { title: 'مدیریت نقش کاربران', desc: 'دسترسی و نقش کاربران سامانه را بررسی و به‌روزرسانی کنید.', action: 'ذخیره تغییرات', done: 'تنظیمات نقش کاربران به‌روزرسانی شد.' },
  ],
}

function HeroSlider({ role, onNotify, onNavigate }) {
  const slides = useMemo(() => {
    const roleLabel = role === 'admin' ? 'مدیر' : role === 'teacher' ? 'دبیر' : 'دانش‌آموز'
    const panelLabel = role === 'admin' ? 'پنل مدیریت' : role === 'teacher' ? 'پنل دبیر' : 'پنل دانش‌آموز'
    const overviewNotify = `${panelLabel} آماده استفاده است.`

    const slide2 =
      role === 'admin'
        ? {
            id: 2,
            tag: 'ویژه مدیر',
            title: 'کنترل کامل فرآیندها و گزارش‌گیری هوشمند',
            text: 'مدیر می‌تواند دانش‌آموزان، کلاس‌ها، اعلان‌ها و وضعیت تحصیلی را در یک داشبورد حرفه‌ای مدیریت کند.',
            primary: { label: 'رفتن به نمای کلی مدیریت', target: 'panel', notify: overviewNotify },
            secondary: { label: 'مشاهده امکانات مدیریتی', target: 'services', notify: 'امکانات مدیریتی نمایش داده شد.' },
            tone: 'tone-b',
          }
        : role === 'teacher'
          ? {
              id: 2,
              tag: 'ویژه دبیر',
              title: 'مدیریت کلاس، نمرات و تکالیف در یک پنل آموزشی',
              text: 'دبیر می‌تواند حضور و غیاب، نمرات، تکالیف و ارتباط آموزشی را به‌صورت سریع و منظم ثبت و پیگیری کند.',
              primary: { label: 'رفتن به نمای کلی کلاس‌ها', target: 'panel', notify: overviewNotify },
              secondary: { label: 'مشاهده ابزارهای تدریس', target: 'services', notify: 'ابزارهای تدریس نمایش داده شد.' },
              tone: 'tone-b',
            }
          : {
              id: 2,
              tag: 'ویژه دانش‌آموز',
              title: 'پیگیری پیشرفت تحصیلی با گزارش‌های شفاف',
              text: 'دانش‌آموز می‌تواند وضعیت دروس، حضور و غیاب، تکالیف و پیام‌های مدرسه را در هر زمان بررسی کند.',
              primary: { label: 'رفتن به نمای کلی وضعیت تحصیلی', target: 'panel', notify: overviewNotify },
              secondary: { label: 'مشاهده کارت‌های امکانات', target: 'services', notify: 'کارت‌های امکانات نمایش داده شد.' },
              tone: 'tone-b',
            }

    return [
      {
        id: 1,
        tag: 'مدیریت یکپارچه',
        title: `همه امور مدرسه ${roleLabel} در یک پنل مدرن`,
        text: 'ابزارها و اطلاعات مهم روزانه را به‌صورت ساده، سریع و یکپارچه در دسترس داشته باشید.',
        primary: { label: 'رفتن به بخش امکانات', target: 'services', notify: 'بخش امکانات سامانه نمایش داده شد.' },
        secondary: { label: 'رفتن به پنل کاربری', target: 'panel', notify: `${panelLabel} نمایش داده شد.` },
        tone: 'tone-a',
      },
      slide2,
      {
        id: 3,
        tag: 'ارتباط سریع',
        title: 'ارتباط مؤثر بین دانش‌آموز، دبیر، مدیر و خانواده',
        text: 'با اعلان‌های به‌موقع و رابط کاربری حرفه‌ای، جریان آموزشی و اطلاع‌رسانی روان‌تر انجام می‌شود.',
        primary: { label: 'رفتن به دسترسی‌های سریع', target: 'panel', notify: 'بخش دسترسی‌های سریع نمایش داده شد.' },
        secondary: { label: 'رفتن به بخش پشتیبانی', target: 'portal-contact', notify: 'بخش پشتیبانی نمایش داده شد.' },
        tone: 'tone-c',
      },
    ]
  }, [role])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500)
    return () => clearInterval(timer)
  }, [slides.length])

  const goSlide = (dir) => setIndex((i) => (i + dir + slides.length) % slides.length)
  const current = slides[index]

  return (
    <section className="portal-hero">
      <div className="container">
        <div className={`portal-hero-slide ${current.tone}`}>
          <div className="portal-hero-content">
            <span className="portal-badge">{current.tag}</span>
            <h1>{current.title}</h1>
            <p>{current.text}</p>
            <div className="portal-hero-actions">
              <button className="btn btn-primary" type="button" onClick={() => { onNavigate?.(current.primary.target); onNotify?.(current.primary.notify) }} title={current.primary.notify}>
                {current.primary.label}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => { onNavigate?.(current.secondary.target); onNotify?.(current.secondary.notify) }} title={current.secondary.notify}>
                {current.secondary.label}
              </button>
            </div>
            <div className="portal-hero-meta">
              <div><strong>+۲۴</strong><span>امکان آموزشی</span></div>
              <div><strong>۳ نقش</strong><span>دانش‌آموز، دبیر و مدیر</span></div>
              <div><strong>۷/۲۴</strong><span>دسترسی آنلاین</span></div>
            </div>
          </div>
          <div className="portal-hero-visual" aria-hidden="true">
            <div className="portal-orb o1" />
            <div className="portal-orb o2" />
            <div className="portal-glass main">
              <h3>داشبورد امروز</h3>
              <ul>
                <li><span>کلاس‌های امروز</span><b>۴ جلسه</b></li>
                <li><span>اقدامات فعال</span><b>۳ مورد</b></li>
                <li><span>اعلان جدید</span><b>۲ پیام</b></li>
              </ul>
            </div>
            <div className="portal-glass mini"><p>وضعیت کلی</p><strong>پایدار و به‌روز</strong></div>
          </div>
        </div>
        <div className="portal-slider-controls">
          <button type="button" onClick={() => goSlide(-1)} aria-label="اسلاید قبلی">‹</button>
          <div className="portal-dots" role="tablist" aria-label="اسلایدها">
            {slides.map((s, i) => (
              <button key={s.id} type="button" className={`portal-dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} aria-label={`اسلاید ${i + 1}`} aria-selected={i === index} />
            ))}
          </div>
          <button type="button" onClick={() => goSlide(1)} aria-label="اسلاید بعدی">›</button>
        </div>
      </div>
    </section>
  )
}

export default function StudentPortal({ onBack, mode = 'student' }) {
  const role = mode === 'admin' ? 'admin' : mode === 'teacher' ? 'teacher' : 'student'
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const toastTimer = useRef(null)

  const isAdmin = role === 'admin'
  const isTeacher = role === 'teacher'
  const cards = isAdmin ? adminCards : isTeacher ? teacherCards : studentCards
  const actions = isAdmin ? quickActions.admin : isTeacher ? quickActions.teacher : quickActions.student
  const headerSmall = isAdmin ? 'پنل مدیریت' : isTeacher ? 'پنل دبیر' : 'حساب دانش‌آموز'
  const panelEyebrow = isAdmin ? 'پنل مدیر' : isTeacher ? 'پنل دبیر' : 'پنل دانش‌آموز'
  const panelTitle = isAdmin ? 'نمای کلی مدیریت' : isTeacher ? 'نمای کلی کلاس‌ها و تدریس' : 'نمای کلی وضعیت تحصیلی'
  const panelDesc = isAdmin
    ? 'خلاصه‌ای از مهم‌ترین اطلاعات مدیریتی برای تصمیم‌گیری سریع.'
    : isTeacher
      ? 'خلاصه‌ای از وضعیت کلاس‌ها، نمرات و فعالیت‌های آموزشی امروز.'
      : 'خلاصه‌ای از مهم‌ترین اطلاعات تحصیلی برای پیگیری سریع.'
  const sectionDesc = isAdmin
    ? 'مجموعه‌ای از ابزارهای کاربردی برای مدیر مدرسه با طراحی مدرن و دسترسی سریع.'
    : isTeacher
      ? 'مجموعه‌ای از ابزارهای کاربردی برای دبیر جهت مدیریت کلاس، نمرات و تکالیف.'
      : 'مجموعه‌ای از ابزارهای کاربردی برای دانش‌آموز با طراحی مدرن و دسترسی سریع.'
  const stats = isAdmin
    ? [['دانش‌آموزان فعال', '۳۲۰'], ['کلاس‌های امروز', '۱۸'], ['اعلان‌های ارسال‌شده', '۲۷'], ['درخواست‌های بررسی', '۸']]
    : isTeacher
      ? [['کلاس‌های امروز', '۴'], ['دانش‌آموزان تحت آموزش', '۹۶'], ['تکالیف بررسی‌نشده', '۷'], ['پیام‌های جدید', '۳']]
      : [['میانگین نمرات', '۱۸.۴'], ['تکالیف باز', '۳'], ['جلسات امروز', '۴'], ['پیام‌های جدید', '۲']]

  const notify = (message) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }

  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openModal = (item) => { setModal(item); setInputValue('') }
  const closeModal = () => { setModal(null); setInputValue('') }
  const confirmModal = () => {
    if (modal?.field && !inputValue.trim()) { notify('لطفاً اطلاعات مورد نیاز را وارد کنید.'); return }
    notify(modal?.done || 'عملیات با موفقیت انجام شد.')
    closeModal()
  }

  useEffect(() => {
    if (!modal) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [modal])

  return (
    <div className="portal">
      <header className="portal-header site-header">
        <div className="container nav-wrap">
          <button type="button" className="brand portal-brand" onClick={onBack} aria-label="بازگشت به صفحه اصلی">
            <span className="brand-mark" aria-hidden="true">م</span>
            <span className="brand-text">
              <strong>مدرسه‌یار</strong>
              <small>{headerSmall}</small>
            </span>
          </button>
          <div className="portal-header-actions">
            <span className="eyebrow" style={{ margin: 0 }}>{panelEyebrow}</span>
            <button type="button" className="btn btn-secondary" onClick={onBack} title="خروج از حساب و بازگشت به صفحه اصلی سایت" aria-label="خروج از حساب و بازگشت به سایت">خروج از حساب</button>
          </div>
        </div>
      </header>

      <main id="portal-main">
        <HeroSlider key={role} role={role} onNotify={notify} onNavigate={scrollToId} />

        <section id="services" className="section portal-section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">امکانات سامانه</span>
              <h2>مدیریت هوشمند امور مدرسه</h2>
              <p>{sectionDesc}</p>
            </div>
            <div className="grid portal-cards-grid">
              {cards.map((card) => (
                <article key={card.title} className="card portal-info-card">
                  <div className="portal-info-top">
                    <h3>{card.title}</h3>
                    <span>{card.meta}</span>
                  </div>
                  <p>{card.desc}</p>
                  <button type="button" className="portal-card-btn" onClick={() => openModal(card.title === 'برنامه هفتگی' ? scheduleModal : { title: card.title, desc: card.desc, action: 'بستن', done: `بخش «${card.title}» باز شد.` })} title={`نمایش جزئیات «${card.title}»`} aria-label={`مشاهده جزئیات ${card.title}`}>
                    مشاهده جزئیات
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="panel" className="section alt portal-section">
          <div className="container portal-panel-grid">
            <div className="card portal-panel-main">
              <div className="section-head" style={{ marginBottom: '1rem' }}>
                <span className="eyebrow">{panelEyebrow}</span>
                <h2 style={{ fontSize: '1.5rem' }}>{panelTitle}</h2>
                <p>{panelDesc}</p>
              </div>
              <div className="portal-stats-grid">
                {stats.map(([label, value]) => (
                  <div key={label} className="portal-stat-card">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <aside className="card portal-panel-side">
              <h3>دسترسی سریع</h3>
              <ul className="portal-quick-list">
                {actions.map((item) => (
                  <li key={item.title}>
                    <button type="button" className="portal-quick-item" onClick={() => openModal(item)} title={`اجرای/نمایش «${item.title}»`} aria-label={item.title}>
                      <span>{item.title}</span>
                      <span className="portal-quick-arrow" aria-hidden="true">‹</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary" type="button" style={{ width: '100%' }} onClick={() => { scrollToId('portal-contact'); notify('بخش پشتیبانی آماده پاسخ‌گویی است.') }} title="اسکرول به بخش پشتیبانی و نمایش اطلاعات تماس" aria-label="درخواست پشتیبانی - انتقال به بخش پشتیبانی">
                درخواست پشتیبانی
              </button>
            </aside>
          </div>
        </section>

        <section id="portal-contact" className="section portal-section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">بخش پشتیبانی</span>
              <h2>پشتیبانی سامانه</h2>
              <p>برای راهنمایی، گزارش مشکل یا دریافت پشتیبانی می‌توانید از راه‌های زیر در تماس باشید.</p>
            </div>
            <div className="portal-support-card">
              <div className="portal-support-profile">
                <div className="portal-support-avatar" aria-hidden="true">ا</div>
                <div>
                  <span className="portal-support-label">مسئول پشتیبانی</span>
                  <h3>امیر علی زمانی</h3>
                  <p>پاسخ‌گویی به سوالات و پیگیری امور مربوط به سامانه مدیریت مدرسه</p>
                </div>
              </div>
              <div className="portal-contact-actions">
                <a className="portal-contact-pill" href="mailto:amiralizamani596@gmail.com">ایمیل: amiralizamani596@gmail.com</a>
                <a className="portal-contact-pill" href="tel:09399080218">پشتیبانی: ۰۹۳۹۹۰۸۰۲۱۸</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {toast && <div className="portal-toast" role="status" aria-live="polite">{toast}</div>}

      {modal && (
        <div className="portal-modal-backdrop" onClick={closeModal} role="presentation">
          <div
            className={`portal-modal ${modal.schedule ? 'portal-modal-schedule' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={modal.title}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{modal.title}</h3>
            <p>{modal.desc}</p>
            {modal.schedule && (
              <div className="portal-schedule-list" role="table" aria-label="برنامه هفتگی">
                {modal.schedule.map((row) => (
                  <div key={row.day} className="portal-schedule-col" role="column">
                    <strong className="portal-schedule-day">{row.day}</strong>
                    <div className="portal-schedule-items">
                      {row.items.map((item, i) => (
                        <div
                          key={i}
                          className={`portal-schedule-item ${item === 'کلاسی ندارید' ? 'is-off' : ''}`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {modal.field && (
              <label className="portal-modal-field">
                <span>{modal.field}</span>
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={modal.field} />
              </label>
            )}
            <div className="portal-modal-actions">
              <button type="button" className="btn btn-primary" onClick={confirmModal} title={modal.field ? 'ثبت اطلاعات واردشده و بستن' : 'تأیید و بستن این پنجره'}>{modal.action}</button>
              <button type="button" className="btn btn-secondary" onClick={closeModal} title="بستن بدون اعمال تغییرات">انصراف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
