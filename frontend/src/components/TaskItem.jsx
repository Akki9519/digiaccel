import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Check, Trash2, Edit3, Clock } from 'lucide-react';

export default function TaskItem({
  task,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
}) {
  const [isSwiped, setIsSwiped] = useState(false);
  const controls = useAnimation();

  const isCompleted = task.status === 'Completed';

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -40) {
      setIsSwiped(true);
      controls.start({ x: -75 });
    } else {
      setIsSwiped(false);
      controls.start({ x: 0 });
    }
  };

  const resetSwipe = () => {
    setIsSwiped(false);
    controls.start({ x: 0 });
  };

  const displayTime = () => {
    if (task.startTime && task.endTime) {
      return `${task.startTime} - ${task.endTime}`;
    }
    if (task.startTime) return task.startTime;
    if (task.dateTime) {
      const d = new Date(task.dateTime);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      }
    }
    return '';
  };

  return (
    <div className="relative overflow-hidden rounded-xs my-1.5 select-none group">
      <div
        className={`absolute inset-0 bg-rose-500 rounded-xs flex items-center justify-end px-4 z-0 transition-opacity duration-150 ${
          isSwiped ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => {
            resetSwipe();
            onDeleteTask(task);
          }}
          className="flex items-center gap-1.5 text-white font-medium text-xs px-2.5 py-1.5 rounded-xs bg-rose-600 hover:bg-rose-700 active:scale-95 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.06}
        animate={controls}
        onDragEnd={handleDragEnd}
        className="relative z-10 py-3 px-3 bg-white hover:bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-3 transition-colors rounded-xs"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onToggleStatus(task)}
            className={`w-4.5 h-4.5 rounded-[3px] flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
              isCompleted
                ? 'bg-[#4566EC] border border-[#4566EC] text-white'
                : 'border border-slate-300 hover:border-[#4566EC] bg-white'
            }`}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          <div className="min-w-0 flex-1">
            <h4
              className={`text-xs font-semibold leading-snug truncate transition-all ${
                isCompleted
                  ? 'line-through text-slate-400 font-normal'
                  : 'text-slate-800'
              }`}
            >
              {task.title}
            </h4>

            <div className="flex items-center gap-2 mt-0.5">
              {displayTime() && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {displayTime()}
                </span>
              )}
              {task.priority && task.priority !== 'Medium' && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs ${
                    task.priority === 'High'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {task.priority}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
          <button
            type="button"
            onClick={() => onDeleteTask(task)}
            className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-xs transition"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4 stroke-[1.75]" />
          </button>

          <button
            type="button"
            onClick={() => onEditTask(task)}
            className="p-1.5 hover:text-[#4566EC] hover:bg-blue-50 rounded-xs transition"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4 stroke-[1.75]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
