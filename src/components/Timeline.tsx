import type { ScheduleItem } from '../types';
import { Clock, MapPin } from 'lucide-react';

interface TimelineProps {
  items: ScheduleItem[];
  onItemClick?: (item: ScheduleItem) => void;
}

export function Timeline({ items, onItemClick }: TimelineProps) {
  // Sort items by time just in case
  const sortedItems = [...items].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="relative pl-8 space-y-8 my-8">
      {/* Vertical Line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gray-200" />

      {sortedItems.map((item) => (
        <div key={item.id} className="relative">
          {/* Dot on the line */}
          <div className="absolute -left-[29px] mt-1.5 w-6 h-6 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center z-10 shadow-sm" />

          {/* Time */}
          <div className="absolute -left-28 mt-1 w-20 text-right text-sm font-mono text-gray-500">
            {item.time}
          </div>

          {/* Card Content (Notion-like block) */}
          <div
            onClick={() => onItemClick?.(item)}
            className="group relative bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer"
          >
            {/* Title */}
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <h3 className="text-base font-semibold text-gray-800 group-hover:text-black">
                {item.title}
              </h3>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-gray-600 pl-6 leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Location */}
            {item.location && (
              <div className="flex items-center gap-1.5 mt-3 pl-6 text-xs text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{item.location}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
