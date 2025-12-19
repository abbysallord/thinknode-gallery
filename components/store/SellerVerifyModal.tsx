"use client";
import React, { useState, useEffect } from "react";
import { IconBuildingStore, IconId, IconLoader, IconCheck, IconExclamationCircle } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { cn } from "@/lib/utils";

interface SellerVerifyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: (data: { upiId: string; name: string; email: string }) => void;
    initialData?: { upiId: string; name: string; email?: string };
}

export const SellerVerifyModal = ({ isOpen, onClose, onVerified, initialData }: SellerVerifyModalProps) => {
    const [step, setStep] = useState(1);
    const [secretCode, setSecretCode] = useState("");
    const [userEnteredCode, setUserEnteredCode] = useState("");
    const [sellerName, setSellerName] = useState("");
    const [upiId, setUpiId] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);

    // Reset/Initialize state on Open
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setStep(2);
                setSellerName(initialData.name);
                setUpiId(initialData.upiId);
                setEmail(initialData.email || "");
            } else {
                setStep(1);
                setSellerName("");
                setUpiId("");
                setEmail("");
                setUserEnteredCode("");
                setIsExpired(false);
                
                // Generate code for Step 1
                const code = Math.floor(100000 + Math.random() * 900000).toString();
                setSecretCode(code);
                setTimeLeft(180);
            }
        }
    }, [isOpen, initialData]);

    // Timer Logic for Step 1
    useEffect(() => {
        if (isOpen && step === 1 && !initialData) {
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsExpired(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isOpen, step, initialData, secretCode]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    const handleVerifyCode = () => {
        if (isExpired) return;
        if (userEnteredCode !== secretCode) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1000);
    };

    const handleFinalize = () => {
        if (!upiId.includes("@") || !email.includes("@")) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-neutral-950 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 overflow-hidden">
                
                {isExpired && step === 1 && (
                    <div className="absolute inset-0 z-20 bg-white/95 dark:bg-neutral-950/95 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                            <IconExclamationCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-red-600">Code Expired</h3>
                        <p className="text-neutral-500 mt-2 mb-6 text-sm">The verification code is valid for only 3 minutes. Please request a new one.</p>
                        <button 
                            onClick={() => { onClose(); }} 
                            className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:scale-105 transition-transform"
                        >
                            Close & Try Again
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6 text-center">
                        <div>
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IconId size={32} />
                            </div>
                            <h2 className="text-2xl font-bold">Seller Verification</h2>
                            <p className="text-sm text-neutral-500 mt-2">Scan the QR code to get your unique verification code.</p>
                        </div>
                        
                        <div className="flex justify-center my-6">
                            <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                {/* Using imported QRCode component */}
                                <QRCode value={secretCode} size={160} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Enter 6-Digit Code</label>
                                <Input 
                                    className="text-center text-2xl tracking-widest font-bold"
                                    placeholder="0 0 0 0 0 0" 
                                    maxLength={6}
                                    value={userEnteredCode}
                                    onChange={(e) => setUserEnteredCode(e.target.value)}
                                    disabled={isExpired}
                                />
                            </div>
                            <button 
                                onClick={handleVerifyCode}
                                disabled={userEnteredCode.length !== 6 || loading || isExpired}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 flex justify-center"
                            >
                                {loading ? <IconLoader className="animate-spin" /> : "Verify Identity"}
                            </button>
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-2 flex items-center justify-center gap-1 font-mono">
                             Code expires in <span className={cn("font-bold", timeLeft < 60 ? "text-red-500" : "text-neutral-600")}>{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold">{initialData ? "Update Details" : "Setup Payments"}</h2>
                            <p className="text-sm text-neutral-500 mt-1">
                                {initialData ? "Update your seller profile." : "Enter details to receive verified payments."}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Display Name (Shop Name)</label>
                                <Input value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="e.g. Patil Farms" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">UPI ID (VPA)</label>
                                <Input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="username@upi" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Seller Email (For Verification)</label>
                                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="seller@example.com" />
                            </div>
                             <button 
                                onClick={handleFinalize}
                                disabled={!upiId || !sellerName || !email.includes('@') || loading}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex justify-center"
                             >
                                {loading ? <IconLoader className="animate-spin" /> : (initialData ? "Update Profile" : "Complete Setup")}
                             </button>
                        </div>
                    </div>
                )}

                 {step === 3 && (
                       <div className="text-center py-6">
                           <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                               <IconCheck size={40} stroke={4} />
                           </div>
                           <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{initialData ? "Profile Updated!" : "You are Verified!"}</h2>
                           <p className="text-neutral-500 mt-2 text-sm">{initialData ? "Your details have been successfully saved." : "You can now list verified products on Agri Store Pro."}</p>
                           <button 
                                onClick={() => { onVerified({ upiId, name: sellerName, email }); onClose(); }}
                                className="mt-6 w-full py-3 bg-green-600 text-white font-bold rounded-xl"
                           >
                               {initialData ? "Back to Dashboard" : "Start Selling"}
                           </button>
                       </div>
                   )}
            </div>
        </div>
    );
};
