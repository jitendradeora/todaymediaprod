export interface Video {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
  views: string;
  category: string;
  youtubeUrl?: string;
}

export const videos: Video[] = [
  {
    id: 1,
    title: 'تقرير مصور: جولة في أكبر معرض تكنولوجي بالمنطقة',
    thumbnail: 'https://images.unsplash.com/photo-1497015289639-54688650d173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHByb2R1Y3Rpb258ZW58MXx8fHwxNzYxMjQwNjc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '5:30',
    date: 'منذ ساعة',
    views: '15,234',
    category: 'تكنولوجيا'
  },
  {
    id: 2,
    title: 'لقاء خاص: وزير الاقتصاد يتحدث عن خطط التنمية',
    thumbnail: 'https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzYxMjA0NTE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '12:45',
    date: 'منذ ساعتين',
    views: '28,421',
    category: 'اقتصاد'
  },
  {
    id: 3,
    title: 'أهداف مباراة المنتخب الوطني',
    thumbnail: 'https://images.unsplash.com/photo-1668068873075-cf3e9925eae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmb290YmFsbHxlbnwxfHx8fDE3NjEyMzY2Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '3:20',
    date: 'منذ 3 ساعات',
    views: '45,678',
    category: 'رياضة'
  },
  {
    id: 4,
    title: 'تغطية مباشرة: القمة العربية الاستثنائية',
    thumbnail: 'https://images.unsplash.com/photo-1672762232115-0b8b1adb8509?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBlYXN0JTIwbmV3c3xlbnwxfHx8fDE3NjEyMzY2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '8:15',
    date: 'منذ 4 ساعات',
    views: '52,341',
    category: 'سياسة'
  },
  {
    id: 5,
    title: 'فيديو: أبرز لحظات مهرجان السينما العربية',
    thumbnail: 'https://images.unsplash.com/photo-1760582912320-79fcbc9f309b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YXJpZXR5JTIwZW50ZXJ0YWlubWVudHxlbnwxfHx8fDE3NjEyNDY2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '6:40',
    date: 'منذ 5 ساعات',
    views: '18,923',
    category: 'منوعات'
  },
  {
    id: 6,
    title: 'نصائح صحية: كيف تحافظ على صحتك في فصل الشتاء',
    thumbnail: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjB3ZWxsbmVzc3xlbnwxfHx8fDE3NjExNTkwNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '4:55',
    date: 'منذ 6 ساعات',
    views: '12,456',
    category: 'صحة'
  },
];
