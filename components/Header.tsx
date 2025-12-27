
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  showLogo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, leftAction, rightAction, showLogo = true }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#1a2632]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {leftAction || (
          showLogo && (
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[28px]">school</span>
            </div>
          )
        )}
        <div className={!leftAction && showLogo ? "" : "flex-1"}>
          <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {rightAction}
    </header>
  );
};
