import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Check, Trash2, Edit3, X } from 'lucide-react';
import { api } from '../services/api';

export default function SearchScreen({
  isOpen,
  onClose,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      fetchAllTasks();
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  const fetchAllTasks = async () => {
    try {
      setIsLoading(true);
      const res = await api.getTasks();
      if (res.success && res.data) {
        setResults(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (val) => {
    setSearchTerm(val);
    if (!val.trim()) {
      fetchAllTasks();
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.getTasks({ search: val.trim() });
      if (res.success && res.data) {
        setResults(res.data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-white flex justify-center">
      <div className="w-full max-w-lg min-h-screen bg-white flex flex-col">
        <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for a task..."
              className="w-full pl-3.5 pr-10 py-2 bg-white border border-slate-200 rounded-xs text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4566EC] transition"
            />
            {searchTerm ? (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="py-16 text-center">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No tasks found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {results.map((task) => {
                const isCompleted = task.status === 'Completed';

                return (
                  <div
                    key={task._id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={async () => {
                          await onToggleStatus(task);
                          handleSearch(searchTerm);
                        }}
                        className={`w-5 h-5 rounded-xs flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                          isCompleted
                            ? 'bg-[#4566EC] border border-[#4566EC] text-white'
                            : 'border border-slate-300 hover:border-[#4566EC] bg-white'
                        }`}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <span
                          className={`text-sm font-medium block truncate ${
                            isCompleted
                              ? 'line-through text-slate-400 font-normal'
                              : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.description && (
                          <span className="text-xs text-slate-400 block truncate mt-0.5">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteTask(task);
                        }}
                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-xs transition"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.75]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onEditTask(task);
                        }}
                        className="p-1.5 hover:text-[#4566EC] hover:bg-blue-50 rounded-xs transition"
                        title="Edit task"
                      >
                        <Edit3 className="w-4 h-4 stroke-[1.75]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
