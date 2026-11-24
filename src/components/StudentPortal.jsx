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

const studentHomeworkSeed = [
  { id: 'hw-1', title: 'حل تمرین‌های فصل ۳', subject: 'ریاضی', due: '۱۴۰۵/۰۹/۰۳', status: 'pending', teacher: 'خانم کریمی', note: 'تمرین‌های ۱ تا ۱۰ در دفتر نوشته شود.' },
  { id: 'hw-2', title: 'گزارش آزمایش حرکت', subject: 'فیزیک', due: '۱۴۰۵/۰۹/۰۵', status: 'submitted', teacher: 'آقای مرادی', note: 'فایل گزارش در کلاس ارائه می‌شود.' },
  { id: 'hw-3', title: 'خلاصه‌نویسی درس ۴', subject: 'ادبیات فارسی', due: '۱۴۰۵/۰۹/۰۲', status: 'late', teacher: 'خانم احمدی', note: 'خلاصه حداقل یک صفحه باشد.' },
  { id: 'hw-4', title: 'پرسش‌های کتبی درس ۵', subject: 'مطالعات اجتماعی', due: '۱۴۰۵/۰۹/۰۷', status: 'pending', teacher: 'آقای حسینی', note: 'پاسخ‌ها کامل و خوانا نوشته شود.' },
]

const studentGradesSeed = [
  { id: 'gr-1', subject: 'ریاضی', assessment: 'آزمون فصل ۲', date: '۱۴۰۵/۰۸/۲۰', score: 19, outOf: 20, status: 'عالی' },
  { id: 'gr-2', assessment: 'کوییز درس ۳', subject: 'فیزیک', date: '۱۴۰۵/۰۸/۲۵', score: 17, outOf: 20, status: 'خوب' },
  { id: 'gr-3', assessment: 'املا و نگارش', subject: 'ادبیات فارسی', date: '۱۴۰۵/۰۸/۱۸', score: 18.5, outOf: 20, status: 'عالی' },
  { id: 'gr-4', assessment: 'آزمون میان‌ترم', subject: 'شیمی', date: '۱۴۰۵/۰۸/۲۸', score: 16, outOf: 20, status: 'قابل قبول' },
]

const studentMessagesSeed = [
  { id: 'msg-1', title: 'یادآوری آزمون ریاضی', from: 'خانم کریمی (ریاضی)', date: '۱۴۰۵/۰۸/۳۰', body: 'آزمون فصل ۳ روز دوشنبه برگزار می‌شود. تمرین‌های پایان فصل را مرور کنید.', read: false },
  { id: 'msg-2', title: 'برنامه کلاس جبرانی', from: 'معاون آموزشی', date: '۱۴۰۵/۰۸/۲۹', body: 'کلاس جبرانی فیزیک روز چهارشنبه ساعت سوم در آزمایشگاه برگزار می‌شود.', read: false },
  { id: 'msg-3', title: 'تأیید دریافت تکلیف', from: 'آقای مرادی (فیزیک)', date: '۱۴۰۵/۰۸/۲۷', body: 'گزارش آزمایش شما دریافت شد. نتیجه بررسی به‌زودی اعلام می‌شود.', read: true },
]

const teacherAttendanceSeed = [
  { id: 'att-1', name: 'علی رضایی', status: 'present' },
  { id: 'att-2', name: 'مریم کاظمی', status: 'present' },
  { id: 'att-3', name: 'سینا احمدی', status: 'late' },
  { id: 'att-4', name: 'نگار حسینی', status: 'absent' },
  { id: 'att-5', name: 'پارسا محمدی', status: 'present' },
  { id: 'att-6', name: 'الهام کریمی', status: 'present' },
]

const teacherGradesSeed = [
  { id: 'tg-1', student: 'علی رضایی', className: 'هشتم پویش', assessment: 'آزمون فصل ۳ ریاضی', date: '۱۴۰۵/۰۹/۰۱', score: '۱۹', outOf: 20 },
  { id: 'tg-2', student: 'مریم کاظمی', className: 'هشتم پویش', assessment: 'آزمون فصل ۳ ریاضی', date: '۱۴۰۵/۰۹/۰۱', score: '۱۸', outOf: 20 },
  { id: 'tg-3', student: 'سینا احمدی', className: 'هشتم پویش', assessment: 'کوییز هفتگی', date: '۱۴۰۵/۰۸/۲۸', score: '۸', outOf: 10 },
  { id: 'tg-4', student: 'نگار حسینی', className: 'هشتم پویش', assessment: 'فعالیت کلاسی', date: '۱۴۰۵/۰۸/۲۷', score: '—', outOf: 20 },
]

const teacherHomeworkSeed = [
  { id: 'th-1', title: 'تمرین‌های فصل ۳', className: 'هشتم پویش', due: '۱۴۰۵/۰۹/۰۳', status: 'active', submissions: '۱۸/۲۴' },
  { id: 'th-2', title: 'جزوه جمع‌بندی فیزیک', className: 'نهم تلاش', due: '۱۴۰۵/۰۹/۰۴', status: 'review', submissions: '۲۰/۲۲' },
  { id: 'th-3', title: 'پروژه تحقیق علوم', className: 'هشتم پویش', due: '۱۴۰۵/۰۸/۲۹', status: 'closed', submissions: '۲۴/۲۴' },
]

const teacherMessagesSeed = [
  { id: 'tm-1', title: 'سؤال درباره تکلیف ریاضی', from: 'ولی دانش‌آموز: علی رضایی', date: '۱۴۰۵/۰۸/۳۰', body: 'سلام، لطفاً در مورد نحوه تحویل تمرین‌های فصل ۳ راهنمایی بفرمایید.', read: false },
  { id: 'tm-2', title: 'هماهنگی کلاس جبرانی', from: 'معاون آموزشی', date: '۱۴۰۵/۰۸/۲۹', body: 'کلاس جبرانی این هفته طبق برنامه جدید برگزار می‌شود. لطفاً حضور دانش‌آموزان را اطلاع‌رسانی کنید.', read: false },
  { id: 'tm-3', title: 'گزارش وضعیت کلاس', from: 'مدیر مدرسه', date: '۱۴۰۵/۰۸/۲۸', body: 'لطفاً گزارش کوتاه عملکرد کلاس هشتم پویش را تا پایان هفته ارسال کنید.', read: true },
]

const adminStudentsSeed = [
  { id: 'st-1', name: 'علی رضایی', className: 'هشتم پویش', average: '۱۸.۹', status: 'active', contact: '۰۹۱۲۳۴۵۶۷۸۹' },
  { id: 'st-2', name: 'مریم کاظمی', className: 'هشتم پویش', average: '۱۹.۳', status: 'active', contact: '۰۹۱۲۷۶۵۴۳۲۱' },
  { id: 'st-3', name: 'سینا احمدی', className: 'نهم تلاش', average: '۱۶.۸', status: 'leave', contact: '۰۹۱۲۹۸۷۶۵۴۳' },
  { id: 'st-4', name: 'نگار حسینی', className: 'هفتم امید', average: '۱۷.۵', status: 'active', contact: '۰۹۱۲۰۰۱۱۲۲۳' },
]

const adminClassesSeed = [
  { id: 'cl-1', name: 'هشتم پویش', grade: 'پایه هشتم', teacher: 'خانم کریمی', students: 24, schedule: 'شنبه تا چهارشنبه - ۴ زنگ', status: 'active' },
  { id: 'cl-2', name: 'نهم تلاش', grade: 'پایه نهم', teacher: 'آقای مرادی', students: 22, schedule: 'شنبه، دوشنبه، چهارشنبه - ۳ زنگ', status: 'active' },
  { id: 'cl-3', name: 'هفتم امید', grade: 'پایه هفتم', teacher: 'خانم احمدی', students: 26, schedule: 'یکشنبه تا چهارشنبه - ۴ زنگ', status: 'active' },
]

const adminAnnouncementsSeed = [
  { id: 'an-1', title: 'برگزاری جلسه اولیا', audience: 'اولیا و دبیران', date: '۱۴۰۵/۰۹/۰۴', status: 'sent', body: 'جلسه عمومی اولیا روز چهارشنبه ساعت ۱۷ در سالن مدرسه برگزار می‌شود.' },
  { id: 'an-2', title: 'تغییر برنامه امتحانات میان‌ترم', audience: 'دانش‌آموزان پایه هشتم و نهم', date: '۱۴۰۵/۰۹/۰۲', status: 'sent', body: 'برنامه امتحانات میان‌ترم با تغییرات جدید در سامانه منتشر شد.' },
  { id: 'an-3', title: 'یادآوری ثبت نمرات مستمر', audience: 'دبیران', date: '۱۴۰۵/۰۹/۰۱', status: 'draft', body: 'لطفاً نمرات مستمر کلاس‌ها تا پایان هفته در سامانه ثبت شود.' },
]

