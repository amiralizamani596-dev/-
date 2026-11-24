import { useRef, useState } from 'react'

const roles = [
  {
    id: 'manager',
    label: 'مدیر مدرسه',
    title: 'کنترل کامل مدرسه از یک پیشخوان',
    desc: 'از ثبت‌نام تا گزارش‌های پایان ترم، همه چیز زیر نظر مدیر و با دسترسی یکپارچه مدیریت می‌شود.',
    items: ['تعریف کلاس، پایه و رشته', 'ثبت‌نام و مدیریت دانش‌آموزان', 'مدیریت معلمان و دسترسی‌ها', 'گزارش حضور و غیاب مدرسه', 'انتشار اطلاعیه و پیام', 'مشاهده کارنامه همه کلاس‌ها'],
  },
  {
    id: 'teacher',
    label: 'معلم',
    title: 'تمرکز روی تدریس، نه کار اداری',
    desc: 'معلم حضور و غیاب، نمرات و تکالیف را سریع ثبت می‌کند و زمان بیشتری برای کلاس می‌ماند.',
    items: ['ثبت حضور، غیبت و تأخیر سر کلاس', 'ثبت نمرات مستمر و پایانی', 'ارسال تکلیف و محتوای درسی', 'مشاهده برنامه هفتگی', 'ارتباط با مدیر و اولیا', 'گزارش عملکرد کلاس'],
  },
  {
    id: 'student',
    label: 'دانش‌آموز',
    title: 'همه چیز در دسترس، همیشه',
    desc: 'دانش‌آموز برنامه، تکالیف، نمرات و اعلان‌ها را در هر زمان مشاهده و پیگیری می‌کند.',
    items: ['مشاهده برنامه کلاسی و آزمون‌ها', 'پیگیری تکالیف و وضعیت ارسال', 'دسترسی به کارنامه و نمرات', 'مشاهده حضور و غیاب', 'دریافت اطلاعیه‌های مدرسه', 'دسترسی به محتوای درسی'],
  },
  {
    id: 'parent',
    label: 'اولیا',
    title: 'باخبر از مدرسه، بدون تماس تلفنی',
    desc: 'وضعیت تحصیلی و انضباطی فرزند همان لحظه در اختیار خانواده قرار می‌گیرد.',
    items: ['اعلان فوری غیبت و تأخیر', 'مشاهده نمرات و کارنامه', 'دریافت اطلاعیه‌های مدرسه', 'مشاهده برنامه و تقویم آموزشی', 'ارتباط مستقیم با مدرسه', 'پیگیری روند پیشرفت تحصیلی'],
  },
]

export default function Roles() {
  const [active, setActive] = useState(roles[0].id)
  const tabRefs = useRef([])
  const current = roles.find((r) => r.id === active) || roles[0]
  const activeIndex = Math.max(0, roles.findIndex((r) => r.id === active))

  const activateByIndex = (index) => {
    const next = roles[index]
    if (!next) return
    setActive(next.id)
    tabRefs.current[index]?.focus()
  }

  const onTabKeyDown = (e, index) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      const nextIndex = (index + dir + roles.length) % roles.length
      activateByIndex(nextIndex)
      return
    }
    if (e.key === 'Home') {
      e.preventDefault()
      activateByIndex(0)
      return
    }
    if (e.key === 'End') {
      e.preventDefault()
      activateByIndex(roles.length - 1)
    }
  }

  return (
    <section id="roles" className="section alt">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">نقش‌ها</span>
          <h2>چهار نقش، چهار نمای متفاوت</h2>
          <p>هرکس فقط چیزی را می‌بیند که به او مربوط است. نقش موردنظر را انتخاب کنید.</p>
        </div>

        <div className="roles-wrap card">
          <div className="roles-tabs" role="tablist" aria-label="نقش‌های سامانه">
            {roles.map((r, i) => (
              <button
                key={r.id}
                ref={(el) => { tabRefs.current[i] = el }}
                type="button"
                role="tab"
                id={`role-tab-${r.id}`}
                aria-controls="role-panel"
                aria-selected={active === r.id}
                tabIndex={i === activeIndex ? 0 : -1}
                className={`role-tab ${active === r.id ? 'active' : ''}`}
                onClick={() => setActive(r.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div id="role-panel" className="roles-panel" role="tabpanel" aria-labelledby={`role-tab-${active}`}>
            <div className="roles-info">
              <h3>{current.title}</h3>
              <p>{current.desc}</p>
              <a href="#contact" className="btn btn-primary roles-cta" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }} title="اسکرول به بخش تماس برای مشاوره درباره این نقش" aria-label="درخواست مشاوره - انتقال به بخش تماس">
                درخواست مشاوره
              </a>
            </div>
            <ul className="roles-list">
              {current.items.map((item) => (
                <li key={item}><span className="check" aria-hidden="true">✓</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
