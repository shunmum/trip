import { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { Users, Palmtree, ArrowRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export function OnboardingPage() {
    const { setTripInfo } = useTrip();
    const [step, setStep] = useState(1); // 1: Count, 2: Names, 3: Title
    const [memberCount, setMemberCount] = useState(2);
    const [memberNames, setMemberNames] = useState<string[]>(['', '']);
    const [tripDate, setTripDate] = useState<string>(''); // Store as YYYY-MM-DD string locally
    const [title, setTitle] = useState('');

    const handleNext = () => {
        if (step === 1) {
            // Initialize names array if count changed
            if (memberNames.length !== memberCount) {
                setMemberNames(Array(memberCount).fill(''));
            }
            setStep(2);
        } else if (step === 2) {
            // Validate names
            if (memberNames.some(n => !n.trim())) return;
            setStep(3);
        } else if (step === 3) {
            // New Step: Date
            setStep(4);
        } else if (step === 4) {
            if (!title.trim()) return;
            // setTripInfo handles Date | null. If empty string, pass null, else new Date
            setTripInfo(title, memberNames, tripDate ? new Date(tripDate) : null);
        }
    };

    const updateName = (index: number, value: string) => {
        const newNames = [...memberNames];
        newNames[index] = value;
        setMemberNames(newNames);
    };

    // Preset titles for inspiration
    const presets = ['北海道食い倒れ旅行', '沖縄のんびり旅', '京都紅葉巡り', '韓国ショッピング旅'];

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">

            {/* Progress Dots */}
            <div className="flex gap-2 mb-12">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={cn("w-2 h-2 rounded-full transition-colors", i === step ? "bg-black" : "bg-gray-200")} />
                ))}
            </div>

            <div className="max-w-md w-full space-y-8">

                {/* Step 1: Member Count */}
                {step === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right duration-300">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">何人で旅行に行きますか？</h1>

                        <div className="flex justify-center items-center gap-6">
                            <button
                                onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
                                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-xl hover:bg-gray-50 disabled:opacity-50"
                                disabled={memberCount <= 1}
                            >
                                -
                            </button>
                            <span className="text-4xl font-black text-gray-900 w-16">{memberCount}</span>
                            <button
                                onClick={() => setMemberCount(memberCount + 1)}
                                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-xl hover:bg-gray-50"
                            >
                                +
                            </button>
                        </div>
                        <p className="text-gray-500 text-sm">※後からメンバーの追加・削除はできません</p>
                    </div>
                )}

                {/* Step 2: Member Names */}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <h1 className="text-2xl font-bold text-gray-900">メンバーの名前を教えてください</h1>
                        <div className="space-y-3">
                            {Array.from({ length: memberCount }).map((_, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3 border border-gray-100 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200 transition-all">
                                    <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <input
                                        type="text"
                                        placeholder={`メンバー ${i + 1}の名前`}
                                        className="bg-transparent w-full outline-none font-medium"
                                        value={memberNames[i] || ''}
                                        onChange={(e) => updateName(i, e.target.value)}
                                        autoFocus={i === 0}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Trip Date */}
                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        {/* Use Calendar icon for Date step */}
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            {/* Assuming Calendar icon is available or we can use Palmtree temporarily if needed, but imported Lucide icons don't include Calendar yet. Wait, I should import Calendar. */}
                            <span className="text-3xl">📅</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">いつ旅行に行きますか？</h1>
                        <p className="text-gray-500">決まっていない場合はスキップできます</p>

                        <input
                            type="date"
                            className="w-full text-center text-xl font-bold border-b-2 border-gray-200 py-2 focus:border-black focus:outline-none"
                            value={tripDate}
                            onChange={(e) => setTripDate(e.target.value)}
                        />
                    </div>
                )}

                {/* Step 4: Trip Title */}
                {step === 4 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Palmtree className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">旅の名前を決めましょう</h1>

                        <input
                            type="text"
                            placeholder="例：冬の北海道旅行"
                            className="w-full text-center text-2xl font-bold border-b-2 border-gray-200 py-2 focus:border-black focus:outline-none placeholder:text-gray-300"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />

                        <div className="flex flex-wrap gap-2 justify-center">
                            {presets.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setTitle(p)}
                                    className="bg-gray-100 px-3 py-1.5 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="pt-8">
                    <button
                        onClick={handleNext}
                        disabled={
                            (step === 2 && memberNames.some(n => !n.trim())) ||
                            (step === 4 && !title.trim())
                        }
                        className="w-full bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {step === 4 ? (
                            <>
                                はじめる <Check className="w-5 h-5" />
                            </>
                        ) : (
                            <>
                                {step === 3 && !tripDate ? 'スキップして次へ' : '次へ'} <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
