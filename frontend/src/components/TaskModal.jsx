import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit = null,
  initialDate = null,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('In Progress');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');

      const d = taskToEdit.dateTime ? new Date(taskToEdit.dateTime) : new Date();
      setDateStr(d.toISOString().split('T')[0]);

      setStartTime(taskToEdit.startTime || '');
      setEndTime(taskToEdit.endTime || '');
      setPriority(taskToEdit.priority || 'Medium');
      setStatus(taskToEdit.status || 'In Progress');
    } else {
      setTitle('');
      setDescription('');
      const baseDate = initialDate ? new Date(initialDate) : new Date();
      setDateStr(baseDate.toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('10:00');
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
    if (!dateStr) {
      errs.dateStr = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const [year, month, day] = dateStr.split('-');
      const [hours, minutes] = (startTime || '09:00').split(':');
      const combinedDate = new Date(year, parseInt(month, 10) - 1, day, hours, minutes);

      await onSave({
        title: title.trim(),
        description: description.trim(),
        dateTime: combinedDate.toISOString(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl p-6 max-h-[92vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {taskToEdit ? 'Edit Task' : 'Add New Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errors.form && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Task title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className={`w-full px-3.5 py-2.5 rounded-xs border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4566EC] transition ${
                  errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
                autoFocus
              />
              {errors.title && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Set Time
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative flex items-center">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xs border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4566EC]"
                  />
                </div>

                <div className="relative flex items-center">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xs border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4566EC]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Set Date
              </label>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#4566EC]"
                />
              </div>
              {errors.dateStr && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">
                  {errors.dateStr}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
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
                      className={`py-2 px-3 text-xs font-semibold rounded-xs border transition-all cursor-pointer ${
                        isSelected
                          ? p === 'High'
                            ? 'bg-rose-50 border-rose-300 text-rose-700 ring-1 ring-rose-400'
                            : p === 'Medium'
                            ? 'bg-amber-50 border-amber-300 text-amber-700 ring-1 ring-amber-400'
                            : 'bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-400'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xs border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4566EC] transition resize-none"
              />
            </div>

            {taskToEdit && (
              <div className="flex items-center justify-between p-3 rounded-xs bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-700">Completed</span>
                <input
                  type="checkbox"
                  checked={status === 'Completed'}
                  onChange={(e) => setStatus(e.target.checked ? 'Completed' : 'In Progress')}
                  className="w-4 h-4 rounded-xs text-[#4566EC] focus:ring-[#4566EC]"
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#4566EC] hover:bg-[#3B5BD6] active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting
                  ? 'Saving...'
                  : taskToEdit
                  ? 'Update task'
                  : 'Create task'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
