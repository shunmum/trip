import type { ScrapItem, Spot, PackingItem, ScheduleItem, Trip, Expense } from '../types/index.ts';

export const mockScrapItems: ScrapItem[] = [
  {
    id: '1',
    title: 'おしゃれなカフェ「Café de Paris」',
    url: 'https://example.com/cafe',
    description: '朝食がおいしいと評判のカフェ。インスタ映えするパンケーキが人気で、コーヒーも自家焙煎でこだわっているそうです！',
    category: 'カフェ',
    addedBy: 'UserA',
    addedAt: new Date('2024-12-01'),
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    siteName: 'Tokyo Cafe Guide',
    wantToGo: true,
  },
  {
    id: '2',
    title: 'ホテル「シーサイドビュー」',
    url: 'https://example.com/hotel',
    description: 'オーシャンビューの部屋あり。温泉も併設されている。早めの予約がおすすめとのこと。',
    category: 'ホテル',
    addedBy: 'UserB',
    addedAt: new Date('2024-12-02'),
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    siteName: 'Travel.jp',
    wantToGo: false,
  },
  {
    id: '3',
    title: '美術館「モダンアート」',
    url: 'https://example.com/museum',
    description: '現代アートの企画展が開催中。月曜日は休館なので注意。チケットはオンラインで買うと少し安いらしい。',
    category: '観光',
    addedBy: 'UserA',
    addedAt: new Date('2024-12-03'),
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3969105?auto=format&fit=crop&q=80&w=800',
    siteName: 'Art Museum Official',
    wantToGo: true,
  },
];

export const mockSpots: Spot[] = [
  {
    id: '1',
    name: 'ホテル「シーサイドビュー」',
    category: 'ホテル',
    status: 'booked',
    addedBy: 'UserB',
  },
  {
    id: '2',
    name: 'Café de Paris',
    category: 'カフェ',
    status: 'planned',
    addedBy: 'UserA',
  },
  {
    id: '3',
    name: '美術館「モダンアート」',
    category: '観光',
    status: 'planned',
    addedBy: 'UserA',
  },
  {
    id: '4',
    name: 'イタリアンレストラン「La Pasta」',
    category: 'レストラン',
    status: 'booked',
    addedBy: 'UserB',
  },
];

export const mockPackingList: PackingItem[] = [
  {
    id: '1',
    item: 'パスポート',
    assignedTo: 'UserA',
    checked: true,
  },
  {
    id: '2',
    item: '充電器',
    assignedTo: 'UserB',
    checked: false,
  },
  {
    id: '3',
    item: '常備薬',
    assignedTo: 'UserA',
    checked: false,
  },
  {
    id: '4',
    item: 'カメラ',
    assignedTo: 'UserB',
    checked: true,
  },
  {
    id: '5',
    item: '日焼け止め',
    assignedTo: 'UserA',
    checked: false,
  },
];

export const mockSchedule: ScheduleItem[] = [
  {
    id: '1',
    time: '09:00',
    title: 'ホテル出発',
    description: 'チェックアウトを済ませて出発',
    location: 'ホテル「シーサイドビュー」',
    link: 'https://example.com/hotel',
    address: '〒123-4567 沖縄県那覇市1-2-3',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    day: 1,
  },
  {
    id: '2',
    time: '10:00',
    title: '美術館見学',
    description: '現代アートの企画展を鑑賞',
    location: '美術館「モダンアート」',
    link: 'https://example.com/museum',
    day: 1,
  },
  {
    id: '3',
    time: '12:30',
    title: 'ランチ',
    description: 'イタリアンレストランで食事',
    location: 'La Pasta',
    day: 1,
  },
  {
    id: '4',
    time: '15:00',
    title: 'カフェで休憩',
    description: 'パンケーキとコーヒーを楽しむ',
    location: 'Café de Paris',
    day: 1,
  },
  // Day 2
  {
    id: '5',
    time: '10:00',
    title: '海辺を散歩',
    description: '朝の静かな海を散歩',
    location: '海岸公園',
    day: 2,
  },
  {
    id: '6',
    time: '12:00',
    title: '海鮮丼ランチ',
    description: '地元の新鮮な魚介を楽しむ',
    location: '魚市場食堂',
    day: 2,
  },
  {
    id: '7',
    time: '14:00',
    title: 'お土産購入',
    description: '駅前でお土産を選ぶ',
    location: '駅前商店街',
    day: 2,
  },
];


export const tripDate = new Date('2025-01-15');



export const pastTrips: Trip[] = [
  {
    id: 't1',
    title: '京都・紅葉の旅',
    date: new Date('2023-11-20'),
    location: {
      lat: 35.0116,
      lng: 135.7681,
      name: '京都市',
    },
    thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
    description: '清水寺のライトアップが綺麗だった！',
  },
  {
    id: 't2',
    title: '沖縄・夏休み',
    date: new Date('2024-08-10'),
    location: {
      lat: 26.2124,
      lng: 127.6809,
      name: '那覇市',
    },
    thumbnail: 'https://images.unsplash.com/photo-1542038782586-18e92d6c7574?auto=format&fit=crop&q=80&w=800',
    description: '海が透き通っていて最高でした。',
  },
  {
    id: 't3',
    title: '福岡グルメ三昧',
    date: new Date('2023-05-20'),
    location: { lat: 33.5902, lng: 130.4017, name: 'Fukuoka' },
    thumbnail: 'https://images.unsplash.com/photo-1569624508492-ee19d2685959?auto=format&fit=crop&q=80&w=800',
    description: '博多ラーメンともつ鍋を食べる旅。屋台の雰囲気が最高でした。',
  },
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    amount: 5000,
    category: '食事',
    paidBy: 'UserA',
    items: ['特製ラーメン x2', '餃子セット', 'ビール'],
    date: new Date('2024-12-10'),
    shopName: '博多屋台 ごん太',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    amount: 12000,
    category: '宿泊',
    paidBy: 'UserB',
    items: ['ダブルルーム 1泊', '朝食ビュッフェ'],
    date: new Date('2024-12-10'),
    shopName: 'グランドホテル博多',
  },
  {
    id: '3',
    amount: 3200,
    category: '交通費',
    paidBy: 'UserA',
    items: ['タクシー運賃'],
    date: new Date('2024-12-11'),
    shopName: 'タクシー',
  },
];
