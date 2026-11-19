import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import CalendarStrip from './components/CalendarStrip';
import StatsOverview from './components/StatsOverview';
import TaskItem from './components/TaskItem';
import TaskModal from './components/TaskModal';
import SearchScreen from './components/SearchScreen';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Onboarding from './components/Onboarding';
import { api } from './services/api';
import { Plus, AlertCircle } from 'lucide-react';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('has_seen_onboarding') !== 'true';
  });

  const [weeks, setWeeks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [viewAllWeeks, setViewAllWeeks] = useState(false);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load weekly tasks from backend
  const loadData = useCallback(async () => {
    try {
      setError(null);
      const res = await api.getWeeklyTasks();
      if (res.success && res.data) {
        setWeeks(res.data.weeks || []);
        setSummary(res.data.summary || null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFinishOnboarding = () => {
    localStorage.setItem('has_seen_onboarding', 'true');
    setShowOnboarding(false);
  };

  const handleOpenCreateModal = (datePreset = null) => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskPayload) => {
    if (taskToEdit) {
      await api.updateTask(taskToEdit._id, taskPayload);
    } else {
      await api.createTask(taskPayload);
    }
    await loadData();
  };

  const handleToggleStatus = async (task) => {
    try {
      const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
      await api.updateTaskStatus(task._id, nextStatus);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await api.deleteTask(taskToDelete._id);
      setTaskToDelete(null);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter tasks based on selected day or show all
  const displayedTasks = useMemo(() => {
    const all = weeks.flatMap((w) => w.tasks || []);
    if (!selectedDate || viewAllWeeks) return all;

    const filtered = all.filter((t) => {
      const d = new Date(t.dateTime);
      return (
        d.getFullYear() === selectedDate.getFullYear() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getDate() === selectedDate.getDate()
      );
    });

    return filtered.length > 0 ? filtered : all;
  }, [weeks, selectedDate, viewAllWeeks]);

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center py-2 sm:py-6">
        <div className="w-full max-w-[365px] h-[700px] bg-white shadow-2xl relative flex flex-col overflow-hidden sm:rounded-[24px] border border-slate-200">
          <Onboarding onGetStarted={handleFinishOnboarding} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center py-2 sm:py-6 selection:bg-blue-100">
      <div className="w-full max-w-[365px] h-[700px] bg-white shadow-xl flex flex-col relative overflow-hidden sm:rounded-[24px] border border-slate-200">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenOnboarding={() => setShowOnboarding(true)}
        />

        <main className="flex-1 px-4 space-y-3.5 pt-1 overflow-y-auto pb-20 no-scrollbar">
          <CalendarStrip
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              if (date) setViewAllWeeks(false);
            }}
          />

          <StatsOverview
            summary={summary}
            weekLabel="This Week"
          />

          {error && (
            <div className="p-3 rounded-xs bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <button
                onClick={loadData}
                className="px-2.5 py-1 bg-white rounded-xs border border-rose-200 text-rose-700 font-semibold hover:bg-rose-100"
              >
                Retry
              </button>
            </div>
          )}

          <div className="pt-1">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Tasks Today
              </h3>
              <button
                type="button"
                onClick={() => setViewAllWeeks(!viewAllWeeks)}
                className="text-xs font-semibold text-[#4566EC] hover:underline cursor-pointer"
              >
                {viewAllWeeks ? 'Show Selected' : 'View All'}
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-2.5 py-2">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-12 rounded-xs bg-slate-50 animate-pulse border border-slate-100 p-2.5 flex items-center gap-3"
                  >
                    <div className="w-4 h-4 rounded-xs bg-slate-200" />
                    <div className="flex-1 h-3 bg-slate-200 rounded-xs w-2/3" />
                  </div>
                ))}
              </div>
            ) : displayedTasks.length === 0 ? (
              <div className="py-8 text-center bg-slate-50/70 rounded-xs border border-dashed border-slate-200 p-5 my-2">
                <p className="text-xs font-semibold text-slate-700">No tasks for this day</p>
                <button
                  onClick={() => handleOpenCreateModal(selectedDate)}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4566EC] hover:bg-blue-600 text-white rounded-xs text-xs font-semibold active:scale-95 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {displayedTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onEditTask={handleOpenEditModal}
                    onDeleteTask={(t) => setTaskToDelete(t)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            onClick={() => handleOpenCreateModal(selectedDate)}
            className="w-13 h-13 bg-[#4566EC] hover:bg-[#3B5BD6] active:scale-90 text-white rounded-full shadow-lg shadow-blue-500/35 transition-all flex items-center justify-center cursor-pointer"
            title="Add New Task"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
          initialDate={selectedDate}
        />

        <SearchScreen
          isOpen={isSearchOpen}
          onClose={() => {
            setIsSearchOpen(false);
            loadData();
          }}
          onEditTask={handleOpenEditModal}
          onDeleteTask={(t) => setTaskToDelete(t)}
          onToggleStatus={handleToggleStatus}
        />

        <DeleteConfirmModal
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={handleDeleteTask}
          task={taskToDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
