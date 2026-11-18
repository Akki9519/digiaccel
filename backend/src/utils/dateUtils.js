/**
 * Helper to compute the Monday-Sunday week bounds for a given Date.
 * Week starts on Monday (00:00:00.000) and ends on Sunday (23:59:59.999).
 */
function getWeekBounds(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid Date passed to getWeekBounds');
  }

  // day: 0 (Sun), 1 (Mon), ..., 6 (Sat)
  const day = date.getDay();
  // distance from Monday: if day is Sunday (0), distance is 6. Otherwise day - 1.
  const diffToMonday = day === 0 ? 6 : day - 1;

  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Unique identifier for the week, e.g. "2026-W47" or ISO date string
  const weekStartISO = startOfWeek.toISOString().split('T')[0];
  const weekEndISO = endOfWeek.toISOString().split('T')[0];

  return {
    startOfWeek,
    endOfWeek,
    weekStartISO,
    weekEndISO,
    weekId: `${weekStartISO}_to_${weekEndISO}`,
  };
}

/**
 * Format a human-readable week label (e.g., "Mon, Nov 17 – Sun, Nov 23, 2026")
 */
function formatWeekLabel(startDate, endDate) {
  const optionsShort = { month: 'short', day: 'numeric' };
  const optionsFull = { month: 'short', day: 'numeric', year: 'numeric' };

  const startStr = startDate.toLocaleDateString('en-US', optionsShort);
  const endStr = endDate.toLocaleDateString('en-US', optionsFull);

  return `${startStr} – ${endStr}`;
}

module.exports = {
  getWeekBounds,
  formatWeekLabel,
};
