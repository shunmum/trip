import { useState, useEffect } from 'react';
import { X, MapPin, ExternalLink, Timer, JapaneseYen, Pencil, Save, Paperclip, FileText, Trash2, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import type { ScheduleItem, Attachment } from '../types';

interface ScheduleDetailsModalProps {
    item: ScheduleItem | null;
    onClose: () => void;
    onSave: (updatedItem: ScheduleItem) => void;
    initialIsEditing?: boolean;
}

export function ScheduleDetailsModal({ item, onClose, onSave, initialIsEditing = false }: ScheduleDetailsModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState<ScheduleItem | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setEditedItem(item);
        setIsEditing(initialIsEditing);
        setIsUploading(false);
        setUploadError(null);
    }, [item, initialIsEditing]);

    if (!item || !editedItem) return null;

    const handleSave = () => {
        if (editedItem) {
            onSave(editedItem);
            setIsEditing(false);
        }
    };

    const handleChange = (field: keyof ScheduleItem, value: any) => {
        setEditedItem(prev => prev ? { ...prev, [field]: value } : null);
    };

    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        // 5MB limit
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("ファイルサイズは5MB以下にしてください");
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const storageRef = ref(storage, `attachments/${Date.now()}_${file.name}`);

            // Add a timeout promise race (60s)
            const uploadPromise = uploadBytes(storageRef, file);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Upload timed out')), 60000)
            );

            await Promise.race([uploadPromise, timeoutPromise]);
            const url = await getDownloadURL(storageRef);

            const newAttachment: Attachment = {
                id: Math.random().toString(),
                name: file.name,
                url,
                type: file.type.includes('pdf') ? 'pdf' : 'image'
            };

            setEditedItem(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    attachments: [...(prev.attachments || []), newAttachment]
                };
            });
        } catch (error: any) {
            console.error("Error uploading file:", error);
            const errorMessage = error.code ? `Error: ${error.code}` : error.message || "Unknown error";
            setUploadError(`アップロード失敗: ${errorMessage}`);
        } finally {
            setIsUploading(false);
            // Reset input value to allow selecting same file again if needed
            e.target.value = '';
        }
    };

    const removeAttachment = (id: string) => {
        setEditedItem(prev => {
            if (!prev) return null;
            return {
                ...prev,
                attachments: (prev.attachments || []).filter(a => a.id !== id)
            };
        });
    };

    // Construct unique ID for file input
    const inputId = `file-upload-${item.id}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative">
                    {/* Image Header */}
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                        />
                    ) : (
                        <div className="w-full h-24 bg-gradient-to-r from-primary-50 to-primary-100" />
                    )}

                    <div className="absolute top-4 right-4 flex gap-2">
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors text-gray-700"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* Header Section (Time & Title) */}
                    <div>
                        <div className="flex items-center gap-2 text-primary-600 mb-2 font-medium">
                            <Timer className="w-4 h-4" />
                            {isEditing ? (
                                <input
                                    type="time"
                                    value={editedItem.time}
                                    onChange={(e) => handleChange('time', e.target.value)}
                                    className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                            ) : (
                                <span>{item.time}</span>
                            )}
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedItem.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Description */}
                        {isEditing ? (
                            <textarea
                                value={editedItem.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="メモや詳細を入力..."
                            />
                        ) : (
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {item.description}
                            </p>
                        )}

                        {/* Location */}
                        {(isEditing || item.location) && (
                            <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editedItem.location || ''}
                                                onChange={(e) => handleChange('location', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 outline-none font-semibold"
                                                placeholder="場所名"
                                            />
                                            <input
                                                type="text"
                                                value={editedItem.address || ''}
                                                onChange={(e) => handleChange('address', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 outline-none"
                                                placeholder="住所"
                                            />
                                        </>
                                    ) : (
                                        <div>
                                            <span className="font-semibold block text-gray-900">{item.location}</span>
                                            {item.address && <span className="text-gray-500 mt-1 block">{item.address}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Budget */}
                        {(isEditing || item.budget) && (
                            <div className="flex items-center gap-2 text-sm">
                                <JapaneseYen className="w-4 h-4 text-gray-400" />
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <span>¥</span>
                                        <input
                                            type="number"
                                            value={editedItem.budget || ''}
                                            onChange={(e) => handleChange('budget', Number(e.target.value))}
                                            className="w-32 bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 outline-none"
                                            placeholder="予算"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-gray-600">予算: approx. ¥{item.budget?.toLocaleString()}</span>
                                )}
                            </div>
                        )}

                        {/* Link */}
                        {(isEditing || item.link) && (
                            <div className="w-full">
                                {isEditing ? (
                                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 bg-gray-50">
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={editedItem.link || ''}
                                            onChange={(e) => handleChange('link', e.target.value)}
                                            className="flex-1 bg-transparent outline-none text-sm"
                                            placeholder="URLを追加"
                                        />
                                    </div>
                                ) : (
                                    item.link && (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            詳細を見る
                                        </a>
                                    )
                                )}
                            </div>
                        )}

                        {/* Attachments (PDF/Images) */}
                        <div className="w-full">
                            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Paperclip className="w-4 h-4" /> 添付ファイル
                            </h3>

                            <div className="space-y-2 mb-3">
                                {editedItem.attachments?.map(att => (
                                    <div key={att.id} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg group">
                                        <a
                                            href={att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline truncate flex-1"
                                        >
                                            <FileText className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{att.name}</span>
                                        </a>
                                        {isEditing && (
                                            <button
                                                onClick={() => removeAttachment(att.id)}
                                                className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {(!editedItem.attachments || editedItem.attachments.length === 0) && !isEditing && (
                                    <p className="text-sm text-gray-400 italic">添付なし</p>
                                )}
                            </div>

                            {isEditing && (
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id={inputId}
                                        disabled={isUploading}
                                    />
                                    <label
                                        htmlFor={inputId}
                                        className={`flex items-center justify-center gap-2 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm font-medium hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                アップロード中...
                                            </>
                                        ) : (
                                            <>
                                                <Paperclip className="w-4 h-4" />
                                                ファイルを追加 (PDF/画像)
                                            </>
                                        )}
                                    </label>
                                    {uploadError && (
                                        <div className="mt-2 text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
                                            {uploadError}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons (Edit Mode) */}
                        {isEditing && (
                            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                                <button
                                    onClick={() => setIsEditing(false)} // Reset to original item on cancel (effect handles updates if needed, but simple toggle is enough for now)
                                    className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    保存する
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
