import React from 'react';
import { Plus, Search, CalendarCheck2 } from 'lucide-react';

export default function Header({ onOpenAddModal, onOpenSearch, summary }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 py-3.5 transition-all shadow-sm">
      <div className="flex items-center justify-between">
        {/* Branding & Date */}
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
              TaskTrack
              <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                Weekly
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{today}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 rounded-xl transition duration-150 border border-slate-200 hover:border-indigo-200"
            title="Search Tasks (Title, Description)"
            aria-label="Search Tasks"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Add Task Button */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition duration-150"
            title="Create New Task"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
