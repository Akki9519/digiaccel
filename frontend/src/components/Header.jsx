import React from 'react';
import { Search, Settings } from 'lucide-react';

export default function Header({ onOpenSearch, onOpenOnboarding }) {
  return (
    <header className="px-4 pt-4 pb-2 bg-white select-none">
      <div className="flex items-center gap-2">
        <div
          onClick={onOpenSearch}
          className="relative flex-1 flex items-center cursor-pointer group"
        >
          <div className="w-full px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-[6px] flex items-center justify-between transition-all">
            <span className="text-xs text-slate-400 group-hover:text-slate-500 font-normal">
              Search for a task
            </span>
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
          </div>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="p-2 rounded-[6px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4 stroke-[1.8]" />
        </button>
      </div>
    </header>
  );
}
