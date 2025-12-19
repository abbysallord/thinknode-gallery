"use client";
import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { motion } from 'motion/react';
import { IconSun, IconMoon } from '@tabler/icons-react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
        className="relative w-14 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 cursor-pointer p-1 transition-colors border border-gray-300 dark:border-neutral-700 flex items-center shadow-inner group"
        title="Toggle Theme"
    >
        <motion.div 
            className="w-6 h-6 bg-white dark:bg-neutral-600 rounded-full shadow-md flex items-center justify-center text-yellow-500 dark:text-sky-200 relative z-10"
            animate={{ x: theme === 'dark' ? 24 : 0, rotate: theme === 'dark' ? 360 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
            {theme === 'dark' ? <IconMoon size={14} className="fill-current"/> : <IconSun size={14} className="fill-current"/>}
        </motion.div>
    </div>
  );
};
