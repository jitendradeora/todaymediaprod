'use client';

import { useEffect, useState } from 'react';

export function CurrentDate() {
  const [date, setDate] = useState('');

  useEffect(() => {
    // Arabic day names
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    // Arabic month names
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const now = new Date();
    const dayName = dayNames[now.getDay()];
    const day = now.getDate();
    const monthName = monthNames[now.getMonth()];
    const year = now.getFullYear();

    setDate(`${dayName} ${day} ${monthName} ${year}`);
  }, []);

  return <span className="text-sm">{date}</span>;
}
