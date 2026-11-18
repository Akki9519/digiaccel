import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { toDatetimeLocal } from '../utils/dateHelpers';

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit = null,
  initialDate = null,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('In Progress');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDateTime(toDatetimeLocal(taskToEdit.dateTime));
      setPriority(taskToEdit.priority || 'Medium');
      setStatus(taskToEdit.status || 'In Progress');
    } else {
      setTitle('');
      setDescription('');
      setDateTime(toDatetimeLocal(initialDate || new Date()));
      setPriority('Medium');
      setStatus('In Progress');
    }
    setErrors({});
  }, [taskToEdit, initialDate, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title is required';
    }
    if (!dateTime) {
      errs.dateTime = 'Date and time are required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        description: description.trim(),
        dateTime: new Date(dateTime).toISOString(),
        priority,
        status,
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save task' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick date presets
  const setQuickDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setMinutes(0);
    d.setSeconds(0);
    setDateTime(toDatetimeLocal(d));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {taskToEdit ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-xs text-slate-500">
                {taskToEdit
                  ? 'Update task details and schedule'
                  : 'Add a new task to your weekly planner'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
            {errors.form && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Title (Mandatory) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
                placeholder="e.g., Complete System Design Document"
                maxLength={160}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.title
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                } focus:outline-none focus:ring-2 transition bg-slate-50/30`}
              />
              {errors.title && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.title}</p>
              )}
            </div>

            {/* Description (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add subtasks, links, or context notes..."
                rows={3}
                maxLength={1000}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 focus:outline-none focus:ring-2 transition bg-slate-50/30"
              />
            </div>

            {/* Date & Time (Mandatory) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Date & Time <span className="text-rose-500">*</span>
                </label>
                {/* Quick Shortcuts */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setQuickDate(0)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium px-1.5 py-0.5 rounded bg-indigo-50"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(1)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium px-1.5 py-0.5 rounded bg-indigo-50"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => {
                  setDateTime(e.target.value);
                  if (errors.dateTime) setErrors((prev) => ({ ...prev, dateTime: null }));
                }}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.dateTime
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                } focus:outline-none focus:ring-2 transition bg-slate-50/30`}
              />
              {errors.dateTime && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.dateTime}</p>
              )}
            </div>

            {/* Priority (Optional, defaults to Medium) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        isSelected
                          ? p === 'High'
                            ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                            : p === 'Medium'
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-sky-500 text-white border-sky-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status (In Progress vs Completed) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['In Progress', 'Completed'].map((s) => {
                  const isSelected = status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        isSelected
                          ? s === 'Completed'
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                            : 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit & Cancel Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 active:scale-95 transition disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Saving...'
                  : taskToEdit
                  ? 'Save Changes'
                  : 'Create Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
