import type { Trip } from '../types';

export const trips: Trip[] = [
    {
        id: '1',
        title: '金沢のアート旅',
        date: '2025-01-15',
        location: {
            lat: 36.5613,
            lng: 136.6562,
            name: 'Kanazawa',
        },
        photos: [
            'https://images.unsplash.com/photo-1542051841857-5f90071e7989', // Kanazawa Kenrokuen
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', // 21st Century Museum style
        ],
        description: '美術館の現代アート展がとても良かった。特に最後の展示室の作品が印象的でした。',
    },
    {
        id: '2',
        title: '沖縄リゾート',
        date: '2024-08-10',
        location: {
            lat: 26.2124,
            lng: 127.6809,
            name: 'Okinawa',
        },
        photos: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // Okinawa Beach
            'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1', // Resort
        ],
        description: 'カフェのパンケーキが絶品！また来たいね。ホテルからの景色も最高だった。',
    },
    {
        id: '3',
        title: 'パリ旅行',
        date: '2023-12-25',
        location: {
            lat: 48.8566,
            lng: 2.3522,
            name: 'Paris',
        },
        photos: [
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', // Eiffel Tower
            'https://images.unsplash.com/photo-1504198458649-3128b932f49e', // Croissants
        ],
        description: 'クリスマスのシャンゼリゼ通りは本当に綺麗だった。寒かったけど楽しかった！',
    },
];
