import { useState, useEffect } from 'react';
import { X, Calendar, Users, Type, Save, Share } from 'lucide-react';
import { useTrip } from '../context/TripContext';

interface TripSettingsModalProps {
    onClose: () => void;
}

export function TripSettingsModal({ onClose }: TripSettingsModalProps) {
    const { tripTitle, tripDate, tripImage, members, setTripInfo } = useTrip();

    // Local state for editing form
    const [title, setTitle] = useState(tripTitle);
    const [date, setDate] = useState<string>(''); // YYYY-MM-DD
    const [imageUrl, setImageUrl] = useState(tripImage || '');
    const [localMembers, setLocalMembers] = useState<string[]>(members);

    useEffect(() => {
        setTitle(tripTitle);
        setLocalMembers(members);
        setImageUrl(tripImage || '');
        if (tripDate) {
            setDate(tripDate.toISOString().split('T')[0]);
        } else {
            setDate('');
        }
    }, [tripTitle, tripDate, members, tripImage]);

    const handleSave = () => {
        if (!title.trim()) {
            alert('タイトルを入力してください');
            return;
        }

        const dateObj = date ? new Date(date) : null;
        setTripInfo(title, localMembers, dateObj, imageUrl);
        onClose();
    };

    const updateMemberName = (index: number, name: string) => {
        const newMembers = [...localMembers];
        newMembers[index] = name;
        setLocalMembers(newMembers);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800">プラン設定</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Type className="w-4 h-4 text-gray-500" />
                            旅行のタイトル
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-black/5"
                            placeholder="例：冬の北海道旅行"
                        />
                    </div>

                    {/* Date Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            旅行の日程
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>

                    {/* Cover Image Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <span className="text-base">🖼️</span>
                            カバー画像 (URL)
                        </label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-gray-400">※画像のURLを入力してください</p>
                    </div>

                    {/* Members (Editable Names) */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            メンバー ({localMembers.length}人)
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {localMembers.map((member, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <input
                                        type="text"
                                        value={member}
                                        onChange={(e) => updateMemberName(index, e.target.value)}
                                        className="flex-1 bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400">※人数の変更はアプリのリセットが必要です</p>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.origin);
                            alert('URLをコピーしました！パートナーに送って共有しましょう。');
                        }}
                        className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Share className="w-4 h-4" />
                        パートナーを招待する（URLコピー）
                    </button>

                    <button
                        onClick={handleSave}
                        className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        保存する
                    </button>
                </div>

            </div>
        </div>
    );
}
