"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Period = "today" | "week" | "month" | "year";

interface PeriodSelectorProps {
  value: Period;
  onChange: (value: Period) => void;
}

const periods: { value: Period; label: string }[] = [
  { value: "today", label: "오늘" },
  { value: "week", label: "이번 주" },
  { value: "month", label: "이번 달" },
  { value: "year", label: "올해" },
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentPeriod = periods.find(p => p.value === value) || periods[1]; // 기본값: 이번 주

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentPeriod.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => {
                  onChange(period.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  value === period.value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
