import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit3,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatDate, formatTime, priorityStyles } from '../utils/dateHelpers';

export default function TaskItem({
  task,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSwiped, setIsSwiped] = useState(false);
  const controls = useAnimation();

  const isCompleted = task.status === 'Completed';
  const priorityStyle = priorityStyles[task.priority] || priorityStyles.Medium;

  // Handle drag / swipe left gesture
  const handleDragEnd = (event, info) => {
    // If dragged to the left by more than 50px
    if (info.offset.x < -45) {
      setIsSwiped(true);
      controls.start({ x: -80 });
    } else {
      setIsSwiped(false);
      controls.start({ x: 0 });
    }
  };

  const resetSwipe = () => {
    setIsSwiped(false);
    controls.start({ x: 0 });
  };

  return (
    <div className="relative overflow-hidden rounded-xl my-2 border border-slate-200/80 bg-white select-none transition-shadow hover:shadow-sm">
      {/* Background action revealed on swipe left */}
      <div className="absolute inset-0 bg-rose-600 flex items-center justify-end px-4 z-0">
        <button
          onClick={() => {
            resetSwipe();
            onDeleteTask(task);
          }}
          className="flex items-center space-x-1.5 text-white font-medium text-xs px-2.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 active:scale-95 transition"
          title="Delete Task"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>

      {/* Draggable Task Surface */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -85, right: 0 }}
        dragElastic={0.08}
        animate={controls}
        onDragEnd={handleDragEnd}
        className={`relative z-10 p-3.5 bg-white transition-colors ${
          isCompleted ? 'bg-slate-50/80' : 'bg-white'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Status Checkbox / Completion Circle */}
          <button
            onClick={() => onToggleStatus(task)}
            className="mt-0.5 text-slate-400 hover:text-indigo-600 active:scale-90 transition flex-shrink-0"
            title={isCompleted ? 'Mark as In Progress' : 'Mark as Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
            )}
          </button>

          {/* Task Info Content */}
          <div className="flex-1 min-w-0" onClick={() => isSwiped && resetSwipe()}>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-sm font-semibold tracking-tight break-words ${
                  isCompleted
                    ? 'line-through text-slate-400'
                    : 'text-slate-800'
                }`}
              >
                {task.title}
              </h3>

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${priorityStyle.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${priorityStyle.dot}`} />
                {task.priority || 'Medium'}
              </span>

              {/* Status Pill */}
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}
              >
                {task.status}
              </span>
            </div>

            {/* Optional Description */}
            {task.description && (
              <div className="mt-1">
                <p
                  className={`text-xs text-slate-500 leading-relaxed ${
                    !isExpanded ? 'line-clamp-1' : ''
                  }`}
                >
                  {task.description}
                </p>
                {task.description.length > 60 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                    className="text-[11px] font-medium text-indigo-600 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                  >
                    {isExpanded ? (
                      <>
                        Show less <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        Read more <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Date and Time Footer */}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {formatDate(task.dateTime)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {formatTime(task.dateTime)}
              </span>
            </div>
          </div>

          {/* Action buttons (Edit & direct Delete for convenience) */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={() => onEditTask(task)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              title="Edit Task"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteTask(task)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Swipe hint */}
        <div className="mt-2 text-right">
          <span className="text-[9px] text-slate-300 italic select-none">
            ← swipe left to delete
          </span>
        </div>
      </motion.div>
    </div>
  );
}
