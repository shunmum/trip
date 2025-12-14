
import { useState } from 'react';
import { Plus, ExternalLink, Bookmark, Heart, MapPin, Grid, Coffee, Bed, Camera, X, Trash2, Link as LinkIcon } from 'lucide-react';
import { mockScrapItems } from '../data/mockData';
import { UserAvatar } from '../components/UserAvatar';
import { cn } from '../lib/utils';
import type { ScrapItem } from '../types';

export function ScrapPage() {
    const [activeTab, setActiveTab] = useState('All');
    const [items, setItems] = useState<ScrapItem[]>(mockScrapItems);
    const [urlInput, setUrlInput] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ScrapItem | null>(null);

    const tabs = [
        { id: 'All', label: 'すべて', icon: Grid },
        { id: 'カフェ', label: 'グルメ', icon: Coffee },
        { id: '観光', label: '観光', icon: Camera },
        { id: 'ホテル', label: 'ホテル', icon: Bed },
    ];

    const categories = tabs.filter(t => t.id !== 'All');

    const filteredItems = activeTab === 'All'
        ? items
        : items.filter(item => item.category === activeTab);

    const handleToggleWantToGo = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setItems(items.map(item =>
            item.id === id ? { ...item, wantToGo: !item.wantToGo } : item
        ));
    };

    // Start creating a new scrap
    const handleStartAdd = (initialUrl: string = '') => {
        // Create a temporary item for the modal
        const newItem: ScrapItem = {
            id: Math.random().toString(), // Temp ID
            title: initialUrl ? 'New Scrap' : '',
            url: initialUrl,
            description: '',
            category: 'その他',
            addedBy: 'UserA',
            addedAt: new Date(),
            imageUrl: initialUrl
                ? 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800'
                : undefined,
            siteName: initialUrl ? new URL(initialUrl).hostname : '',
            wantToGo: false
        };

        setEditingItem(newItem);
        setIsModalOpen(true);
    };

    // Open existing scrap form
    const handleOpenItem = (item: ScrapItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    // Save (Create or Update)
    const handleSave = () => {
        if (!editingItem) return;

        const existingIndex = items.findIndex(i => i.id === editingItem.id);
        if (existingIndex >= 0) {
            // Update
            const newItems = [...items];
            newItems[existingIndex] = editingItem;
            setItems(newItems);
        } else {
            // Create
            setItems([editingItem, ...items]);
            setUrlInput('');
        }
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleDelete = () => {
        if (!editingItem) return;
        setItems(items.filter(i => i.id !== editingItem.id));
        setIsModalOpen(false);
        setEditingItem(null);
    };

    return (
        <div className="h-full bg-white overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
                {/* Page Header */}
                <div className="mb-8 pb-4 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            <span className="text-3xl">🧩</span> Scrap
                        </h2>
                        <p className="text-gray-500 mt-2">気になった記事やお店をとりあえず放り込む場所</p>
                    </div>
                    <button
                        onClick={() => handleStartAdd('')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-gray-200"
                    >
                        <Plus className="w-4 h-4" />
                        新規作成
                    </button>
                </div>

                {/* Input & Filter Area */}
                <div className="mb-8 space-y-6">
                    {/* URL Input */}
                    <div className="relative group">
                        <input
                            type="text"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="URLを貼り付けて保存..."
                            className="w-full pl-5 pr-20 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-gray-800 transition-all focus:outline-none focus:ring-4 focus:ring-gray-100 placeholder-gray-400 shadow-sm"
                        />
                        <button
                            onClick={() => handleStartAdd(urlInput)}
                            className="absolute right-2 top-2 bottom-2 bg-black hover:bg-gray-800 text-white px-4 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" />
                            保存
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium border",
                                        isActive
                                            ? "bg-black text-white border-black shadow-md"
                                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Scrap Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleOpenItem(item)}
                            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col items-stretch cursor-pointer hover:border-gray-300"
                        >
                            {/* Visual Header (OGP-like) */}
                            <div className="h-48 overflow-hidden relative bg-gray-100">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300">
                                        <Bookmark className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {item.category && (
                                        <span className="backdrop-blur-md bg-black/50 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                                            {item.category}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    {item.siteName && (
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                                            {item.siteName}
                                        </span>
                                    )}
                                    <span className="text-gray-300">•</span>
                                    <span className="text-[10px] text-gray-400">
                                        {item.addedAt.toLocaleDateString('ja-JP')} added
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-primary-600 transition-colors">
                                    <span className="hover:underline">
                                        {item.title}
                                    </span>
                                </h3>

                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                                    {item.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <UserAvatar user={item.addedBy} size="sm" />
                                        <span className="text-xs text-gray-400 font-medium">by {item.addedBy}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleToggleWantToGo(item.id, e)}
                                            className={cn(
                                                "p-2 rounded-full transition-colors flex items-center gap-1.5 text-xs font-bold",
                                                item.wantToGo
                                                    ? "bg-rose-50 text-rose-600"
                                                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                            )}
                                        >
                                            <Heart className={cn("w-4 h-4", item.wantToGo && "fill-rose-600")} />
                                            {item.wantToGo ? "Want!" : "Like"}
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Add to plan logic
                                            }}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                                            title="プランに追加"
                                        >
                                            <MapPin className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Bookmark className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">このカテゴリーのスクラップはありません</p>
                    </div>
                )}
            </div>

            {/* Edit/Add Modal */}
            {isModalOpen && editingItem && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div
                        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header / Image Preview */}
                        <div className="h-40 bg-gray-100 relative group">
                            {editingItem.imageUrl ? (
                                <img src={editingItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                    {editingItem.url ? (
                                        <div className="text-center">
                                            <Bookmark className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <span className="text-xs font-medium">No Image</span>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <span className="text-xs font-medium">New Scrap</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="bg-white/90 text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-white">
                                    画像を変更
                                </button>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">タイトル</label>
                                <input
                                    type="text"
                                    value={editingItem.title}
                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                    className="w-full text-lg font-bold text-gray-900 border-none p-0 focus:ring-0 placeholder-gray-300"
                                    placeholder="タイトルを入力"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">カテゴリー</label>
                                <div className="flex gap-2 flex-wrap">
                                    {categories.map(cat => {
                                        const Icon = cat.icon;
                                        const isSelected = editingItem.category === cat.id;
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setEditingItem({ ...editingItem, category: cat.id })}
                                                className={cn(
                                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                                    isSelected
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                                                )}
                                            >
                                                <Icon className="w-3 h-3" />
                                                {cat.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">メモ</label>
                                <textarea
                                    value={editingItem.description}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-gray-50 rounded-lg border-transparent focus:border-gray-300 focus:bg-white focus:ring-0 text-sm leading-relaxed p-3"
                                    placeholder="気になったポイントやメモを入力..."
                                />
                            </div>

                            {/* Link Info (Editable) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">URL / リンク</label>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 focus-within:ring-2 focus-within:ring-black focus-within:bg-white transition-all">
                                    <div className="p-2 bg-white rounded border border-gray-100 text-blue-600">
                                        <LinkIcon className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={editingItem.url}
                                        onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                                        className="flex-1 bg-transparent border-none text-sm p-1 focus:ring-0 text-gray-700 placeholder-gray-400"
                                        placeholder="https://example.com..."
                                    />
                                    {editingItem.url && (
                                        <a href={editingItem.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-600 p-2">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            <button
                                onClick={handleDelete}
                                className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 text-xs font-bold"
                            >
                                <Trash2 className="w-4 h-4" />
                                削除
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-black text-white text-sm font-bold rounded-lg shadow-lg hover:bg-gray-800 transform active:scale-95 transition-all"
                                >
                                    保存する
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

