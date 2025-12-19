"use client";
import React, { useEffect, useState } from 'react';
import { IconExternalLink, IconLoader } from '@tabler/icons-react';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
}

export const NewsWidget = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setNews(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) {
        return <div className="flex h-full items-center justify-center text-neutral-400"><IconLoader className="animate-spin" size={24}/></div>;
    }

    return (
    <div className="flex flex-col h-full overflow-hidden relative">
        <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar focus-visible:outline-none pb-12">
            {news.map((item, idx) => (
                <a 
                    key={idx} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block border-b border-neutral-100 dark:border-neutral-800 pb-3 last:border-0 last:pb-0"
                >
                    <h4 className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-green-600 transition-colors line-clamp-2 leading-relaxed">
                        {item.title}
                    </h4>
                    <div className="flex justify-between items-center mt-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-green-600 font-bold bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">{item.source}</span>
                        <div className="flex items-center gap-1 text-neutral-400">
                             <span className="text-[10px]">{item.pubDate}</span>
                             <IconExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </a>
            ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none" />
    </div>
  );
};