const adminReportsSeed = [
  { id: 'rp-1', title: 'گزارش حضور و غیاب هفتگی', type: 'حضور و غیاب', period: 'هفته چهارم آبان ۱۴۰۵', status: 'ready', summary: 'میانگین حضور مدرسه ۹۶٪ و ۸ مورد غیبت ثبت شده است.' },
  { id: 'rp-2', title: 'گزارش عملکرد تحصیلی پایه هشتم', type: 'عملکرد تحصیلی', period: 'آبان ۱۴۰۵', status: 'ready', summary: 'میانگین نمرات پایه هشتم ۱۸.۱ و روند پیشرفت مثبت است.' },
  { id: 'rp-3', title: 'گزارش فعالیت دبیران', type: 'فعالیت آموزشی', period: 'آبان ۱۴۰۵', status: 'in-progress', summary: 'در حال جمع‌آوری اطلاعات ثبت تکالیف، نمرات و بازخورد کلاس‌ها.' },
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
    { title: 'ارسال تکلیف', desc: 'مشاهده تکالیف و ثبت ارسال تکلیف.', targetSection: 'homework', done: 'بخش تکالیف باز شد.' },
    { title: 'مشاهده آخرین نمرات', desc: 'مشاهده نمرات و وضعیت تحصیلی.', targetSection: 'grades', done: 'بخش نمرات باز شد.' },
    { title: 'پیام‌ها و اعلان‌ها', desc: 'مشاهده پیام‌ها و اعلان‌های مدرسه.', targetSection: 'messages', done: 'بخش پیام‌ها باز شد.' },
  ],
  teacher: [
    { ...scheduleModal, title: 'مشاهده برنامه کلاسی', desc: 'برنامه کامل کلاس‌ها و زنگ‌های تدریس را مشاهده کنید.', action: 'بستن', done: 'برنامه کلاسی نمایش داده شد.' },
    { title: 'ثبت حضور و غیاب', desc: 'ثبت و بررسی حضور و غیاب دانش‌آموزان کلاس.', targetSection: 'attendance', done: 'بخش حضور و غیاب باز شد.' },
    { title: 'ثبت نمره', desc: 'ثبت و ویرایش نمرات با مقیاس ۵، ۱۰ یا ۲۰.', targetSection: 'grading', done: 'بخش ثبت نمره باز شد.' },
    { title: 'تکالیف و پیام‌ها', desc: 'مدیریت تکالیف، محتوا و ارتباطات آموزشی.', targetSection: 'teacher-homework', done: 'بخش تکالیف و محتوا باز شد.' },
  ],
  admin: [
    { title: 'مدیریت دانش‌آموزان', desc: 'مشاهده، ثبت و ویرایش اطلاعات دانش‌آموزان.', targetSection: 'admin-students', done: 'بخش دانش‌آموزان باز شد.' },
    { title: 'مدیریت کلاس‌ها', desc: 'مدیریت کلاس‌ها و برنامه‌ریزی.', targetSection: 'admin-classes', done: 'بخش کلاس‌ها باز شد.' },
    { title: 'اعلان‌ها و اطلاع‌رسانی', desc: 'ایجاد و ارسال اعلان‌های مدرسه.', targetSection: 'admin-announcements', done: 'بخش اعلان‌ها باز شد.' },
    { title: 'گزارش‌های عملکرد', desc: 'مشاهده گزارش‌های مدیریتی و آموزشی.', targetSection: 'admin-reports', done: 'بخش گزارش‌ها باز شد.' },
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
  const [formValues, setFormValues] = useState({})
  const [modalError, setModalError] = useState('')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [studentHomework, setStudentHomework] = useState(studentHomeworkSeed)
  const [studentMessages, setStudentMessages] = useState(studentMessagesSeed)
  const [teacherAttendance, setTeacherAttendance] = useState(teacherAttendanceSeed)
  const [teacherGrades, setTeacherGrades] = useState(teacherGradesSeed)
  const [teacherHomework, setTeacherHomework] = useState(teacherHomeworkSeed)
  const [teacherMessages, setTeacherMessages] = useState(teacherMessagesSeed)
  const [adminStudents, setAdminStudents] = useState(adminStudentsSeed)
  const [adminClasses, setAdminClasses] = useState(adminClassesSeed)
  const [adminAnnouncements, setAdminAnnouncements] = useState(adminAnnouncementsSeed)
  const [adminReports] = useState(adminReportsSeed)
  const [studentHomeworkQuery, setStudentHomeworkQuery] = useState('')
  const [studentHomeworkFilter, setStudentHomeworkFilter] = useState('all')
  const [studentMessagesQuery, setStudentMessagesQuery] = useState('')
  const [studentMessagesFilter, setStudentMessagesFilter] = useState('all')
  const [teacherGradesQuery, setTeacherGradesQuery] = useState('')
  const [teacherHomeworkQuery, setTeacherHomeworkQuery] = useState('')
  const [teacherHomeworkFilter, setTeacherHomeworkFilter] = useState('all')
  const [teacherMessagesQuery, setTeacherMessagesQuery] = useState('')
  const [adminStudentsQuery, setAdminStudentsQuery] = useState('')
  const [adminStudentsFilter, setAdminStudentsFilter] = useState('all')
  const [adminClassesQuery, setAdminClassesQuery] = useState('')
  const [adminAnnouncementsQuery, setAdminAnnouncementsQuery] = useState('')
  const [adminAnnouncementsFilter, setAdminAnnouncementsFilter] = useState('all')
  const [adminReportsQuery, setAdminReportsQuery] = useState('')
  const [adminReportsFilter, setAdminReportsFilter] = useState('all')
  const toastTimer = useRef(null)
  const modalRef = useRef(null)
  const lastFocusRef = useRef(null)
  const panelRef = useRef(null)
  const didMountSectionRef = useRef(false)

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

  const portalSections = useMemo(() => {
    if (role === 'teacher') {
      return [
        { id: 'dashboard', label: 'داشبورد' },
        { id: 'schedule', label: 'برنامه هفتگی' },
        { id: 'attendance', label: 'حضور و غیاب' },
        { id: 'grading', label: 'ثبت نمره' },
        { id: 'teacher-homework', label: 'تکالیف و محتوا' },
        { id: 'teacher-messages', label: 'پیام‌ها' },
        { id: 'profile', label: 'پروفایل و تنظیمات' },
      ]
    }
    if (role === 'admin') {
      return [
        { id: 'dashboard', label: 'داشبورد' },
        { id: 'admin-students', label: 'دانش‌آموزان' },
        { id: 'admin-classes', label: 'کلاس‌ها' },
        { id: 'admin-announcements', label: 'اعلان‌ها' },
        { id: 'admin-reports', label: 'گزارش‌ها' },
        { id: 'schedule', label: 'برنامه آموزشی' },
        { id: 'profile', label: 'پروفایل و تنظیمات' },
      ]
    }
    return [
      { id: 'dashboard', label: 'داشبورد' },
      { id: 'schedule', label: 'برنامه هفتگی' },
      { id: 'homework', label: 'تکالیف' },
      { id: 'grades', label: 'نمرات' },
      { id: 'messages', label: 'اعلان‌ها' },
      { id: 'profile', label: 'پروفایل و تنظیمات' },
    ]
  }, [role])

  const homeworkStatusLabel = {
    pending: 'در انتظار ارسال',
    submitted: 'ارسال شده',
    late: 'گذشته از موعد',
  }

  const submitHomework = (id) => {
    const target = studentHomework.find((hw) => hw.id === id)
    if (!target) return
    if (target.status === 'submitted') return
    openModal({
      title: 'ثبت ارسال تکلیف',
      desc: `آیا از ثبت ارسال تکلیف «${target.title}» مطمئن هستید؟\nپس از ثبت، وضعیت آن به «ارسال شده» تغییر می‌کند (نمونه).`,
      action: 'تأیید و ارسال',
      cancelAction: 'انصراف',
      done: 'تکلیف با موفقیت ارسال شد (نمونه).',
      onConfirm: () => {
        setStudentHomework((items) =>
          items.map((hw) => (hw.id === id ? { ...hw, status: 'submitted' } : hw)),
        )
      },
    })
  }

  const markMessageRead = (id) => {
    setStudentMessages((items) =>
      items.map((m) => (m.id === id ? { ...m, read: true } : m)),
    )
  }

  const openMessage = (msg) => {
    markMessageRead(msg.id)
    openModal({
      title: msg.title,
      desc: `${msg.from} • ${msg.date}\n\n${msg.body}`,
      action: 'بستن',
      done: 'پیام مشاهده شد.',
    })
  }

  const studentAverage = useMemo(() => {
    if (!studentGradesSeed.length) return 0
    const sum = studentGradesSeed.reduce((acc, g) => acc + g.score, 0)
    return (sum / studentGradesSeed.length).toFixed(1)
  }, [])

  const unreadMessagesCount = studentMessages.filter((m) => !m.read).length
  const pendingHomeworkCount = studentHomework.filter((hw) => hw.status !== 'submitted').length

  const attendanceStatusLabel = {
    present: 'حاضر',
    absent: 'غایب',
    late: 'تأخیر',
  }

  const cycleAttendanceStatus = (status) => {
    if (status === 'present') return 'late'
    if (status === 'late') return 'absent'
    return 'present'
  }

  const toggleAttendance = (id) => {
    setTeacherAttendance((items) =>
      items.map((s) => (s.id === id ? { ...s, status: cycleAttendanceStatus(s.status) } : s)),
    )
  }

  const saveAttendance = () => {
    openModal({
      title: 'ثبت نهایی حضور و غیاب',
      desc: 'آیا از ثبت نهایی وضعیت حضور و غیاب این جلسه مطمئن هستید؟ (نمونه)',
      action: 'ثبت نهایی',
      cancelAction: 'انصراف',
      done: 'وضعیت حضور و غیاب جلسه با موفقیت ثبت شد (نمونه).',
    })
  }

  const registerTeacherGrade = (id) => {
    const target = teacherGrades.find((g) => g.id === id)
    if (!target) return
    const normalizeDigits = (str) =>
      String(str)
        .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
        .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
        .replace(/،/g, '.')
        .replace(/,/g, '.')
        .trim()
    openModal({
      title: 'ثبت/ویرایش نمره',
      desc: `${target.student} • ${target.className}\n${target.assessment} • ${target.date}`,
      action: 'ثبت نمره',
      done: `نمره «${target.student}» با موفقیت ثبت شد (نمونه).`,
      fields: [
        {
          name: 'outOf',
          label: 'مقیاس نمره',
          type: 'select',
          required: true,
          initialValue: String(target.outOf || 20),
          options: [
            { value: '5', label: 'از ۵ نمره' },
            { value: '10', label: 'از ۱۰ نمره' },
            { value: '20', label: 'از ۲۰ نمره' },
          ],
        },
        {
          name: 'score',
          label: 'نمره',
          placeholder: 'مثلاً ۱۸ یا 4.5',
          required: true,
          initialValue: target.score === '—' ? '' : target.score,
          validate: (value, allValues) => {
            const normalized = normalizeDigits(value)
            if (!/^\d{1,2}(\.\d{1,2})?$/.test(normalized)) return 'نمره باید عددی معتبر باشد.'
            const num = Number(normalized)
            const max = Number(allValues?.outOf || target.outOf || 20)
            if (Number.isNaN(num) || num < 0 || num > max) return `نمره باید بین ۰ تا ${max} باشد.`
            return ''
          },
        },
      ],
      onConfirm: (values) => {
        setTeacherGrades((items) =>
          items.map((g) => (g.id === id ? { ...g, score: values.score, outOf: Number(values.outOf) } : g)),
        )
      },
    })
  }

  const teacherHomeworkStatusLabel = {
    active: 'فعال',
    review: 'در حال بررسی',
    closed: 'بسته شده',
  }

  const addTeacherHomework = () => {
    openModal({
      title: 'افزودن تکلیف/محتوا',
      desc: 'اطلاعات تکلیف یا محتوای آموزشی جدید را وارد کنید (نمونه).',
      action: 'افزودن',
      done: 'تکلیف/محتوای جدید با موفقیت اضافه شد (نمونه).',
      fields: [
        { name: 'title', label: 'عنوان تکلیف/محتوا', placeholder: 'مثلاً تمرین‌های فصل ۴', required: true },
        { name: 'className', label: 'کلاس', placeholder: 'مثلاً هشتم پویش', required: true, initialValue: 'هشتم پویش' },
        { name: 'due', label: 'موعد تحویل', placeholder: 'مثلاً ۱۴۰۵/۰۹/۱۰', required: true },
      ],
      onConfirm: (values) => {
        setTeacherHomework((items) => [
          {
            id: `th-${Date.now()}`,
            title: values.title,
            className: values.className,
            due: values.due,
            status: 'active',
            submissions: '۰/۲۴',
          },
          ...items,
        ])
      },
    })
  }

  const toggleTeacherHomeworkStatus = (id) => {
    setTeacherHomework((items) =>
      items.map((hw) => {
        if (hw.id !== id) return hw
        const next = hw.status === 'active' ? 'review' : hw.status === 'review' ? 'closed' : 'active'
        return { ...hw, status: next }
      }),
    )
    notify('وضعیت تکلیف به‌روزرسانی شد (نمونه).')
  }

  const openTeacherMessage = (msg) => {
    setTeacherMessages((items) => items.map((m) => (m.id === msg.id ? { ...m, read: true } : m)))
    openModal({
      title: msg.title,
      desc: `${msg.from} • ${msg.date}\n\n${msg.body}`,
      action: 'بستن',
      done: 'پیام مشاهده شد.',
    })
  }

  const replyTeacherMessage = (msg) => {
    openModal({
      title: `پاسخ به: ${msg.title}`,
      desc: `گیرنده/فرستنده: ${msg.from}\nپاسخ شما برای این پیام ثبت می‌شود (نمونه).`,
      action: 'ارسال پاسخ',
      cancelAction: 'انصراف',
      done: 'پاسخ پیام با موفقیت ارسال شد (نمونه).',
      fields: [
        { name: 'reply', label: 'متن پاسخ', placeholder: 'متن پاسخ خود را بنویسید...', type: 'textarea', required: true },
      ],
      onConfirm: () => {
        setTeacherMessages((items) => items.map((m) => (m.id === msg.id ? { ...m, read: true } : m)))
      },
    })
  }

  const teacherUnreadMessagesCount = teacherMessages.filter((m) => !m.read).length
  const teacherPendingGradesCount = teacherGrades.filter((g) => g.score === '—' || g.score === '').length
  const teacherActiveHomeworkCount = teacherHomework.filter((hw) => hw.status === 'active').length
  const attendanceSummary = teacherAttendance.reduce(
    (acc, s) => {
      acc[s.status] += 1
      return acc
    },
    { present: 0, absent: 0, late: 0 },
  )

  const adminStudentStatusLabel = {
    active: 'فعال',
    leave: 'مرخصی',
    transferred: 'انتقالی',
  }

  const adminAnnouncementStatusLabel = {
    sent: 'ارسال شده',
    draft: 'پیش‌نویس',
  }

  const adminReportStatusLabel = {
    ready: 'آماده',
    'in-progress': 'در حال تهیه',
  }

  const addAdminStudent = () => {
    openModal({
      title: 'ثبت دانش‌آموز جدید',
      desc: 'اطلاعات دانش‌آموز جدید را وارد کنید (نمونه).',
      action: 'ثبت دانش‌آموز',
      done: 'دانش‌آموز جدید با موفقیت ثبت شد (نمونه).',
      fields: [
        { name: 'name', label: 'نام و نام خانوادگی', placeholder: 'مثلاً علی رضایی', required: true },
        { name: 'className', label: 'کلاس', placeholder: 'مثلاً هشتم پویش', required: true },
        { name: 'contact', label: 'شماره تماس', placeholder: 'مثلاً 09123456789', required: false },
      ],
      onConfirm: (values) => {
        setAdminStudents((items) => [
          {
            id: `st-${Date.now()}`,
            name: values.name,
            className: values.className,
            average: '—',
            status: 'active',
            contact: values.contact || '—',
          },
          ...items,
        ])
      },
    })
  }

  const editAdminStudent = (student) => {
    openModal({
      title: 'ویرایش دانش‌آموز',
      desc: `اطلاعات «${student.name}» را ویرایش کنید (نمونه).`,
      action: 'ذخیره تغییرات',
      done: 'اطلاعات دانش‌آموز به‌روزرسانی شد (نمونه).',
      fields: [
        { name: 'name', label: 'نام و نام خانوادگی', placeholder: 'نام دانش‌آموز', required: true, initialValue: student.name },
        { name: 'className', label: 'کلاس', placeholder: 'نام کلاس', required: true, initialValue: student.className === 'بدون کلاس' ? '' : student.className },
        { name: 'contact', label: 'شماره تماس', placeholder: 'شماره تماس', required: false, initialValue: student.contact === '—' ? '' : student.contact },
      ],
      onConfirm: (values) => {
        setAdminStudents((items) =>
          items.map((s) => (s.id === student.id ? { ...s, name: values.name, className: values.className, contact: values.contact || '—' } : s)),
        )
      },
    })
  }

  const addAdminClass = () => {
    openModal({
      title: 'افزودن کلاس جدید',
      desc: 'اطلاعات کلاس جدید را وارد کنید (نمونه).',
      action: 'ایجاد کلاس',
      done: 'کلاس جدید با موفقیت ایجاد شد (نمونه).',
      fields: [
        { name: 'name', label: 'نام کلاس', placeholder: 'مثلاً هشتم شایستگی', required: true },
        { name: 'grade', label: 'پایه', placeholder: 'مثلاً پایه هشتم', required: true },
        { name: 'teacher', label: 'معلم مسئول', placeholder: 'مثلاً خانم کریمی', required: true },
      ],
      onConfirm: (values) => {
        setAdminClasses((items) => [
          {
            id: `cl-${Date.now()}`,
            name: values.name,
            grade: values.grade,
            teacher: values.teacher,
            students: 0,
            schedule: 'برنامه‌ریزی نشده',
            status: 'active',
          },
          ...items,
        ])
      },
    })
  }

  const editAdminClass = (cls) => {
    openModal({
      title: 'ویرایش کلاس',
      desc: `اطلاعات کلاس «${cls.name}» را ویرایش کنید (نمونه).`,
      action: 'ذخیره تغییرات',
      done: 'اطلاعات کلاس به‌روزرسانی شد (نمونه).',
      fields: [
        { name: 'name', label: 'نام کلاس', placeholder: 'نام کلاس', required: true, initialValue: cls.name },
        { name: 'grade', label: 'پایه', placeholder: 'پایه', required: true, initialValue: cls.grade === 'تعیین نشده' ? '' : cls.grade },
        { name: 'teacher', label: 'معلم مسئول', placeholder: 'معلم مسئول', required: true, initialValue: cls.teacher === 'تعیین نشده' ? '' : cls.teacher },
      ],
      onConfirm: (values) => {
        setAdminClasses((items) =>
          items.map((c) => (c.id === cls.id ? { ...c, name: values.name, grade: values.grade, teacher: values.teacher } : c)),
        )
      },
    })
  }

  const addAdminAnnouncement = () => {
    openModal({
      title: 'ایجاد اعلان جدید',
      desc: 'اعلان جدید را به‌صورت پیش‌نویس ایجاد کنید (نمونه).',
      action: 'ذخیره پیش‌نویس',
      done: 'اعلان جدید به‌صورت پیش‌نویس ذخیره شد (نمونه).',
      fields: [
        { name: 'title', label: 'عنوان اعلان', placeholder: 'مثلاً برگزاری جلسه اولیا', required: true },
        { name: 'audience', label: 'مخاطبان', placeholder: 'مثلاً همه دانش‌آموزان و اولیا', required: true },
        { name: 'body', label: 'متن اعلان', placeholder: 'متن اعلان را بنویسید...', type: 'textarea', required: true },
      ],
      onConfirm: (values) => {
        setAdminAnnouncements((items) => [
          {
            id: `an-${Date.now()}`,
            title: values.title,
            audience: values.audience,
            date: '۱۴۰۵/۰۹/۰۱',
            status: 'draft',
            body: values.body,
          },
          ...items,
        ])
      },
    })
  }

  const sendAdminAnnouncement = (id) => {
    const target = adminAnnouncements.find((a) => a.id === id)
    if (!target) return
    openModal({
      title: 'ارسال اعلان',
      desc: `آیا از ارسال اعلان «${target.title}» برای مخاطبان (${target.audience}) مطمئن هستید؟`,
      action: 'ارسال اعلان',
      cancelAction: 'انصراف',
      done: 'اعلان با موفقیت ارسال شد (نمونه).',
      onConfirm: () => {
        setAdminAnnouncements((items) =>
          items.map((a) => (a.id === id ? { ...a, status: 'sent' } : a)),
        )
      },
    })
  }

  const openAdminAnnouncement = (announcement) => {
    openModal({
      title: announcement.title,
      desc: `مخاطب: ${announcement.audience}\nتاریخ: ${announcement.date}\nوضعیت: ${adminAnnouncementStatusLabel[announcement.status]}\n\n${announcement.body}`,
      action: 'بستن',
      done: 'جزئیات اعلان نمایش داده شد.',
    })
  }

  const openAdminReport = (report) => {
    openModal({
      title: report.title,
      desc: `نوع: ${report.type}\nبازه: ${report.period}\nوضعیت: ${adminReportStatusLabel[report.status]}\n\n${report.summary}`,
      action: 'بستن',
      done: 'جزئیات گزارش نمایش داده شد.',
    })
  }

  const adminActiveStudentsCount = adminStudents.filter((s) => s.status === 'active').length
  const adminDraftAnnouncementsCount = adminAnnouncements.filter((a) => a.status === 'draft').length
  const adminReadyReportsCount = adminReports.filter((r) => r.status === 'ready').length

  const normalizeText = (v) => String(v ?? '').toLowerCase()

  const filteredStudentHomework = studentHomework.filter((hw) => {
    const q = normalizeText(studentHomeworkQuery)
    const matchQ = !q || normalizeText(`${hw.title} ${hw.subject} ${hw.teacher}`).includes(q)
    const matchStatus = studentHomeworkFilter === 'all' || hw.status === studentHomeworkFilter
    return matchQ && matchStatus
  })

  const filteredStudentMessages = studentMessages.filter((msg) => {
    const q = normalizeText(studentMessagesQuery)
    const matchQ = !q || normalizeText(`${msg.title} ${msg.from} ${msg.body}`).includes(q)
    const matchStatus =
      studentMessagesFilter === 'all' ||
      (studentMessagesFilter === 'read' && msg.read) ||
      (studentMessagesFilter === 'unread' && !msg.read)
    return matchQ && matchStatus
  })

  const filteredTeacherGrades = teacherGrades.filter((g) => {
    const q = normalizeText(teacherGradesQuery)
    return !q || normalizeText(`${g.student} ${g.assessment} ${g.className}`).includes(q)
  })

  const filteredTeacherHomework = teacherHomework.filter((hw) => {
    const q = normalizeText(teacherHomeworkQuery)
    const matchQ = !q || normalizeText(`${hw.title} ${hw.className}`).includes(q)
    const matchStatus = teacherHomeworkFilter === 'all' || hw.status === teacherHomeworkFilter
    return matchQ && matchStatus
  })

  const filteredTeacherMessages = teacherMessages.filter((msg) => {
    const q = normalizeText(teacherMessagesQuery)
    return !q || normalizeText(`${msg.title} ${msg.from} ${msg.body}`).includes(q)
  })

  const filteredAdminStudents = adminStudents.filter((s) => {
    const q = normalizeText(adminStudentsQuery)
    const matchQ = !q || normalizeText(`${s.name} ${s.className} ${s.contact}`).includes(q)
    const matchStatus = adminStudentsFilter === 'all' || s.status === adminStudentsFilter
    return matchQ && matchStatus
  })

  const filteredAdminClasses = adminClasses.filter((c) => {
    const q = normalizeText(adminClassesQuery)
    return !q || normalizeText(`${c.name} ${c.grade} ${c.teacher}`).includes(q)
  })

  const filteredAdminAnnouncements = adminAnnouncements.filter((a) => {
    const q = normalizeText(adminAnnouncementsQuery)
    const matchQ = !q || normalizeText(`${a.title} ${a.audience} ${a.body}`).includes(q)
    const matchStatus = adminAnnouncementsFilter === 'all' || a.status === adminAnnouncementsFilter
    return matchQ && matchStatus
  })

  const filteredAdminReports = adminReports.filter((r) => {
    const q = normalizeText(adminReportsQuery)
    const matchQ = !q || normalizeText(`${r.title} ${r.type} ${r.period} ${r.summary}`).includes(q)
    const matchStatus = adminReportsFilter === 'all' || r.status === adminReportsFilter
    return matchQ && matchStatus
  })

  const profileInfo = role === 'admin'
    ? { name: 'مدیر مدرسه (نمونه)', roleLabel: 'مدیر', id: 'ADM-1024', contact: 'admin@school.local', org: 'دبیرستان نمونه' }
    : role === 'teacher'
      ? { name: 'دبیر گرامی (نمونه)', roleLabel: 'دبیر', id: 'TCH-2048', contact: 'teacher@school.local', org: 'گروه آموزشی علوم' }
      : { name: 'دانش‌آموز (نمونه)', roleLabel: 'دانش‌آموز', id: 'STD-4096', contact: 'student@school.local', org: 'کلاس هشتم پویش' }

  const notify = (message) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }

  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const getModalFields = (item) => {
    if (Array.isArray(item?.fields) && item.fields.length) return item.fields
    if (item?.field) return [{ name: '__single', label: item.field, placeholder: item.field, type: 'text', required: true }]
    return []
  }

  const openModal = (item) => {
    const fields = getModalFields(item)
    const initial = {}
    fields.forEach((f) => { initial[f.name] = f.initialValue ?? '' })
    lastFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setModal(item)
    setInputValue('')
    setFormValues(initial)
    setModalError('')
  }
  const closeModal = () => {
    setModal(null)
    setInputValue('')
    setFormValues({})
    setModalError('')
    window.setTimeout(() => {
      lastFocusRef.current?.focus?.()
    }, 0)
  }
  const confirmModal = () => {
    if (!modal) return
    const fields = getModalFields(modal)
    let valuesForConfirm = null

    if (fields.length) {
      const currentValues = {}
      for (const f of fields) {
        const raw = fields.length === 1 && f.name === '__single' ? inputValue : formValues[f.name]
        currentValues[f.name] = typeof raw === 'string' ? raw.trim() : raw
      }

      for (const f of fields) {
        const value = currentValues[f.name]
        if (f.required !== false && (value === '' || value == null)) {
          setModalError(`لطفاً «${f.label}» را وارد کنید.`)
          return
        }
        if (typeof f.validate === 'function') {
          const err = f.validate(value, currentValues)
          if (err) {
            setModalError(err)
            return
          }
        }
      }

      if (fields.length === 1 && fields[0].name === '__single') {
        valuesForConfirm = currentValues.__single
      } else {
        valuesForConfirm = currentValues
      }
    }

    if (typeof modal.onConfirm === 'function') {
      modal.onConfirm(valuesForConfirm)
    }
    notify(modal.done || 'عملیات با موفقیت انجام شد.')
    closeModal()
  }

  useEffect(() => {
    if (!modal) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFirst = () => {
      const root = modalRef.current
      if (!root) return
      const focusable = root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      const first = Array.from(focusable).find((el) => !el.disabled && el.getAttribute('aria-hidden') !== 'true')
      first?.focus?.()
    }
    const timer = window.setTimeout(focusFirst, 0)

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
        return
      }
      if (e.key === 'Tab') {
        const root = modalRef.current
        if (!root) return
        const focusable = Array.from(root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
          .filter((el) => !el.disabled && el.getAttribute('aria-hidden') !== 'true')
        if (!focusable.length) {
          e.preventDefault()
          return
        }
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [modal])

  useEffect(() => {
    setActiveSection('dashboard')
  }, [role])

  useEffect(() => {
    if (!didMountSectionRef.current) {
      didMountSectionRef.current = true
      return
    }
    const heading = panelRef.current?.querySelector('.section-title')
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1
      heading.focus({ preventScroll: true })
      const panel = panelRef.current
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeSection])

  useEffect(() => {
    const welcomeMessage =
      role === 'admin'
        ? 'خوش آمدید، مدیر عزیز! به پنل مدیریت مدرسه وارد شدید.'
        : role === 'teacher'
          ? 'خوش آمدید، دبیر گرامی! به پنل آموزشی خود وارد شدید.'
          : 'خوش آمدید! به پنل دانش‌آموزی خود وارد شدی.'
    notify(welcomeMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  return (
    <div className="portal">
      <a href="#portal-main" className="skip-link">پرش به محتوای پنل</a>
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

        <nav className="portal-section-nav" aria-label="بخش‌های پنل">
          <div className="container">
            <div className="portal-section-nav-inner card">
              {portalSections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`portal-section-link ${activeSection === s.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(s.id)}
                  aria-current={activeSection === s.id ? 'page' : undefined}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {activeSection === 'dashboard' && (
          <>
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
                      <button
                        type="button"
                        className="portal-card-btn"
                        onClick={() => {
                          if (card.title === 'برنامه هفتگی') {
                            openModal(scheduleModal)
                            return
                          }
                          if (role === 'teacher') {
                            const sectionByTitle = {
                              'ثبت حضور و غیاب': 'attendance',
                              'ثبت نمرات': 'grading',
                              'تکالیف و محتوا': 'teacher-homework',
                              'ارتباط با اولیا و مدیر': 'teacher-messages',
                            }
                            const targetSection = sectionByTitle[card.title]
                            if (targetSection) {
                              setActiveSection(targetSection)
                              notify(`بخش «${card.title}» باز شد.`)
                              return
                            }
                          }
                          if (role === 'admin') {
                            const sectionByTitle = {
                              'مدیریت دانش‌آموزان': 'admin-students',
                              'مدیریت کلاس‌ها': 'admin-classes',
                              'گزارش‌گیری عملکرد': 'admin-reports',
                              'ارسال اعلان': 'admin-announcements',
                            }
                            const targetSection = sectionByTitle[card.title]
                            if (targetSection) {
                              setActiveSection(targetSection)
                              notify(`بخش «${card.title}» باز شد.`)
                              return
                            }
                          }
                          openModal({ title: card.title, desc: card.desc, action: 'بستن', done: `بخش «${card.title}» باز شد.` })
                        }}
                        title={`نمایش جزئیات «${card.title}»`}
                        aria-label={`مشاهده جزئیات ${card.title}`}
                      >
                        مشاهده جزئیات
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section id="panel" ref={panelRef} className="section alt portal-section">
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
                        <button
                          type="button"
                          className="portal-quick-item"
                          onClick={() => {
                            if (item.targetSection) {
                              setActiveSection(item.targetSection)
                              notify(item.done || `بخش «${item.title}» باز شد.`)
                              return
                            }
                            openModal(item)
                          }}
                          title={`اجرای/نمایش «${item.title}»`}
                          aria-label={item.title}
                        >
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
          </>
        )}

        {activeSection === 'schedule' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">{role === 'admin' ? 'برنامه‌ریزی آموزشی' : 'برنامه هفتگی'}</span>
                <h2>{role === 'admin' ? 'نمای کلی برنامه آموزشی' : 'برنامه کلاس‌های هفته'}</h2>
                <p>
                  {role === 'admin'
                    ? 'نمای کلی برنامه کلاس‌ها و زنگ‌های مدرسه (نمونه).'
                    : role === 'teacher'
                      ? 'برنامه تدریس و کلاس‌های هفته (نمونه).'
                      : 'برنامه هفتگی کلاس‌های شما به‌صورت روزانه.'}
                </p>
              </div>
              <div className="card portal-schedule-page">
                <div className="portal-schedule-list portal-schedule-list-page" role="table" aria-label="برنامه هفتگی">
                  {weeklySchedule.map((row) => (
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
              </div>
            </div>
          </section>
        )}

        {activeSection === 'homework' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">تکالیف و پروژه‌ها</span>
                <h2>تکالیف من</h2>
                <p>وضعیت تکالیف، موعد تحویل و امکان ثبت ارسال (نمونه) را از این بخش دنبال کنید.</p>
              </div>
              <div className="portal-mini-stats">
                <div className="portal-mini-stat card"><span>کل تکالیف</span><strong>{studentHomework.length}</strong></div>
                <div className="portal-mini-stat card"><span>در انتظار/گذشته</span><strong>{pendingHomeworkCount}</strong></div>
                <div className="portal-mini-stat card"><span>ارسال شده</span><strong>{studentHomework.length - pendingHomeworkCount}</strong></div>
              </div>
              <div className="portal-toolbar">
                <input className="portal-input" type="search" aria-label="جستجو در تکالیف" placeholder="جستجو در تکالیف (عنوان، درس، استاد)..." value={studentHomeworkQuery} onChange={(e) => setStudentHomeworkQuery(e.target.value)} />
                <select className="portal-select" aria-label="فیلتر وضعیت تکالیف" value={studentHomeworkFilter} onChange={(e) => setStudentHomeworkFilter(e.target.value)}>
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="pending">در انتظار ارسال</option>
                  <option value="submitted">ارسال شده</option>
                  <option value="late">گذشته از موعد</option>
                </select>
              </div>
              {studentHomework.length ? (
                filteredStudentHomework.length ? (
                  <div className="portal-list">
                    {filteredStudentHomework.map((hw) => (
                      <article key={hw.id} className="card portal-list-item">
                        <div className="portal-list-main">
                          <div className="portal-list-head">
                            <h3>{hw.title}</h3>
                            <span className={`portal-status ${hw.status}`}>{homeworkStatusLabel[hw.status]}</span>
                          </div>
                          <p className="portal-item-meta">{hw.subject} • استاد: {hw.teacher} • موعد: {hw.due}</p>
                          <p className="portal-item-note">{hw.note}</p>
                        </div>
                        <div className="portal-list-actions">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => openModal({ title: hw.title, desc: `${hw.subject} • استاد: ${hw.teacher}\nموعد تحویل: ${hw.due}\nوضعیت: ${homeworkStatusLabel[hw.status]}\n\n${hw.note}`, action: 'بستن', done: 'جزئیات تکلیف نمایش داده شد.' })}
                          >
                            جزئیات
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => submitHomework(hw.id)}
                            disabled={hw.status === 'submitted'}
                            title={hw.status === 'submitted' ? 'این تکلیف قبلاً ارسال شده است' : 'ثبت ارسال تکلیف (نمونه)'}
                          >
                            {hw.status === 'submitted' ? 'ارسال شده' : 'ثبت ارسال'}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="card portal-empty-state" role="status">
                    <strong>موردی با این فیلتر پیدا نشد</strong>
                    <p>عبارت جستجو یا فیلتر وضعیت را تغییر دهید.</p>
                  </div>
                )
              ) : (
                <div className="card portal-empty-state" role="status">
                  <strong>تکلیفی ثبت نشده است</strong>
                  <p>در حال حاضر تکلیف فعالی برای نمایش وجود ندارد.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'grades' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">کارنامه و نمرات</span>
                <h2>نمرات و ارزیابی‌ها</h2>
                <p>خلاصه نمرات ثبت‌شده و وضعیت عملکرد تحصیلی (نمونه).</p>
              </div>
              <div className="portal-mini-stats">
                <div className="portal-mini-stat card"><span>میانگین نمونه</span><strong>{studentAverage}</strong></div>
                <div className="portal-mini-stat card"><span>تعداد ارزیابی‌ها</span><strong>{studentGradesSeed.length}</strong></div>
                <div className="portal-mini-stat card"><span>وضعیت کلی</span><strong>رو به پیشرفت</strong></div>
              </div>
              {studentGradesSeed.length ? (
                <div className="card portal-table-card">
                  <div className="portal-table-wrap">
                    <table className="portal-table">
                      <thead>
                        <tr>
                          <th>درس</th>
                          <th>عنوان ارزیابی</th>
                          <th>تاریخ</th>
                          <th>نمره</th>
                          <th>وضعیت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentGradesSeed.map((g) => (
                          <tr key={g.id}>
                            <td>{g.subject}</td>
                            <td>{g.assessment}</td>
                            <td>{g.date}</td>
                            <td><strong>{g.score}</strong> از {g.outOf}</td>
                            <td><span className={`portal-badge-status ${g.status === 'عالی' ? 'good' : g.status === 'خوب' ? 'ok' : 'warn'}`}>{g.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="card portal-empty-state" role="status">
                  <strong>نمره‌ای ثبت نشده است</strong>
                  <p>هنوز نمره یا ارزیابی ثبت‌شده‌ای برای نمایش وجود ندارد.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'messages' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">اعلان‌ها و پیام‌ها</span>
                <h2>پیام‌ها و اطلاعیه‌ها</h2>
                <p>اعلان‌های مدرسه و پیام‌های آموزشی مربوط به شما.</p>
              </div>
              <div className="portal-mini-stats">
                <div className="portal-mini-stat card"><span>کل پیام‌ها</span><strong>{studentMessages.length}</strong></div>
                <div className="portal-mini-stat card"><span>خوانده‌نشده</span><strong>{unreadMessagesCount}</strong></div>
                <div className="portal-mini-stat card"><span>خوانده‌شده</span><strong>{studentMessages.length - unreadMessagesCount}</strong></div>
              </div>
              <div className="portal-toolbar">
                <input className="portal-input" type="search" aria-label="جستجو در پیام‌ها" placeholder="جستجو در پیام‌ها..." value={studentMessagesQuery} onChange={(e) => setStudentMessagesQuery(e.target.value)} />
                <select className="portal-select" aria-label="فیلتر پیام‌ها" value={studentMessagesFilter} onChange={(e) => setStudentMessagesFilter(e.target.value)}>
                  <option value="all">همه پیام‌ها</option>
                  <option value="unread">خوانده‌نشده</option>
                  <option value="read">خوانده‌شده</option>
                </select>
              </div>
              {studentMessages.length ? (
                filteredStudentMessages.length ? (
                  <div className="portal-list">
                    {filteredStudentMessages.map((msg) => (
                      <article key={msg.id} className={`card portal-list-item ${!msg.read ? 'is-unread' : ''}`}>
                        <div className="portal-list-main">
                          <div className="portal-list-head">
                            <h3>{msg.title}</h3>
                            <span className={`portal-status ${msg.read ? 'submitted' : 'pending'}`}>{msg.read ? 'خوانده شده' : 'جدید'}</span>
                          </div>
                          <p className="portal-item-meta">{msg.from} • {msg.date}</p>
                          <p className="portal-item-note">{msg.body}</p>
                        </div>
                        <div className="portal-list-actions">
                          <button type="button" className="btn btn-secondary" onClick={() => openMessage(msg)}>مشاهده پیام</button>
                          {!msg.read && (
                            <button type="button" className="btn btn-primary" onClick={() => { markMessageRead(msg.id); notify('پیام به‌عنوان خوانده‌شده علامت‌گذاری شد.'); }}>
                              علامت خوانده‌شده
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="card portal-empty-state" role="status">
                    <strong>موردی با این فیلتر پیدا نشد</strong>
                    <p>عبارت جستجو یا فیلتر را تغییر دهید.</p>
                  </div>
                )
              ) : (
                <div className="card portal-empty-state" role="status">
                  <strong>پیام یا اعلانی وجود ندارد</strong>
                  <p>اعلان‌ها و پیام‌های جدید در این بخش نمایش داده می‌شوند.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'attendance' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">حضور و غیاب</span>
                <h2>ثبت حضور و غیاب کلاس</h2>
                <p>وضعیت حضور دانش‌آموزان کلاس امروز را ثبت و بررسی کنید (نمونه). برای تغییر وضعیت روی دکمه وضعیت هر دانش‌آموز کلیک کنید.</p>
              </div>
              <div className="portal-mini-stats">
                <div className="portal-mini-stat card"><span>حاضر</span><strong>{attendanceSummary.present}</strong></div>
                <div className="portal-mini-stat card"><span>تأخیر</span><strong>{attendanceSummary.late}</strong></div>
                <div className="portal-mini-stat card"><span>غایب</span><strong>{attendanceSummary.absent}</strong></div>
              </div>
              {teacherAttendance.length ? (
                <div className="card portal-table-card">
                  <div className="portal-table-wrap">
                    <table className="portal-table">
                      <thead>
                        <tr>
                          <th>دانش‌آموز</th>
                          <th>کلاس</th>
                          <th>وضعیت</th>
                          <th>عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teacherAttendance.map((s) => (
                          <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>هشتم پویش</td>
                            <td>
                              <span className={`portal-badge-status ${s.status === 'present' ? 'good' : s.status === 'late' ? 'warn' : 'danger'}`}>
                                {attendanceStatusLabel[s.status]}
                              </span>
                            </td>
                            <td>
                              <button type="button" className="btn btn-secondary" onClick={() => toggleAttendance(s.id)}>
                                تغییر وضعیت
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="portal-table-actions">
                    <button type="button" className="btn btn-primary" onClick={saveAttendance}>ثبت نهایی حضور و غیاب</button>
                  </div>
                </div>
              ) : (
                <div className="card portal-empty-state" role="status">
                  <strong>دانش‌آموزی برای ثبت حضور و غیاب وجود ندارد</strong>
                  <p>پس از انتخاب کلاس یا بارگذاری لیست، وضعیت حضور و غیاب اینجا نمایش داده می‌شود.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'grading' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">ثبت نمره</span>
                <h2>ثبت و مدیریت نمرات</h2>
                <p>نمرات آزمون‌ها و ارزیابی‌های کلاسی را ثبت یا ویرایش کنید (نمونه).</p>
              </div>
              <div className="portal-mini-stats">
                <div className="portal-mini-stat card"><span>کل رکوردها</span><strong>{teacherGrades.length}</strong></div>
                <div className="portal-mini-stat card"><span>در انتظار ثبت نمره</span><strong>{teacherPendingGradesCount}</strong></div>
                <div className="portal-mini-stat card"><span>ثبت‌شده</span><strong>{teacherGrades.length - teacherPendingGradesCount}</strong></div>
              </div>
              <div className="portal-toolbar">
                <input className="portal-input" type="search" aria-label="جستجو در نمرات" placeholder="جستجو (دانش‌آموز، ارزیابی، کلاس)..." value={teacherGradesQuery} onChange={(e) => setTeacherGradesQuery(e.target.value)} />
              </div>
              {teacherGrades.length ? (
                filteredTeacherGrades.length ? (
                  <div className="card portal-table-card">
                    <div className="portal-table-wrap">
                      <table className="portal-table">
                        <thead>
                          <tr>
                            <th>دانش‌آموز</th>
                            <th>کلاس</th>
                            <th>ارزیابی</th>
                            <th>تاریخ</th>
                            <th>نمره</th>
                            <th>عملیات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTeacherGrades.map((g) => (
                            <tr key={g.id}>
                              <td>{g.student}</td>
                              <td>{g.className}</td>
                              <td>{g.assessment}</td>
                              <td>{g.date}</td>
                              <td><strong>{g.score}</strong>{g.score !== '—' ? ` / ${g.outOf || 20}` : ''}</td>
                              <td>
                                <button type="button" className="btn btn-secondary" onClick={() => registerTeacherGrade(g.id)}>
                                  {g.score === '—' ? 'ثبت نمره' : 'ویرایش نمره'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="card portal-empty-state" role="status">
                    <strong>موردی با این جستجو پیدا نشد</strong>
                    <p>عبارت جستجو را تغییر دهید.</p>
                  </div>
                )
              ) : (
                <div className="card portal-empty-state" role="status">
                  <strong>رکورد نمره‌ای وجود ندارد</strong>
                  <p>هنوز موردی برای ثبت یا ویرایش نمره ثبت نشده است.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'teacher-homework' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">تکالیف و محتوا</span>
                <h2>مدیریت تکالیف و محتوای آموزشی</h2>
                <p>تکالیف، فایل‌ها و محتوای درسی کلاس‌ها را مدیریت کنید (نمونه).</p>
              </div>
              <div className="portal-mini-stats">
                <div className="portal-mini-stat card"><span>کل موارد</span><strong>{teacherHomework.length}</strong></div>
                <div className="portal-mini-stat card"><span>فعال</span><strong>{teacherActiveHomeworkCount}</strong></div>
                <div className="portal-mini-stat card"><span>در حال بررسی/بسته</span><strong>{teacherHomework.length - teacherActiveHomeworkCount}</strong></div>
              </div>
              <div className="portal-section-toolbar">
                <button type="button" className="btn btn-primary" onClick={addTeacherHomework}>افزودن تکلیف/محتوا</button>
              </div>
              <div className="portal-toolbar">
                <input className="portal-input" type="search" aria-label="جستجو در تکالیف و محتوا" placeholder="جستجو در تکالیف/محتوا..." value={teacherHomeworkQuery} onChange={(e) => setTeacherHomeworkQuery(e.target.value)} />
                <select className="portal-select" aria-label="فیلتر وضعیت تکالیف و محتوا" value={teacherHomeworkFilter} onChange={(e) => setTeacherHomeworkFilter(e.target.value)}>
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="active">فعال</option>
                  <option value="review">در حال بررسی</option>
                  <option value="closed">بسته شده</option>
                </select>
              </div>
              {teacherHomework.length ? (
                filteredTeacherHomework.length ? (
                  <div className="portal-list">
                    {filteredTeacherHomework.map((hw) => (
                      <article key={hw.id} className="card portal-list-item">
                        <div className="portal-list-main">
                          <div className="portal-list-head">
                            <h3>{hw.title}</h3>
                            <span className={`portal-status ${hw.status === 'active' ? 'pending' : hw.status === 'review' ? 'late' : 'submitted'}`}>
                              {teacherHomeworkStatusLabel[hw.status]}
                            </span>
                          </div>
                          <p className="portal-item-meta">{hw.className} • موعد: {hw.due} • تحویل‌ها: {hw.submissions}</p>
                          <p className="portal-item-note">مدیریت وضعیت، مشاهده تحویل‌ها و به‌روزرسانی محتوای آموزشی این مورد.</p>
                        </div>
                        <div className="portal-list-actions">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => openModal({ title: hw.title, desc: `${hw.className}\nموعد: ${hw.due}\nتحویل‌ها: ${hw.submissions}\nوضعیت: ${teacherHomeworkStatusLabel[hw.status]}`, action: 'بستن', done: 'جزئیات مورد نمایش داده شد.' })}
                          >
                            جزئیات
                          </button>
                          <button type="button" className="btn btn-primary" onClick={() => toggleTeacherHomeworkStatus(hw.id)}>
                            تغییر وضعیت
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="card portal-empty-state" role="status">
                    <strong>موردی با این فیلتر پیدا نشد</strong>
                    <p>عبارت جستجو یا فیلتر وضعیت را تغییر دهید.</p>
                  </div>
                )
              ) : (
                <div className="card portal-empty-state" role="status">
                  <strong>تکلیف یا محتوایی ثبت نشده است</strong>
                  <p>برای شروع، یک تکلیف یا محتوای آموزشی جدید اضافه کنید.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'teacher-messages' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">پیام‌ها</span>
                <h2>پیام‌ها و ارتباطات آموزشی</h2>
                <p>پیام‌های مدیر، معاون و اولیا را مشاهده و پاسخ دهید (نمونه).</p>
              </div>
              <div className="portal-mini-stats">
                <div className="portal-mini-stat card"><span>کل پیام‌ها</span><strong>{teacherMessages.length}</strong></div>
                <div className="portal-mini-stat card"><span>خوانده‌نشده</span><strong>{teacherUnreadMessagesCount}</strong></div>
                <div className="portal-mini-stat card"><span>پاسخ‌داده/خوانده</span><strong>{teacherMessages.length - teacherUnreadMessagesCount}</strong></div>
              </div>
              <div className="portal-toolbar">
                <input className="portal-input" type="search" aria-label="جستجو در پیام‌های دبیر" placeholder="جستجو در پیام‌ها..." value={teacherMessagesQuery} onChange={(e) => setTeacherMessagesQuery(e.target.value)} />
              </div>
              {teacherMessages.length ? (
                filteredTeacherMessages.length ? (
                  <div className="portal-list">
                    {filteredTeacherMessages.map((msg) => (
                      <article key={msg.id} className={`card portal-list-item ${!msg.read ? 'is-unread' : ''}`}>
                        <div className="portal-list-main">
                          <div className="portal-list-head">
                            <h3>{msg.title}</h3>
                            <span className={`portal-status ${msg.read ? 'submitted' : 'pending'}`}>{msg.read ? 'خوانده شده' : 'جدید'}</span>
                          </div>
                          <p className="portal-item-meta">{msg.from} • {msg.date}</p>
                          <p className="portal-item-note">{msg.body}</p>
                        </div>
                        <div className="portal-list-actions">
                          <button type="button" className="btn btn-secondary" onClick={() => openTeacherMessage(msg)}>مشاهده</button>
                          <button type="button" className="btn btn-primary" onClick={() => replyTeacherMessage(msg)}>پاسخ</button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="card portal-empty-state" role="status">
                    <strong>موردی با این جستجو پیدا نشد</strong>
                    <p>عبارت جستجو را تغییر دهید.</p>
                  </div>
                )
              ) : (
                <div className="card portal-empty-state" role="status">
                  <strong>پیامی برای نمایش وجود ندارد</strong>
                  <p>پیام‌ها و ارتباطات جدید در این بخش نمایش داده می‌شوند.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'admin-students' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">مدیریت دانش‌آموزان</span>
                <h2>دانش‌آموزان مدرسه</h2>
                <p>مشاهده، ثبت و ویرایش اطلاعات پایه دانش‌آموزان (نمونه).</p>
              </div>
              <div className="portal-mini-stats">
                <div className="portal-mini-stat card"><span>کل دانش‌آموزان</span><strong>{adminStudents.length}</strong></div>
                <div className="portal-mini-stat card"><span>فعال</span><strong>{adminActiveStudentsCount}</strong></div>
                <div className="portal-mini-stat card"><span>مرخصی/انتقالی</span><strong>{adminStudents.length - adminActiveStudentsCount}</strong></div>
              </div>
              <div className="portal-section-toolbar">
                <button type="button" className="btn btn-primary" onClick={addAdminStudent}>ثبت دانش‌آموز جدید</button>
              </div>
              <div className="portal-toolbar">
                <input className="portal-input" type="search" aria-label="جستجو در دانش‌آموزان" placeholder="جستجو (نام، کلاس، تماس)..." value={adminStudentsQuery} onChange={(e) => setAdminStudentsQuery(e.target.value)} />
                <select className="portal-select" aria-label="فیلتر وضعیت دانش‌آموزان" value={adminStudentsFilter} onChange={(e) => setAdminStudentsFilter(e.target.value)}>
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="active">فعال</option>
                  <option value="leave">مرخصی</option>
                  <option value="transferred">انتقالی</option>
                </select>
              </div>
              {adminStudents.length ? (
                filteredAdminStudents.length ? (
                  <div className="card portal-table-card">
                    <div className="portal-table-wrap">
                      <table className="portal-table">
                        <thead>
                          <tr>
                            <th>نام دانش‌آموز</th>
                            <th>کلاس</th>
                            <th>میانگین</th>
                            <th>تماس</th>
                            <th>وضعیت</th>
                            <th>عملیات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAdminStudents.map((s) => (
                            <tr key={s.id}>
                              <td>{s.name}</td>
                              <td>{s.className}</td>
                              <td><strong>{s.average}</strong></td>
                              <td>{s.contact}</td>
                              <td>
                                <span className={`portal-badge-status ${s.status === 'active' ? 'good' : s.status === 'leave' ? 'warn' : 'danger'}`}>
                                  {adminStudentStatusLabel[s.status]}
                                </span>
                              </td>
                              <td>
                                <div className="portal-inline-actions">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => openModal({ title: s.name, desc: `کلاس: ${s.className}\nمیانگین: ${s.average}\nتماس: ${s.contact}\nوضعیت: ${adminStudentStatusLabel[s.status]}`, action: 'بستن', done: 'جزئیات دانش‌آموز نمایش داده شد.' })}
                                  >
                                    جزئیات
                                  </button>
                                  <button type="button" className="btn btn-secondary" onClick={() => editAdminStudent(s)}>ویرایش</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="card portal-empty-state" role="status">
                    <strong>موردی با این فیلتر پیدا نشد</strong>
                    <p>عبارت جستجو یا فیلتر وضعیت را تغییر دهید.</p>
                  </div>
                )
              ) : (
                <div className="card portal-empty-state" role="status">
                  <strong>هنوز دانش‌آموزی ثبت نشده است</strong>
                  <p>برای شروع، با دکمه «ثبت دانش‌آموز جدید» اطلاعات را وارد کنید.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'admin-classes' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">مدیریت کلاس‌ها</span>
                <h2>کلاس‌ها و برنامه‌ریزی</h2>
                <p>مدیریت کلاس‌ها، ظرفیت، معلم مسئول و برنامه کلی (نمونه).</p>
              </div>
              <div className="portal-mini-stats">
                <div className="portal-mini-stat card"><span>کل کلاس‌ها</span><strong>{adminClasses.length}</strong></div>
                <div className="portal-mini-stat card"><span>کلاس‌های فعال</span><strong>{adminClasses.filter((c) => c.status === 'active').length}</strong></div>
                <div className="portal-mini-stat card"><span>جمع دانش‌آموزان</span><strong>{adminClasses.reduce((sum, c) => sum + c.students, 0)}</strong></div>
              </div>
              <div className="portal-section-toolbar">
                <button type="button" className="btn btn-primary" onClick={addAdminClass}>افزودن کلاس جدید</button>
              </div>
              <div className="portal-toolbar">
                <input className="portal-input" type="search" aria-label="جستجو در کلاس‌ها" placeholder="جستجو (نام کلاس، پایه، معلم)..." value={adminClassesQuery} onChange={(e) => setAdminClassesQuery(e.target.value)} />
              </div>
              {adminClasses.length ? (
                filteredAdminClasses.length ? (
                  <div className="portal-list">
                    {filteredAdminClasses.map((cls) => (
                      <article key={cls.id} className="card portal-list-item">
                        <div className="portal-list-main">
                          <div className="portal-list-head">
                            <h3>{cls.name}</h3>
                            <span className={`portal-badge-status ${cls.status === 'active' ? 'good' : 'warn'}`}>{cls.status === 'active' ? 'فعال' : 'غیرفعال'}</span>
                          </div>
                          <p className="portal-item-meta">{cls.grade} • معلم مسئول: {cls.teacher} • ظرفیت/اعضا: {cls.students} نفر</p>
                          <p className="portal-item-note">برنامه: {cls.schedule}</p>
                        </div>
                        <div className="portal-list-actions">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => openModal({ title: cls.name, desc: `${cls.grade}\nمعلم مسئول: ${cls.teacher}\nتعداد دانش‌آموزان: ${cls.students}\nبرنامه: ${cls.schedule}`, action: 'بستن', done: 'جزئیات کلاس نمایش داده شد.' })}
                          >
                            جزئیات
                          </button>
                          <button type="button" className="btn btn-primary" onClick={() => editAdminClass(cls)}>ویرایش</button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="card portal-empty-state" role="status">
                    <strong>موردی با این جستجو پیدا نشد</strong>
                    <p>عبارت جستجو را تغییر دهید.</p>
                  </div>
                )
              ) : (
                <div className="card portal-empty-state" role="status">
                  <strong>هنوز کلاسی ثبت نشده است</strong>
                  <p>برای ایجاد کلاس جدید از دکمه «افزودن کلاس جدید» استفاده کنید.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'admin-announcements' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">اعلان‌ها</span>
                <h2>مدیریت اعلان‌ها و اطلاع‌رسانی</h2>
                <p>ایجاد، بررسی و ارسال اعلان‌های مدرسه (نمونه).</p>
              </div>
              <div className="portal-mini-stats">
                <div className="portal-mini-stat card"><span>کل اعلان‌ها</span><strong>{adminAnnouncements.length}</strong></div>
                <div className="portal-mini-stat card"><span>ارسال‌شده</span><strong>{adminAnnouncements.length - adminDraftAnnouncementsCount}</strong></div>
                <div className="portal-mini-stat card"><span>پیش‌نویس</span><strong>{adminDraftAnnouncementsCount}</strong></div>
              </div>
              <div className="portal-section-toolbar">
                <button type="button" className="btn btn-primary" onClick={addAdminAnnouncement}>ایجاد اعلان جدید</button>
              </div>
              <div className="portal-toolbar">
                <input className="portal-input" type="search" aria-label="جستجو در اعلان‌ها" placeholder="جستجو در اعلان‌ها..." value={adminAnnouncementsQuery} onChange={(e) => setAdminAnnouncementsQuery(e.target.value)} />
                <select className="portal-select" aria-label="فیلتر وضعیت اعلان‌ها" value={adminAnnouncementsFilter} onChange={(e) => setAdminAnnouncementsFilter(e.target.value)}>
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="sent">ارسال شده</option>
                  <option value="draft">پیش‌نویس</option>
                </select>
              </div>
              {adminAnnouncements.length ? (
                filteredAdminAnnouncements.length ? (
                  <div className="portal-list">
                    {filteredAdminAnnouncements.map((a) => (
                      <article key={a.id} className={`card portal-list-item ${a.status === 'draft' ? 'is-unread' : ''}`}>
                        <div className="portal-list-main">
                          <div className="portal-list-head">
                            <h3>{a.title}</h3>
                            <span className={`portal-status ${a.status === 'sent' ? 'submitted' : 'pending'}`}>{adminAnnouncementStatusLabel[a.status]}</span>
                          </div>
                          <p className="portal-item-meta">مخاطب: {a.audience} • تاریخ: {a.date}</p>
                          <p className="portal-item-note">{a.body}</p>
                        </div>
                        <div className="portal-list-actions">
                          <button type="button" className="btn btn-secondary" onClick={() => openAdminAnnouncement(a)}>مشاهده</button>
                          {a.status === 'draft' ? (
                            <button type="button" className="btn btn-primary" onClick={() => sendAdminAnnouncement(a.id)}>ارسال اعلان</button>
                          ) : (
                            <button type="button" className="btn btn-primary" disabled>ارسال شده</button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="card portal-empty-state" role="status">
                    <strong>موردی با این فیلتر پیدا نشد</strong>
                    <p>عبارت جستجو یا فیلتر وضعیت را تغییر دهید.</p>
                  </div>
                )
              ) : (
                <div className="card portal-empty-state" role="status">
                  <strong>اعلانی ثبت نشده است</strong>
                  <p>برای اطلاع‌رسانی، یک اعلان جدید ایجاد کنید.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'admin-reports' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">گزارش‌ها</span>
                <h2>گزارش‌گیری و بررسی عملکرد</h2>
                <p>گزارش‌های مدیریتی، آموزشی و حضور و غیاب را مشاهده کنید (نمونه).</p>
              </div>
              <div className="portal-mini-stats">
                <div className="portal-mini-stat card"><span>کل گزارش‌ها</span><strong>{adminReports.length}</strong></div>
                <div className="portal-mini-stat card"><span>آماده</span><strong>{adminReadyReportsCount}</strong></div>
                <div className="portal-mini-stat card"><span>در حال تهیه</span><strong>{adminReports.length - adminReadyReportsCount}</strong></div>
              </div>
              <div className="portal-toolbar">
                <input className="portal-input" type="search" aria-label="جستجو در گزارش‌ها" placeholder="جستجو در گزارش‌ها..." value={adminReportsQuery} onChange={(e) => setAdminReportsQuery(e.target.value)} />
                <select className="portal-select" aria-label="فیلتر وضعیت گزارش‌ها" value={adminReportsFilter} onChange={(e) => setAdminReportsFilter(e.target.value)}>
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="ready">آماده</option>
                  <option value="in-progress">در حال تهیه</option>
                </select>
              </div>
              {adminReports.length ? (
                filteredAdminReports.length ? (
                  <div className="portal-list">
                    {filteredAdminReports.map((r) => (
                      <article key={r.id} className="card portal-list-item">
                        <div className="portal-list-main">
                          <div className="portal-list-head">
                            <h3>{r.title}</h3>
                            <span className={`portal-badge-status ${r.status === 'ready' ? 'good' : 'warn'}`}>{adminReportStatusLabel[r.status]}</span>
                          </div>
                          <p className="portal-item-meta">نوع: {r.type} • بازه: {r.period}</p>
                          <p className="portal-item-note">{r.summary}</p>
                        </div>
                        <div className="portal-list-actions">
                          <button type="button" className="btn btn-secondary" onClick={() => openAdminReport(r)}>مشاهده جزئیات</button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => notify(r.status === 'ready' ? 'گزارش آماده مشاهده/دریافت است (نمونه).' : 'گزارش هنوز در حال تهیه است (نمونه).')}
                          >
                            {r.status === 'ready' ? 'مشاهده گزارش' : 'در حال تهیه'}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="card portal-empty-state" role="status">
                    <strong>موردی با این فیلتر پیدا نشد</strong>
                    <p>عبارت جستجو یا فیلتر وضعیت را تغییر دهید.</p>
                  </div>
                )
              ) : (
                <div className="card portal-empty-state" role="status">
                  <strong>گزارشی برای نمایش وجود ندارد</strong>
                  <p>پس از تهیه گزارش‌ها، در این بخش قابل مشاهده خواهند بود.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'profile' && (
          <section className="section portal-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">پروفایل و تنظیمات</span>
                <h2>اطلاعات حساب و تنظیمات (نمونه)</h2>
                <p>مدیریت اطلاعات نمایشی حساب و تنظیمات پایه پنل. این بخش فعلاً نمونه است و پس از اتصال بک‌اند کامل می‌شود.</p>
              </div>
              <div className="portal-profile-grid">
                <div className="card portal-profile-card">
                  <h3>اطلاعات حساب</h3>
                  <div className="portal-profile-list">
                    <div className="portal-profile-row"><span>نام نمایشی</span><strong>{profileInfo.name}</strong></div>
                    <div className="portal-profile-row"><span>نقش</span><strong>{profileInfo.roleLabel}</strong></div>
                    <div className="portal-profile-row"><span>شناسه کاربری</span><strong>{profileInfo.id}</strong></div>
                    <div className="portal-profile-row"><span>تماس/ایمیل</span><strong>{profileInfo.contact}</strong></div>
                    <div className="portal-profile-row"><span>بخش/واحد</span><strong>{profileInfo.org}</strong></div>
                  </div>
                </div>
                <div className="card portal-profile-card">
                  <h3>تنظیمات پنل (نمونه)</h3>
                  <div className="portal-settings-list">
                    <div className="portal-setting-item">
                      <div><span>اعلان‌های مهم</span><small>دریافت اعلان‌های مربوط به فعالیت‌های پنل</small></div>
                      <span className="portal-setting-badge">فعال</span>
                    </div>
                    <div className="portal-setting-item">
                      <div><span>نمایش خلاصه وضعیت</span><small>نمایش کارت‌های خلاصه در داشبورد</small></div>
                      <span className="portal-setting-badge">فعال</span>
                    </div>
                    <div className="portal-setting-item">
                      <div><span>حالت نمایش موبایل</span><small>بهینه‌سازی خودکار برای صفحه‌های کوچک</small></div>
                      <span className="portal-setting-badge">خودکار</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '.9rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-primary" onClick={() => notify('ویرایش پروفایل در نسخه بعدی فعال می‌شود (نمونه).')}>ویرایش پروفایل</button>
                    <button type="button" className="btn btn-secondary" onClick={() => notify('تنظیمات ذخیره شد (نمونه).')}>ذخیره تنظیمات</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

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

      <div className="portal-toast-region" role="status" aria-live="polite" aria-atomic="true">
        {toast && <div className="portal-toast">{toast}</div>}
      </div>

      {modal && (
        <div className="portal-modal-backdrop" onClick={closeModal} role="presentation">
          <div
            ref={modalRef}
            className={`portal-modal ${modal.schedule ? 'portal-modal-schedule' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="portal-modal-title"
            aria-describedby={modalError ? 'portal-modal-error' : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="portal-modal-title">{modal.title}</h3>
            {modal.desc && <p className="portal-modal-desc">{modal.desc}</p>}
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
            {Array.isArray(modal.fields) && modal.fields.length > 0 ? (
              <div className="portal-modal-fields">
                {modal.fields.map((f) => (
                  <label key={f.name} className="portal-modal-field">
                    <span>{f.label}{f.required !== false ? ' *' : ''}</span>
                    {f.type === 'textarea' ? (
                      <textarea
                        value={formValues[f.name] ?? ''}
                        onChange={(e) => { setFormValues((v) => ({ ...v, [f.name]: e.target.value })); if (modalError) setModalError('') }}
                        placeholder={f.placeholder || f.label}
                        rows={f.rows || 4}
                        aria-invalid={!!modalError}
                        aria-describedby={modalError ? 'portal-modal-error' : undefined}
                      />
                    ) : f.type === 'select' ? (
                      <select
                        value={formValues[f.name] ?? ''}
                        onChange={(e) => { setFormValues((v) => ({ ...v, [f.name]: e.target.value })); if (modalError) setModalError('') }}
                        aria-invalid={!!modalError}
                        aria-describedby={modalError ? 'portal-modal-error' : undefined}
                      >
                        {(f.options || []).map((opt) => (
                          <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type || 'text'}
                        value={formValues[f.name] ?? ''}
                        onChange={(e) => { setFormValues((v) => ({ ...v, [f.name]: e.target.value })); if (modalError) setModalError('') }}
                        placeholder={f.placeholder || f.label}
                        aria-invalid={!!modalError}
                        aria-describedby={modalError ? 'portal-modal-error' : undefined}
                      />
                    )}
                  </label>
                ))}
              </div>
            ) : modal.field ? (
              <label className="portal-modal-field">
                <span>{modal.field}</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); if (modalError) setModalError('') }}
                  placeholder={modal.field}
                  aria-invalid={!!modalError}
                  aria-describedby={modalError ? 'portal-modal-error' : undefined}
                />
              </label>
            ) : null}
            {modalError && <p id="portal-modal-error" className="portal-modal-error" role="alert">{modalError}</p>}
            <div className="portal-modal-actions">
              <button type="button" className="btn btn-primary" onClick={confirmModal} title={modal.actionTitle || modal.action}>{modal.action || 'تأیید'}</button>
              <button type="button" className="btn btn-secondary" onClick={closeModal} title={modal.cancelAction || 'انصراف'}>{modal.cancelAction || 'انصراف'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
