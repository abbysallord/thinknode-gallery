"use client";
import React from "react";
import { IconShoppingCart, IconX, IconTrash, IconLock } from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cart: any[];
    onRemove: (id: number) => void;
    onCheckout: () => void;
}

export const CartDrawer = ({ isOpen, onClose, cart, onRemove, onCheckout }: CartDrawerProps) => {
    if (!isOpen) return null;

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
               {/* Backdrop - High Z-index */}
               <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
               
               {/* Drawer - Top Z-index */}
               <div className="relative w-full max-w-md bg-white dark:bg-neutral-950 h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300 z-[110]">
                   <div className="flex justify-between items-center mb-6">
                       <h2 className="text-2xl font-bold flex items-center gap-2"><IconShoppingCart /> Your Cart</h2>
                       <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"><IconX /></button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto space-y-4">
                       {cart.length === 0 ? (
                           <div className="text-center text-neutral-400 mt-20">
                               <IconShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                               <p>Your cart is empty.</p>
                           </div>
                       ) : (
                           cart.map(item => (
                               <div key={item.id} className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
                                   <div className="relative h-16 w-16 bg-neutral-200 rounded-lg overflow-hidden shrink-0">
                                       <Image src={item.image} alt={item.name} fill className="object-cover" />
                                   </div>
                                   <div className="flex-1">
                                       <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                                       <p className="text-neutral-500 text-xs mt-1">Qty: {item.quantity}</p>
                                       <div className="flex justify-between items-center mt-2">
                                            <span className="font-bold text-green-600">₹{item.price * item.quantity}</span>
                                            <button onClick={() => onRemove(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><IconTrash size={16} /></button>
                                       </div>
                                   </div>
                               </div>
                           ))
                       )}
                   </div>

                   {cart.length > 0 && (
                       <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                           <div className="flex justify-between items-center mb-4">
                               <span className="text-neutral-500">Total Amount</span>
                               <span className="text-2xl font-black">₹{totalAmount}</span>
                           </div>
                           <button 
                                onClick={onCheckout}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all"
                            >
                               <IconLock size={20} /> Checkout to Pay
                           </button>
                           <p className="text-center text-[10px] text-neutral-400 mt-3 flex items-center justify-center gap-1">
                               <IconLock size={10} /> Secure P2P UPI Payment
                           </p>
                       </div>
                   )}
               </div>
           </div>
    );
};
