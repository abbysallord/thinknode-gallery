"use client";
import React, { useState } from "react";
import { IconX, IconShoppingCart, IconQrcode, IconLoader, IconCheck, IconBuildingStore } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import QRCode from "react-qr-code";

interface ProductDetailsModalProps {
    product: any | null;
    onClose: () => void;
    onAddToCart: (product: any) => void;
    onBuyNow: (e: React.MouseEvent, product: any) => void; // New prop
}

export const ProductDetailsModal = ({ product, onClose, onAddToCart, onBuyNow }: ProductDetailsModalProps) => {
    
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
              <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 max-h-[90vh]">
                  
                  {/* Left: Image */}
                  <div className="hidden md:block w-1/2 bg-neutral-100 relative min-h-[400px]">
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          {product.category}
                      </div>
                  </div>

                  {/* Right: Info */}
                  <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-white dark:bg-neutral-900 overflow-y-auto">
                      <div className="flex justify-between items-start mb-4">
                          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white leading-tight pr-4">{product.name}</h2>
                          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-full shrink-0"><IconX /></button>
                      </div>

                      <div className="flex items-center gap-2 mb-6">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-200">
                                Verified Seller
                            </span>
                            <span className="text-sm text-neutral-500 font-medium flex items-center gap-1"><IconBuildingStore size={14}/> {product.seller}</span>
                      </div>

                        <div className="prose pro-sm dark:prose-invert text-neutral-600 dark:text-neutral-300 mb-8 flex-1">
                            <p>{product.description}</p>
                            <ul className="list-disc pl-4 text-xs mt-4 space-y-1 text-neutral-500">
                                <li>Quality Checked</li>
                                <li>In Stock: {product.stock} units</li>
                                <li>Ships in 2-3 days</li>
                            </ul>
                        </div>

                        <div className="mt-auto border-t border-neutral-100 dark:border-neutral-800 pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-neutral-400 block font-bold uppercase">Total Price</span>
                                    <span className="text-3xl font-black text-neutral-900 dark:text-white">₹{product.price}<span className="text-sm font-normal text-neutral-500">/{product.unit || 'unit'}</span></span>
                                </div>
                                <div className="flex gap-2">
                                        <button 
                                        onClick={() => onAddToCart(product)}
                                        className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl transition-all"
                                        >
                                        <IconShoppingCart size={20} />
                                        </button>
                                        <button 
                                        onClick={(e) => {
                                            onClose(); // Close details
                                            onBuyNow(e, product); // Trigger global checkout
                                        }}
                                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2"
                                        >
                                        Buy Now
                                        </button>
                                </div>
                            </div>
                        </div>
                  </div>
              </div>
           </div>
    );
};
