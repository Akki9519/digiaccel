import React from 'react';
import { CheckSquare, XSquare } from 'lucide-react';

export default function StatsOverview({ summary, weekLabel = 'This Week' }) {
  const total = summary?.totalAllTasks ?? 0;
  const completed = summary?.totalCompleted ?? 0;
  const pending = summary?.totalOpen ?? 0;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const padNum = (num) => String(num).padStart(2, '0');

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#EFF2FF] rounded-[8px] p-3 flex flex-col justify-between min-h-[92px]">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-[4px] bg-[#4566EC]/15 flex items-center justify-center text-[#4566EC]">
              <CheckSquare className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Task Complete</span>
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {padNum(completed)}
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              {weekLabel}
            </span>
          </div>
        </div>

        <div className="bg-[#FFE6E7] rounded-[8px] p-3 flex flex-col justify-between min-h-[92px]">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-[4px] bg-[#F43F5E]/15 flex items-center justify-center text-[#F43F5E]">
              <XSquare className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Task Pending</span>
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {padNum(pending)}
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              {weekLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-0.5">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-2">
          Weekly Progress
        </h2>

        <div className="w-full h-2.5 rounded-[3px] bg-[#DADAFF] overflow-hidden">
          <div
            className="h-full bg-[#253C98] rounded-[3px] transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
