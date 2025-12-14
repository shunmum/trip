import { useState, useRef, useEffect } from 'react';
import { Camera, X, CheckCircle2, ScanLine } from 'lucide-react';

interface ReceiptScannerProps {
    onScanComplete: (result: { amount: number; shopName: string; items: string[] }) => void;
}

export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0); // 0: Idle, 1: Camera Active, 2: Analyzing, 3: Complete
    const videoRef = useRef<HTMLVideoElement>(null);
    // const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = async () => {
        setIsScanning(true);
        setScanStep(1);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            // Fallback for demo if camera fails (e.g. no permission)
            alert("カメラを起動できませんでした。権限を確認してください。");
            stopCamera();
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsScanning(false);
        setScanStep(0);
    };

    const captureAndAnalyze = () => {
        setScanStep(2);

        // Mock Analysis Delay
        setTimeout(() => {
            setScanStep(3);

            // Return mock result
            onScanComplete({
                amount: Math.floor(Math.random() * 5000) + 1000,
                shopName: 'Seven Eleven',
                items: ['おにぎり', 'お茶', '唐揚げくん'],
            });

            // Cleanup after success
            setTimeout(() => {
                stopCamera();
            }, 1000);
        }, 2000);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => stopCamera();
    }, []);

    return (
        <>
            <button
                onClick={startCamera}
                className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95"
            >
                <Camera className="w-5 h-5" />
                <span>レシートをスキャン</span>
            </button>

            {/* Camera Overlay */}
            {isScanning && (
                <div className="fixed inset-0 z-[100] bg-black">
                    {/* Video Feed */}
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />

                        {/* Scanning Guides */}
                        <div className="relative w-72 h-96 border-2 border-white/50 rounded-lg z-10 overflow-hidden">
                            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-lg" />

                            {/* Scan Animation Line */}
                            {scanStep === 2 && (
                                <>
                                    <ScanLine className="w-full h-full text-blue-400 animate-pulse absolute opacity-50 inset-0" />
                                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] animate-[scan_2s_ease-in-out_infinite]" />
                                </>
                            )}

                            {/* Success State */}
                            {scanStep === 3 && (
                                <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                                    <CheckCircle2 className="w-20 h-20 text-white drop-shadow-lg" />
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-12 w-full flex items-center justify-center gap-8 z-20">
                            <button
                                onClick={stopCamera}
                                className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {scanStep === 1 && (
                                <button
                                    onClick={captureAndAnalyze}
                                    className="p-1 rounded-full border-4 border-white cursor-pointer"
                                >
                                    <div className="w-16 h-16 bg-white rounded-full transition-transform active:scale-95" />
                                </button>
                            )}

                            {/* Reset Button (only show if analyzing stuck or explicitly needed, simplified here) */}
                            {/*
                            {scanStep >= 2 && (
                                <button onClick={() => setScanStep(1)} className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30">
                                    <RotateCcw className="w-6 h-6" />
                                </button>
                            )}
                            */}
                        </div>

                        <p className="absolute top-24 font-mono text-sm tracking-widest text-white/80 z-20 bg-black/50 px-4 py-1 rounded">
                            {scanStep === 1 && 'ALIGN RECEIPT WITHIN FRAME'}
                            {scanStep === 2 && 'EXTRACTING DATA...'}
                            {scanStep === 3 && 'COMPLETE!'}
                        </p>
                    </div>
                </div>
            )}
            <style>{`
            @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
        `}</style>
        </>
    );
}
