import { useState } from 'react';
import { ReceiptScanner } from '../components/ReceiptScanner';
import { ExpenseModal } from '../components/ExpenseModal';
import { UserAvatar } from '../components/UserAvatar';
import { Receipt, ArrowRight, Banknote, Calendar, Plus, Check } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import type { Expense } from '../types';

export function WalletPage() {
    const { members, expenses, setExpenses } = useTrip();
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    // Calculate Totals per Member (only unsettled)
    const unsettledExpenses = expenses.filter(e => !e.settled);

    const totals = members.reduce((acc, member) => {
        acc[member] = unsettledExpenses
            .filter(e => e.paidBy === member)
            .reduce((sum, curr) => sum + curr.amount, 0);
        return acc;
    }, {} as Record<string, number>);

    const totalAmount = Object.values(totals).reduce((a, b) => a + b, 0);
    const splitAmount = totals && members.length > 0 ? totalAmount / members.length : 0;

    // Calculate Balance (Paid - Should Pay)
    const balances = members.map(member => ({
        member,
        paid: totals[member] || 0,
        balance: (totals[member] || 0) - splitAmount
    })).sort((a, b) => a.balance - b.balance); // Ascending: Negative (Debtor) -> Positive (Creditor)

    const handleSettleUp = () => {
        if (!window.confirm('現在の精算を完了し、残高を0にします。履歴は履歴として残ります。よろしいですか？')) return;

        const updatedExpenses = expenses.map(e => ({
            ...e,
            settled: true
        }));
        setExpenses(updatedExpenses);
    };

    const handleScanComplete = (result: { amount: number; shopName: string; items: string[] }) => {
        // Create new expense from scan result
        const newExpense: Expense = {
            id: Math.random().toString(),
            amount: result.amount,
            category: '未分類',
            paidBy: members[0] || 'Unknown', // Default to first member
            items: result.items,
            date: new Date(),
            shopName: result.shopName
        };
        setExpenses([newExpense, ...expenses]);
    };

    const handleManualSave = (manualExpense: Omit<Expense, 'id' | 'receiptUrl'>) => {
        const newExpense: Expense = {
            id: Math.random().toString(),
            ...manualExpense,
            receiptUrl: undefined
        };
        setExpenses([newExpense, ...expenses]);
    };

    return (
        <div className="h-full bg-gray-50 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            <span className="text-3xl">💸</span> Wallet
                        </h2>
                        <p className="text-gray-500 mt-1">旅の出費をスマートに割り勘</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <ReceiptScanner onScanComplete={handleScanComplete} />
                    <button
                        onClick={() => setIsManualModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-white text-gray-700 font-bold py-3 rounded-full shadow-sm hover:shadow-md border border-gray-200 transition-all hover:bg-gray-50"
                    >
                        <Plus className="w-5 h-5" />
                        手動で入力
                    </button>
                </div>

                {/* Balance Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Banknote className="w-32 h-32" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">UNSETTLED TOTAL</p>
                                <p className="text-4xl font-black text-gray-900">¥{totalAmount.toLocaleString()}</p>
                            </div>
                            {totalAmount > 0 && (
                                <button
                                    onClick={handleSettleUp}
                                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                                >
                                    <Check className="w-4 h-4" />
                                    精算を完了
                                </button>
                            )}
                        </div>

                        {/* Settlement Info (Simplified for 2-person case which is the main use case) */}
                        {members.length === 2 ? (
                            (() => {
                                const m1 = balances[0]; // Debtor (paid less)
                                const m2 = balances[1]; // Creditor (paid more)

                                if (Math.abs(m1.balance) < 1) {
                                    return (
                                        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-bold text-sm">
                                            現在の割り勘は完了しています！
                                        </div>
                                    );
                                }

                                const settlementAmount = Math.abs(m1.balance);

                                return (
                                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar user={m1.member} />
                                            <div className="flex flex-col items-center px-2">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">PAYS</span>
                                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <UserAvatar user={m2.member} />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-500 font-medium mr-2">精算額</span>
                                            <span className="text-xl font-bold text-gray-900">¥{Math.round(settlementAmount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })()
                        ) : (
                            // Generic N-person view: Show who paid what vs average
                            <div className="space-y-2">
                                {balances.map(b => (
                                    <div key={b.member} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <UserAvatar user={b.member} size="sm" />
                                            <span>{b.member}</span>
                                        </div>
                                        <span className={b.balance >= 0 ? 'text-green-600 font-bold' : 'text-red-500'}>
                                            {b.balance >= 0 ? '+' : ''}{Math.round(b.balance).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Expense List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Transactions</h3>
                    {expenses.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">まだ支出がありません</p>
                        </div>
                    ) : (
                        expenses.map((expense) => (
                            <div key={expense.id} className={`bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow ${expense.settled ? 'opacity-60 bg-gray-50/50' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${expense.category === '食費' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                        <Receipt className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900">{expense.shopName}</h4>
                                            {expense.settled && (
                                                <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Settled</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                            <Calendar className="w-3 h-3" />
                                            <span>{expense.date.toLocaleDateString('ja-JP')}</span>
                                            <span className="text-gray-300">|</span>
                                            <span>{expense.category}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold text-lg text-gray-900">¥{expense.amount.toLocaleString()}</p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="text-[10px] text-gray-400">Paid by</span>
                                        <UserAvatar user={expense.paidBy} size="sm" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <ExpenseModal
                    isOpen={isManualModalOpen}
                    onClose={() => setIsManualModalOpen(false)}
                    onSave={handleManualSave}
                />

            </div>
        </div>
    );
}
