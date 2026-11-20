const items = [
  { title: 'میزبانی داخل کشور', desc: 'سرورها در ایران؛ بدون وابستگی به سرویس‌های خارجی و با پایداری بیشتر.' },
  { title: 'پشتیبان‌گیری روزانه', desc: 'نسخه پشتیبان خودکار از تمام داده‌های مدرسه به‌صورت روزانه تهیه می‌شود.' },
  { title: 'رمزنگاری اطلاعات', desc: 'ارتباط امن SSL و نگهداری امن گذرواژه‌ها با استانداردهای روز.' },
  { title: 'تفکیک داده‌ها', desc: 'اطلاعات هر مدرسه کاملاً جدا از مدارس دیگر نگهداری و مدیریت می‌شود.' },
  { title: 'دسترس‌پذیری بالا', desc: 'پایش دائمی سرویس و رسیدگی سریع به اختلال‌های احتمالی.' },
  { title: 'پشتیبانی انسانی', desc: 'پاسخ‌گویی مستقیم، بدون ربات و بدون صف انتظار طولانی.' },
]

export default function Security() {
  return (
    <section id="security" className="section alt">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">امنیت و زیرساخت</span>
          <h2>اطلاعات مدرسه، جدی گرفته می‌شود</h2>
          <p>زیرساخت و فرایندها طوری طراحی شده‌اند که اعتماد مدیر، معلم و خانواده حفظ شود.</p>
        </div>
        <div className="grid security-grid">
          {items.map((it) => (
            <article key={it.title} className="card security-card">
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
