import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { mockSchedule, tripDate } from '../data/mockData';
import { UserAvatar } from '../components/UserAvatar';
import { Timeline } from '../components/Timeline';
import { ScheduleDetailsModal } from '../components/ScheduleDetailsModal';
import { cn } from '../lib/utils';
import type { ScheduleItem } from '../types';

export function PlanPage() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<ScheduleItem | null>(null);
  const [scheduleItems, setScheduleItems] = useState(mockSchedule);

  const formattedDate = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(tripDate);

  const filteredSchedule = scheduleItems.filter(item => item.day === selectedDay);

  // Helper to get date for a specific day (Day 1 = tripDate, Day 2 = tripDate + 1)
  const getDateForDay = (dayOffset: number) => {
    const date = new Date(tripDate);
    date.setDate(date.getDate() + (dayOffset - 1));
    return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' }).format(date);
  };

  const [isNewItem, setIsNewItem] = useState(false);

  const handleSaveScheduleItem = (updatedItem: ScheduleItem) => {
    if (isNewItem) {
      setScheduleItems(prev => [...prev, updatedItem].sort((a, b) => a.time.localeCompare(b.time)));
    } else {
      setScheduleItems(prevItems =>
        prevItems.map(item => item.id === updatedItem.id ? updatedItem : item)
      );
    }
    setSelectedScheduleItem(updatedItem);
    setIsNewItem(false); // Reset flag
  };

  const handleAddNewItem = () => {
    const newItem: ScheduleItem = {
      id: Math.random().toString(),
      time: '12:00',
      title: '',
      description: '',
      day: selectedDay,
      location: '',
      budget: 0,
    };
    setSelectedScheduleItem(newItem);
    setIsNewItem(true);
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Cover Image Placeholder (Notion style) */}
      <div className="h-48 w-full bg-gradient-to-b from-gray-100 to-white border-b border-gray-100 flex items-center justify-center group relative cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="text-gray-400 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm">カバー画像を追加</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 text-gray-500 mb-4 text-sm font-medium">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formattedDate}</span>
            <span>•</span>
            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">旅行計画</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-6">
            冬の温泉旅行プラン ♨️
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <UserAvatar user="UserA" size="sm" />
              <UserAvatar user="UserB" size="sm" />
            </div>
            <p className="text-gray-500 text-sm">2人が編集中</p>
          </div>
        </div>

        {/* Schedule Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              スケジュール
            </h2>
            <button
              onClick={handleAddNewItem}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> 予定を追加
            </button>
          </div>

          {/* Day Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-100">
            {[1, 2].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  selectedDay === day
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200"
                )}
              >
                Day {day} <span className="text-xs font-normal text-gray-400 ml-1">({getDateForDay(day)})</span>
              </button>
            ))}
            <button className="px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-t-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Timeline items={filteredSchedule} onItemClick={setSelectedScheduleItem} />
        </section>




      </div>

      <ScheduleDetailsModal
        item={selectedScheduleItem}
        onClose={() => {
          setSelectedScheduleItem(null);
          setIsNewItem(false);
        }}
        onSave={handleSaveScheduleItem}
        initialIsEditing={isNewItem}
      />
    </div>
  );
}
