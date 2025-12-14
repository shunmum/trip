import type { Trip } from '../types';

export const pastTrips: Trip[] = [
    {
        id: '1',
        title: 'Winter Trip to Sapporo',
        date: new Date('2025-01-15'),
        location: {
            lat: 43.0618,
            lng: 141.3545,
            name: 'Sapporo',
        },
        thumbnail: 'https://images.unsplash.com/photo-1548268770-66e851c27271?auto=format&fit=crop&q=80',
        description: 'Snow festival and delicious seafood.',
    },
    {
        id: '2',
        title: 'Summer in Okinawa',
        date: new Date('2024-08-10'),
        location: {
            lat: 26.2124,
            lng: 127.6809,
            name: 'Naha',
        },
        thumbnail: 'https://images.unsplash.com/photo-1542385317-268e2182d33c?auto=format&fit=crop&q=80',
        description: 'Beach resort and snorkeling.',
    },
    {
        id: '3',
        title: 'Kyoto Autumn Leaves',
        date: new Date('2023-12-25'),
        location: {
            lat: 35.0116,
            lng: 135.7681,
            name: 'Kyoto',
        },
        thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80',
        description: 'Visiting temples and seeing colorful leaves.',
    },
];
