"use client";
import React, { useState, useEffect } from "react";
import { IconX, IconMapPin, IconBuildingStore, IconCurrencyRupee, IconQrcode, IconArrowRight, IconCheck, IconLoader, IconCurrentLocation, IconEdit } from "@tabler/icons-react";
import Image from "next/image";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    seller: string;
    sellerVpa?: string;
    sellerEmail?: string; 
    image: string;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[]; // Reverted to cart
    onClearCart: () => void;
    directBuyItem?: CartItem | null; 
}

export function CheckoutModal({ isOpen, onClose, cart, onClearCart, directBuyItem }: CheckoutModalProps) {
    const [step, setStep] = useState<'address' | 'payment'>('address');
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState(""); 
    const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Determine which items to checkout
    const itemsToCheckout = directBuyItem ? [directBuyItem] : cart;
    const totalAmount = itemsToCheckout.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // ... (rest of imports/state same)

    const handleFetchLocation = () => {
         if (!navigator.geolocation) return alert("Geolocation not supported");
         navigator.geolocation.getCurrentPosition(
             (pos) => {
                 const { latitude, longitude } = pos.coords;
                 const gpsString = `\n[GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}]`;
                 if(!address.includes("GPS:")) setAddress(prev => prev + gpsString);
             },
             () => alert("Permission denied or unable to fetch location.")
         );
    };
 
    const handleConfirmAddress = (e: any) => {
         e.preventDefault();
         if (address.length < 10) return alert("Please enter a valid, complete address.");
         setIsAddressConfirmed(true);
         localStorage.setItem("agronova_address", address);
    };

    // ...
    // Inside render:
    // State for Verification
    const [orderIds, setOrderIds] = useState<Record<string, string>>({});
    const [userInputs, setUserInputs] = useState<Record<string, string>>({});
    const [verifiedGroups, setVerifiedGroups] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if(isOpen) {
             setStep('address'); // Reset step on open
             setUserInputs({});
             setVerifiedGroups({});
             const savedAddr = localStorage.getItem("agronova_address");
             const savedEmail = localStorage.getItem("agronova_email");
             if (savedAddr) {
                 setAddress(savedAddr);
                 setIsAddressConfirmed(true);
             }
             if (savedEmail) setEmail(savedEmail);
        }
    }, [isOpen]);

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation: Prevent Self-Purchase
        const isSelfPurchase = itemsToCheckout.some(item => 
            item.sellerEmail && item.sellerEmail.trim().toLowerCase() === email.trim().toLowerCase()
        );

        if (isSelfPurchase) {
             alert("Restriction: You cannot buy items from yourself (Buyer Email matches Seller Email). Please use a different email.");
             return;
        }

        if(address.length > 5 && email.includes('@')) {
            localStorage.setItem("agronova_address", address);
            localStorage.setItem("agronova_email", email);
            setIsAddressConfirmed(true);
            setStep('payment');
        } else {
             alert("Please enter a valid address and email.");
        }
    };

    // Group items by seller
    const sellerGroups = itemsToCheckout.reduce((groups, item) => {
        const vpa = item.sellerVpa || "unknown@upi";
        if (!groups[vpa]) {
            groups[vpa] = {
                sellerName: item.seller,
                vpa: vpa,
                items: [],
                total: 0
            };
        }
        groups[vpa].items.push(item);
        groups[vpa].total += item.price * item.quantity;
        return groups;
    }, {} as Record<string, { sellerName: string; vpa: string; items: CartItem[]; total: number }>);

    // Generate Order IDs when groups change
    useEffect(() => {
        const newOrderIds: Record<string, string> = {};
        Object.keys(sellerGroups).forEach(vpa => {
             // Generate a simple 4-digit numeric code for easier entry
             // Prefix ORD to make it look official
            newOrderIds[vpa] = "ORD-" + Math.floor(1000 + Math.random() * 9000).toString();
        });
        setOrderIds(newOrderIds);
    }, [itemsToCheckout.length]);


    
    // Construct UPI URL helper
    // Construct UPI URL helper
    const getUpiUrl = (vpa: string, name: string, amount: number, orderId: string) => {
        // Standard Format: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
        const params = new URLSearchParams();
        params.append("pa", vpa);
        params.append("pn", name); // Payee Name
        params.append("am", amount.toFixed(2)); // Strict Decimal
        params.append("cu", "INR");
        params.append("tn", `Order ${orderId}`); // Note: Visible to user for verification
        params.append("tr", orderId); // Ref ID
        
        return `upi://pay?${params.toString()}`;
    };

    const allVerified = Object.keys(sellerGroups).every(vpa => verifiedGroups[vpa]);

    const handleVerifyParams = (vpa: string, input: string) => {
        setUserInputs(prev => ({...prev, [vpa]: input}));
        
        // Validation: Just check if it looks like a VPA (contains @) and length > 3
        if (input.includes("@") && input.length > 5) {
            setVerifiedGroups(prev => ({...prev, [vpa]: true}));
        } else {
            setVerifiedGroups(prev => ({...prev, [vpa]: false}));
        }
    };

    const handleCompleteOrder = async () => {
        setLoading(true);
        try {
            // Call Real API
            const res = await fetch('/api/store/order/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    orderId: "ORD-" + Math.floor(Math.random() * 10000), // Main ID
                    cart: itemsToCheckout,
                    total: totalAmount,
                    address: address,
                    sellerGroups: sellerGroups,
                    userInputs: userInputs, 
                    buyerEmail: email 
                })
            });
            
            const data = await res.json();
            
            if(data.success) {
                alert("Order Placed! Please check your email for the invoice. The seller will verify your payment shortly.");
                if (directBuyItem) {
                    onClose();
                } else {
                    onClearCart(); 
                }
            } else {
                alert("Failed to place order. " + (data.error || ""));
            }
        } catch(e) {
            alert("Network error.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
                    <div>
                        <h2 className="text-2xl font-black text-neutral-800 dark:text-white">
                            {directBuyItem ? "Buy Now" : "Checkout"}
                        </h2>
                        <p className="text-sm text-neutral-500">Complete your purchase directly with farmers.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-neutral-800 rounded-full transition-colors">
                        <IconX size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {step === 'address' ? (
                        <div className="space-y-6">
                            {/* ... Address Form ... */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex gap-3 text-blue-700 dark:text-blue-300">
                                <IconMapPin className="shrink-0" />
                                <div>
                                    <h3 className="font-bold">Delivery Address</h3>
                                    <p className="text-sm opacity-80">Please provide your full delivery address where the farmers will ship your produce.</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleAddressSubmit} className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300">Full Address</label>
                                        <button type="button" onClick={handleFetchLocation} className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded flex items-center gap-1 font-bold hover:bg-blue-200 transition-colors">
                                            <IconCurrentLocation size={12} /> Use GPS
                                        </button>
                                   </div>
                                   <textarea 
                                       value={address}
                                       onChange={(e) => setAddress(e.target.value)}
                                       disabled={isAddressConfirmed}
                                       placeholder="House No, Street, Village/City, Pincode..."
                                       className={`w-full p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-green-500 min-h-[120px] resize-none ${isAddressConfirmed ? "opacity-60 cursor-not-allowed" : ""}`}
                                       required
                                   />
                                   <div className="flex justify-end mt-2">
                                        {!isAddressConfirmed ? (
                                            <button type="button" onClick={handleConfirmAddress} className="text-xs bg-neutral-800 dark:bg-neutral-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition-colors">
                                                Confirm & Save
                                            </button>
                                        ) : (
                                            <button type="button" onClick={() => setIsAddressConfirmed(false)} className="text-xs text-neutral-500 hover:text-green-600 font-bold flex items-center gap-1">
                                                <IconEdit size={12} /> Edit Address
                                            </button>
                                        )}
                                   </div>
                                    <p className="text-xs text-neutral-400 mt-1">We will send your invoice and order updates here.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-neutral-700 dark:text-neutral-300">Your Email Address</label>
                                    <input 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="buyer@example.com"
                                        className="w-full p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!isAddressConfirmed}
                                    className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${isAddressConfirmed ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20" : "bg-neutral-300 text-neutral-500 cursor-not-allowed"}`}
                                >
                                    Proceed to Payment <IconArrowRight size={20} />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Address Summary */}
                            <div className="flex justify-between items-start bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl">
                                <div>
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Delivering To</p>
                                    <p className="text-neutral-700 dark:text-neutral-300 font-medium">{address}</p>
                                </div>
                                <button onClick={() => setStep('address')} className="text-sm text-green-600 font-bold hover:underline">Change</button>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2"><IconCurrencyRupee className="text-green-600" /> Payments</h3>
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200">
                                    <strong>Step 1:</strong> Scan QR & Pay via UPI. <br/>
                                    <strong>Step 2:</strong> Find your <strong>UPI ID</strong> in your Payment App (e.g. user@oksbi). <br/>
                                    <strong>Step 3:</strong> Enter your <strong>FULL UPI ID</strong> below for verification.
                                </div>
                                
                                {Object.values(sellerGroups).map((group, idx) => {
                                    const currentId = orderIds[group.vpa] || "Generating...";
                                    const isVerified = verifiedGroups[group.vpa];
                                    const qrUrl = getUpiUrl(group.vpa, group.sellerName, group.total, currentId);

                                    return (
                                    <div key={idx} className={`border rounded-2xl overflow-hidden transition-all ${isVerified ? "border-green-500 bg-green-50/10" : "border-neutral-200 dark:border-neutral-800"}`}>
                                        <div className="bg-neutral-50 dark:bg-neutral-900 p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="h-10 w-10 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
                                                    <IconBuildingStore size={20} className="text-neutral-600 dark:text-neutral-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-neutral-800 dark:text-white">{group.sellerName}</h4>
                                                    <p className="text-xs text-neutral-500">{group.items.length} items • Total: ₹{group.total}</p>
                                                </div>
                                            </div>
                                            {isVerified ? (
                                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <IconCheck size={12} /> Verified
                                                </div>
                                            ) : (
                                                <div className="bg-neutral-200 text-neutral-600 px-3 py-1 rounded-full text-xs font-bold">
                                                    Pending
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-4 flex flex-col md:flex-row gap-6">
                                            {/* QR Code Section */}
                                            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white dark:bg-neutral-950 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 relative">
                                                <div className="relative h-40 w-40 mb-3">
                                                    <Image 
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}`}
                                                        alt="Payment QR"
                                                        fill
                                                        className={`object-contain transition-opacity ${isVerified ? "opacity-20" : "opacity-100"}`}
                                                        unoptimized
                                                    />
                                                    {isVerified && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <IconCheck size={60} className="text-green-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-center text-neutral-400">Scan to pay <strong>₹{group.total}</strong></p>
                                            </div>

                                            {/* Verification Input */}
                                            <div className="flex-1 flex flex-col justify-center space-y-3">
                                                <div className="space-y-1">
                                                     <label className="text-xs font-bold text-neutral-500 uppercase">Your UPI ID (Payment Source)</label>
                                                     <p className="text-[10px] text-neutral-400">Enter the <strong>UPI ID</strong> you used to pay (e.g. user@oksbi).</p>
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="e.g. user@oksbi"
                                                        className={`flex-1 bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 ${isVerified ? "text-green-600 ring-green-500" : "focus:ring-blue-500"}`}
                                                        value={userInputs[group.vpa] || ""}
                                                        onChange={(e) => handleVerifyParams(group.vpa, e.target.value)}
                                                    />
                                                </div>
                                                {isVerified && <p className="text-xs text-green-600 font-bold">Valid format</p>}
                                            </div>
                                        </div>
                                    </div>
                                    )
                                })}
                            </div>
                            
                            <div className="pt-4">
                                <button 
                                    onClick={handleCompleteOrder}
                                    disabled={!allVerified || loading}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                        allVerified 
                                        ? "bg-green-600 text-white shadow-lg shadow-green-600/30 hover:bg-green-700 hover:scale-[1.02]" 
                                        : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                                    }`}
                                >
                                    {loading ? <IconLoader className="animate-spin" /> : <IconCheck size={20} />}
                                    {loading ? "Processing..." : "Complete Order"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
