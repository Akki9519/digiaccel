import React from 'react';

export default function Onboarding({ onGetStarted }) {
  return (
    <div className="w-full h-full min-h-[660px] flex flex-col bg-white select-none overflow-hidden">
      {/* Hero section */}
      <div className="relative w-full flex-[1.9] bg-[#4566EC] overflow-hidden flex flex-col justify-between p-6">
        <div className="absolute -top-7 -right-7 w-28 h-28 rounded-full border-[10px] border-[#5677FF] pointer-events-none" />

        <div className="pt-10 pl-2">
          <svg
            className="w-16 h-14 text-[#5677FF]"
            viewBox="0 0 48 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 2 8 L 9 2 L 17 8 L 25 2 L 33 8 L 41 2 L 46 6" />
            <path d="M 2 18 L 9 12 L 17 18 L 25 12 L 33 18 L 41 12 L 46 16" />
            <path d="M 2 28 L 9 22 L 17 28 L 25 22 L 33 28 L 41 22 L 46 26" />
          </svg>
        </div>

        <div className="flex justify-end pr-2 pb-1">
          <svg
            className="w-16 h-14 text-[#5677FF]"
            viewBox="0 0 48 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 2 8 L 9 2 L 17 8 L 25 2 L 33 8 L 41 2 L 46 6" />
            <path d="M 2 18 L 9 12 L 17 18 L 25 12 L 33 18 L 41 12 L 46 16" />
            <path d="M 2 28 L 9 22 L 17 28 L 25 22 L 33 28 L 41 22 L 46 26" />
          </svg>
        </div>
      </div>

      {/* Intro info */}
      <div className="w-full flex-1 bg-white px-6 pt-5 pb-6 flex flex-col justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-snug">
            Manage What To Do
          </h1>
          <p className="text-[12px] text-slate-400 mt-2 leading-relaxed max-w-[250px]">
            The best way to manage what you have to do, don't forget your plans
          </p>
        </div>

        <div className="pt-4 pb-1">
          <button
            onClick={onGetStarted}
            className="w-full h-11 bg-[#4566EC] hover:bg-[#3B5BD6] active:scale-[0.99] text-white text-[13px] font-semibold rounded-[4px] transition-colors cursor-pointer flex items-center justify-center tracking-wide"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
