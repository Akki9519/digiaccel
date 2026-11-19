import React from 'react';

export default function CalendarStrip({
  selectedDate,
  onSelectDate,
  currentWeekStart = new Date(),
}) {
  const getDaysOfWeek = (baseDate) => {
    const days = [];
    const date = new Date(baseDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const days = getDaysOfWeek(currentWeekStart);

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full py-1">
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {days.map((dateItem) => {
          const isSelected = isSameDay(selectedDate, dateItem);
          const dayName = dayNames[dateItem.getDay()];
          const dateNumber = String(dateItem.getDate()).padStart(2, '0');

          return (
            <button
              key={dateItem.toISOString()}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : dateItem)}
              className={`flex flex-col items-center justify-center w-[40px] py-2 rounded-[6px] transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#4566EC] text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span
                className={`text-[10px] leading-tight ${
                  isSelected ? 'text-white' : 'text-slate-400'
                }`}
              >
                {dayName}
              </span>
              <span
                className={`text-[13px] font-bold leading-tight mt-1 ${
                  isSelected ? 'text-white' : 'text-slate-800'
                }`}
              >
                {dateNumber}
              </span>
              <span
                className={`w-1 h-1 rounded-full mt-1 ${
                  isSelected ? 'bg-white' : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
