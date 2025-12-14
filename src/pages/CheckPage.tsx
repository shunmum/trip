import { useState } from 'react';
import { Package, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { mockPackingList } from '../data/mockData';
import { UserAvatar } from '../components/UserAvatar';
import { cn } from '../lib/utils';
import { useTrip } from '../context/TripContext';
import type { PackingItem } from '../types';

type TabType = string; // Now just string, including 'common', 'extra', and member names

export function CheckPage() {
  const { members } = useTrip();
  // Normalize mock data to match new type if needed, or assume it's compatible enough for initial load
  // We might need to cast or map if mockData is strictly typed to old User
  const [items, setItems] = useState<PackingItem[]>(mockPackingList as PackingItem[]);
  const [activeTab, setActiveTab] = useState<TabType>('common');
  const [newItemText, setNewItemText] = useState('');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'common', label: '共有' },
    ...members.map(m => ({ id: m, label: m })),
    { id: 'extra', label: '追加' },
  ];

  const filteredItems = items.filter(item => {
    if (activeTab === 'common') return item.assignedTo === 'common';
    if (activeTab === 'extra') return item.assignedTo === 'extra';
    return item.assignedTo === activeTab;
  });

  const handleToggle = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: PackingItem = {
      id: Math.random().toString(),
      item: newItemText,
      assignedTo: activeTab,
      checked: false,
    };

    setItems([...items, newItem]);
    setNewItemText('');
  };

  return (
    <div className="p-4 space-y-6 pb-24 h-full">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">旅のしおり</h2>
        <p className="text-sm text-gray-600 mt-1">持ち物リストを管理しましょう</p>
      </div>

      {/* Packing List Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-180px)]">

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-4 text-sm font-bold border-b-2 transition-colors min-w-[80px]",
                activeTab === tab.id
                  ? "border-primary-600 text-primary-600 bg-primary-50/30"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              アイテムがありません
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
              >
                <button
                  onClick={() => handleToggle(item.id)}
                  className={cn(
                    "shrink-0 transition-colors",
                    item.checked ? "text-primary-500" : "text-gray-300 hover:text-gray-400"
                  )}
                >
                  {item.checked ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                </button>

                <span
                  className={cn(
                    'flex-1 text-gray-800 font-medium transition-opacity',
                    item.checked && 'line-through text-gray-400 opacity-50'
                  )}
                >
                  {item.item}
                </span>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Item Input */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={`${tabs.find(t => t.id === activeTab)?.label}リストに追加...`}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <button
              type="submit"
              disabled={!newItemText.trim()}
              className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </div>

      </section>
    </div>
  );
}
