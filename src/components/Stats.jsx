const stats = [
  { value: '۲۰,۱۷۵+', label: 'دانش‌آموز ثبت‌شده', sub: 'در پرونده‌های فعال' },
  { value: '۲,۴۷۰+', label: 'معلم فعال', sub: 'در حال ثبت روزانه' },
  { value: '۲۰+', label: 'مدرسه', sub: 'در سراسر کشور' },
  { value: '۹۸٪', label: 'رضایت مدیران', sub: 'بر پایه بازخوردها' },
]

export default function Stats() {
  return (
    <section className="stats-strip" aria-label="آمار سامانه">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
              <small>{s.sub}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
