import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import WeekCard from './components/WeekCard';
import TaskModal from './components/TaskModal';
import SearchModal from './components/SearchModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { api } from './services/api';
import { Plus, RefreshCw, AlertCircle, CalendarRange } from 'lucide-react';

export default function App() {
  const [weeks, setWeeks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & Active state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [initialDateForTask, setInitialDateForTask] = useState(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load weekly tasks from API
  const loadData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      setError(null);
      const res = await api.getWeeklyTasks();
      if (res.success && res.data) {
        setWeeks(res.data.weeks || []);
        setSummary(res.data.summary || null);
      }
    } catch (err) {
      console.error('Failed to load weekly tasks:', err);
      setError(err.message || 'Unable to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Open Task Modal for Create
  const handleOpenCreateModal = (datePreset = null) => {
    setTaskToEdit(null);
    setInitialDateForTask(datePreset || new Date());
    setIsTaskModalOpen(true);
  };

  // Open Task Modal for Edit
  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setInitialDateForTask(null);
    setIsTaskModalOpen(true);
  };

  // Save Task (Create or Update)
  const handleSaveTask = async (taskPayload) => {
    if (taskToEdit) {
      await api.updateTask(taskToEdit._id, taskPayload);
    } else {
      await api.createTask(taskPayload);
    }
    await loadData(false);
  };

  // Toggle Task Status (Optimistic Update)
  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';

    // Optimistically update local state for immediate UI feedback
    setWeeks((prevWeeks) =>
      prevWeeks.map((week) => {
        const hasTask = week.tasks.some((t) => t._id === task._id);
        if (!hasTask) return week;

        const updatedTasks = week.tasks.map((t) =>
          t._id === task._id ? { ...t, status: nextStatus } : t
        );

        const openCount = updatedTasks.filter((t) => t.status === 'In Progress').length;
        const closedCount = updatedTasks.filter((t) => t.status === 'Completed').length;

        return {
          ...week,
          tasks: updatedTasks,
          openTasks: openCount,
          completedTasks: closedCount,
        };
      })
    );

    // Also optimistically update global summary
    setSummary((prev) => {
      if (!prev) return prev;
      const isNowCompleted = nextStatus === 'Completed';
      return {
        ...prev,
        totalOpen: isNowCompleted ? Math.max(0, prev.totalOpen - 1) : prev.totalOpen + 1,
        totalCompleted: isNowCompleted
          ? prev.totalCompleted + 1
          : Math.max(0, prev.totalCompleted - 1),
      };
    });

    try {
      await api.updateTaskStatus(task._id, nextStatus);
    } catch (err) {
      console.error('Failed to sync status:', err);
      // Rollback on failure
      loadData(false);
    }
  };

  // Delete Task flow
  const handlePromptDelete = (task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await api.deleteTask(taskToDelete._id);
      setTaskToDelete(null);
      await loadData(false);
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* Mobile-First Application Container */}
      <div className="w-full max-w-lg min-h-screen bg-slate-50 border-x border-slate-200/80 flex flex-col relative pb-24 shadow-xl">
        {/* Sticky Header */}
        <Header
          onOpenAddModal={() => handleOpenCreateModal()}
          onOpenSearch={() => setIsSearchOpen(true)}
          summary={summary}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 space-y-4">
          {/* Productivity Stats Banner */}
          <StatsOverview summary={summary} />

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => loadData(true)}
                className="px-2 py-1 bg-white rounded-lg border border-rose-200 text-rose-700 font-semibold hover:bg-rose-100 text-[11px]"
              >
                Retry
              </button>
            </div>
          )}

          {/* Weekly Sections List */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CalendarRange className="w-3.5 h-3.5 text-indigo-500" />
                <span>Weekly Task Overview</span>
              </h2>
              <button
                onClick={() => loadData(false)}
                className="text-slate-400 hover:text-indigo-600 transition p-1"
                title="Refresh Weekly Tasks"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-28 rounded-2xl bg-white animate-pulse border border-slate-200/80 p-4"
                  >
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-slate-100 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : weeks.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center my-6 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <CalendarRange className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Weekly Tasks Yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Get started by adding your first task. Tasks are automatically organized by Monday-to-Sunday weeks.
                </p>
                <button
                  onClick={() => handleOpenCreateModal()}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Task</span>
                </button>
              </div>
            ) : (
              /* Weekly Cards Accordions */
              weeks.map((week) => (
                <WeekCard
                  key={week.weekId}
                  weekData={week}
                  defaultExpanded={true}
                  onToggleStatus={handleToggleStatus}
                  onEditTask={handleOpenEditModal}
                  onDeleteTask={handlePromptDelete}
                  onAddTaskToWeek={(weekStartDate) =>
                    handleOpenCreateModal(weekStartDate)
                  }
                />
              ))
            )}
          </div>
        </main>

        {/* Floating Action Button (FAB) for convenient mobile thumb access */}
        <div className="fixed bottom-6 right-6 sm:absolute sm:bottom-6 sm:right-6 z-30">
          <button
            onClick={() => handleOpenCreateModal()}
            className="w-13 h-13 p-3.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-300 active:scale-90 transition-transform flex items-center justify-center"
            title="Add New Task"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Modals */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
          initialDate={initialDateForTask}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onEditTask={handleOpenEditModal}
          onDeleteTask={handlePromptDelete}
          onToggleStatus={handleToggleStatus}
        />

        <DeleteConfirmModal
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={handleConfirmDelete}
          task={taskToDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
