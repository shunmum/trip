import { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { Users, Palmtree, ArrowRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export function OnboardingPage() {
    const { setTripInfo, joinTrip } = useTrip();
    const { user, signInWithGoogle } = useAuth();
    const [step, setStep] = useState(0); // 0: Select Type, 1: Count, 2: Names, 3: Title
    const [joinId, setJoinId] = useState('');
    const [isJoining, setIsJoining] = useState(false);
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

    if (!user) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                <div className="max-w-md w-full space-y-8">
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Palmtree className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tabinico</h1>
                        <p className="text-gray-500">ふたり旅をもっと楽しく、もっと自由に。</p>
                    </div>

                    <div className="pt-8">
                        <div className="space-y-4">
                            <button
                                onClick={signInWithGoogle}
                                className="w-full bg-white text-gray-800 font-bold py-4 px-6 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Google Icon */}
                                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>

                                <span className="relative z-10">Googleでログインして始める</span>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all relative z-10" />
                            </button>
                            <p className="text-xs text-center text-gray-400 leading-relaxed">
                                ※LINEなどのアプリ内ブラウザではログインできない場合があります。<br />
                                その場合は<span className="font-bold text-gray-500">SafariやChrome</span>で開いてください。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Step 0: Choose Create or Join
    if (step === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                <div className="max-w-md w-full space-y-8">
                    <h1 className="text-3xl font-bold text-gray-900">旅行をはじめましょう</h1>

                    <div className="space-y-4">
                        <button
                            onClick={() => setStep(1)}
                            className="w-full bg-black text-white p-6 rounded-2xl flex items-center justify-between group hover:bg-gray-800 transition-all font-bold text-lg"
                        >
                            <span>🆕 新しい旅行を作る</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="relative border-t border-gray-100 my-8">
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-400 text-sm">OR</span>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h2 className="text-gray-900 font-bold mb-4 flex items-center justify-center gap-2">
                                <Users className="w-5 h-5" /> 招待に参加する
                            </h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="招待 ID (例: AB12CD)"
                                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 font-mono text-center uppercase tracking-widest focus:ring-2 focus:ring-black outline-none"
                                    value={joinId}
                                    onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                                />
                                <button
                                    onClick={async () => {
                                        if (!joinId) return;
                                        setIsJoining(true);
                                        try {
                                            await joinTrip(joinId);
                                            // Navigation happens automatically via TripProvider state change or just reload/redirect
                                        } catch (e) {
                                            alert("旅行が見つかりませんでした。IDを確認してください。");
                                        } finally {
                                            setIsJoining(false);
                                        }
                                    }}
                                    disabled={!joinId || isJoining}
                                    className="bg-primary-600 text-white font-bold px-6 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
                                >
                                    {isJoining ? "..." : "参加"}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-left">
                                ※招待IDは、旅行作成者の「設定」メニューから確認できます。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                    <div className="mt-4">
                        <p className="text-xs text-gray-400">
                            Logged in as {user.email}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
