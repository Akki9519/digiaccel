import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  Calendar,
  Trash2,
  Edit3,
  CheckCircle2,
  Circle,
  FileQuestion,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';
import { formatDate, formatTime, priorityStyles } from '../utils/dateHelpers';

export default function SearchModal({
  isOpen,
  onClose,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
      setHasSearched(false);
      return;
    }

    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const response = await api.getTasks({ search: trimmed });
        setResults(response.data || []);
        setHasSearched(true);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(handler);
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Search Header Bar */}
          <div className="p-3.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Search className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md text-xs font-semibold"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results Area */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
                <p className="text-xs font-medium">Searching matching tasks...</p>
              </div>
            ) : !searchTerm.trim() ? (
              <div className="py-12 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">
                  Type keywords above to find tasks across all weeks
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Matches titles, details, and descriptions
                </p>
              </div>
            ) : hasSearched && results.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <FileQuestion className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  No tasks found matching "{searchTerm}"
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Try checking for typos or searching a different keyword.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Results ({results.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {results.map((task) => {
                    const isCompleted = task.status === 'Completed';
                    const pStyle =
                      priorityStyles[task.priority] || priorityStyles.Medium;

                    return (
                      <div
                        key={task._id}
                        className="p-3 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-200 hover:shadow-sm transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Toggle Status */}
                          <button
                            onClick={async () => {
                              await onToggleStatus(task);
                              // Refresh results locally
                              setResults((prev) =>
                                prev.map((t) =>
                                  t._id === task._id
                                    ? {
                                        ...t,
                                        status:
                                          t.status === 'Completed'
                                            ? 'In Progress'
                                            : 'Completed',
                                      }
                                    : t
                                )
                              );
                            }}
                            className="mt-0.5 text-slate-400 hover:text-indigo-600 flex-shrink-0"
                            title="Toggle Status"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                            )}
                          </button>

                          {/* Task Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4
                                className={`text-sm font-semibold ${
                                  isCompleted
                                    ? 'line-through text-slate-400'
                                    : 'text-slate-800'
                                }`}
                              >
                                {task.title}
                              </h4>
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${pStyle.bg}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full mr-1 ${pStyle.dot}`}
                                />
                                {task.priority}
                              </span>
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

                            {task.description && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-medium">
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

                          {/* Action Options (Required by assignment: view/edit/delete from search results) */}
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              onClick={() => {
                                onClose();
                                onEditTask(task);
                              }}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Edit Task"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async () => {
                                await onDeleteTask(task);
                                setResults((prev) =>
                                  prev.filter((t) => t._id !== task._id)
                                );
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
