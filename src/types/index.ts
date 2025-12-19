export type User = string;

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string; // 'pdf' | 'image' | etc.
}

export interface ScrapItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  addedBy: User;
  addedAt: Date;
  imageUrl?: string;
  siteName?: string;
  wantToGo: boolean;
}

export interface Spot {
  id: string;
  name: string;
  category: string;
  status: 'planned' | 'booked';
  addedBy: User;
  lat?: number;
  lng?: number;
}

export interface PackingItem {
  id: string;
  item: string;
  assignedTo: User | 'common' | 'extra';
  checked: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  description: string;
  day: number;
  location?: string;
  link?: string;
  address?: string;
  image?: string;
  budget?: number;
  attachments?: Attachment[];
}

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface Trip {
  id: string;
  title: string;
  date: Date;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  thumbnail: string; // URL to image
  description?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  paidBy: string; // Changed from User to string
  items?: string[];
  receiptUrl?: string; // Optional URL for the receipt image
  date: Date;
  shopName?: string;
}
