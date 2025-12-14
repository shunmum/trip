import { useState, useEffect } from 'react';
import { X, JapaneseYen, Tag, ShoppingBag, Calendar, Save } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import type { Expense } from '../types';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (expense: Omit<Expense, 'id' | 'receiptUrl'>) => void;
}

export function ExpenseModal({ isOpen, onClose, onSave }: ExpenseModalProps) {
    const { members } = useTrip();
    const [shopName, setShopName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('未分類');
    const [paidBy, setPaidBy] = useState<string>(members[0] || 'UserA');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (isOpen) {
            setShopName('');
            setAmount('');
            setCategory('未分類');
            setPaidBy(members[0] || 'UserA');
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen, members]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!shopName || !amount) return;

        onSave({
            shopName,
            amount: Number(amount),
            category,
            paidBy,
            items: [], // Optional items not implemented for manual simple entry
            date: new Date(date),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">手動で記録</h2>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">金額</label>
                        <div className="relative">
                            <JapaneseYen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-lg font-bold"
                                placeholder="0"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Shop Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">お店・内容</label>
                        <div className="relative">
                            <ShoppingBag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="コンビニ、タクシーなど"
                            />
                        </div>
                    </div>

                    {/* Paid By */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">支払った人</label>
                        <div className="flex bg-gray-100 p-1 rounded-lg gap-1 overflow-x-auto">
                            {members.map(member => (
                                <button
                                    key={member}
                                    onClick={() => setPaidBy(member)}
                                    className={`flex-1 py-2 px-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${paidBy === member ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {member}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {/* Category */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                                >
                                    <option value="食費">食費</option>
                                    <option value="交通費">交通費</option>
                                    <option value="宿泊">宿泊</option>
                                    <option value="観光">観光</option>
                                    <option value="お土産">お土産</option>
                                    <option value="その他">その他</option>
                                    <option value="未分類">未分類</option>
                                </select>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">日付</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-9 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!shopName || !amount}
                        className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        <Save className="w-5 h-5" />
                        保存する
                    </button>
                </div>
            </div>
        </div>
    );
}
