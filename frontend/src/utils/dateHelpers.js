/**
 * Format a Date object or ISO string into a human-readable date.
 * e.g., "Wed, Nov 19, 2026"
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format time from a Date input
 * e.g., "03:30 PM"
 */
export function formatTime(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Convert ISO date to YYYY-MM-DDTHH:mm for datetime-local input fields
 */
export function toDatetimeLocal(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(date.getTime())) return '';

  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Identify if a week range is Current, Past, or Future relative to now
 */
export function getWeekContext(startDateStr, endDateStr) {
  const now = new Date();
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (now >= start && now <= end) {
    return { label: 'Current Week', tag: 'current', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
  } else if (now > end) {
    return { label: 'Past Week', tag: 'past', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  } else {
    return { label: 'Upcoming', tag: 'future', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  }
}

/**
 * Priority style tokens
 */
export const priorityStyles = {
  High: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    badge: 'High',
  },
  Medium: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    badge: 'Med',
  },
  Low: {
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
    badge: 'Low',
  },
};
