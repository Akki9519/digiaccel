import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Calendar,
  CheckCircle2,
  Clock,
  PlusCircle,
  Inbox,
} from 'lucide-react';
import TaskItem from './TaskItem';
import { getWeekContext } from '../utils/dateHelpers';

export default function WeekCard({
  weekData,
  defaultExpanded = true,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onAddTaskToWeek,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const { weekId, startDate, endDate, weekLabel, openTasks, completedTasks, tasks = [] } =
    weekData;

  const total = openTasks + completedTasks;
  const progressPercent = total > 0 ? Math.round((completedTasks / total) * 100) : 0;
  const weekContext = getWeekContext(startDate, endDate);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-4 transition-all duration-200 hover:border-slate-300">
      {/* Week Header (Clickable to Expand/Collapse) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer select-none bg-gradient-to-r from-white via-white to-slate-50/50 hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center justify-between gap-2">
          {/* Week Label & Context Tag */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                  {weekLabel}
                </h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${weekContext.color}`}
                >
                  {weekContext.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Monday to Sunday
              </p>
            </div>
          </div>

          {/* Expand / Collapse Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Summary Metric Counters (Required by assignment) */}
        <div className="mt-3 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            {/* Open Tasks Count */}
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{openTasks} Open</span>
            </div>

            {/* Completed Tasks Count */}
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{completedTasks} Completed</span>
            </div>
          </div>

          {/* Completion Mini Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Task List Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
          >
            <div className="p-3.5 space-y-2">
              {tasks.length === 0 ? (
                <div className="py-6 text-center text-slate-400">
                  <Inbox className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <p className="text-xs font-medium">No tasks recorded for this week.</p>
                  <button
                    onClick={() => onAddTaskToWeek(startDate)}
                    className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Task for this week</span>
                  </button>
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggleStatus={onToggleStatus}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
