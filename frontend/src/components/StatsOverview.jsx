import React from 'react';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';

export default function StatsOverview({ summary }) {
  if (!summary) return null;

  const total = summary.totalAllTasks || 0;
  const completed = summary.totalCompleted || 0;
  const open = summary.totalOpen || 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/90 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Overall Productivity
          </span>
          <h2 className="text-sm font-semibold text-slate-800">
            Weekly Progress Tracker
          </h2>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-indigo-600">{percentage}%</span>
          <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Done</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/80 rounded-full h-2 mb-3.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stat Badges */}
      <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100">
        <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <ListTodo className="w-3 h-3 text-slate-400" />
            <span>Total</span>
          </div>
          <span className="text-sm font-bold text-slate-800 mt-0.5">{total}</span>
        </div>

        <div className="flex flex-col items-center p-1.5 rounded-lg bg-amber-50/60 border border-amber-100/60">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Open</span>
          </div>
          <span className="text-sm font-bold text-amber-800 mt-0.5">{open}</span>
        </div>

        <div className="flex flex-col items-center p-1.5 rounded-lg bg-emerald-50/60 border border-emerald-100/60">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Closed</span>
          </div>
          <span className="text-sm font-bold text-emerald-800 mt-0.5">{completed}</span>
        </div>
      </div>
    </div>
  );
}
