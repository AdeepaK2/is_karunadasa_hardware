"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameMonth,
  isWeekend,
} from "date-fns";

type AttendanceStatus = "Present" | "Absent" | "On Leave" | "Late";

interface MonthlyAttendanceProps {
  employeeId: string;
  employeeName: string;
  month: string; // YYYY-MM format
  onClose: () => void;
}

interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

interface DayPopoverState {
  isOpen: boolean;
  date: string;
  x: number;
  y: number;
}

const ATTENDANCE_STORAGE_KEY = "pos.attendance.v1";

const STATUS_COLORS = {
  Present: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-400",
    border: "border-green-300 dark:border-green-700",
    chip: "P",
  },
  Absent: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-400",
    border: "border-red-300 dark:border-red-700",
    chip: "A",
  },
  "On Leave": {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-400",
    border: "border-yellow-300 dark:border-yellow-700",
    chip: "L",
  },
  Late: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-800 dark:text-orange-400",
    border: "border-orange-300 dark:border-orange-700",
    chip: "Late",
  },
};

export default function MonthlyAttendance({
  employeeId,
  employeeName,
  month,
  onClose,
}: MonthlyAttendanceProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(month + "-01")
  );
  const [attendanceData, setAttendanceData] = useState<
    Map<string, AttendanceStatus>
  >(new Map());
  const [popover, setPopover] = useState<DayPopoverState>({
    isOpen: false,
    date: "",
    x: 0,
    y: 0,
  });
  const popoverRef = useRef<HTMLDivElement>(null);

  // Load attendance data for the current month
  useEffect(() => {
    loadAttendanceData();
  }, [currentMonth, employeeId]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setPopover({ isOpen: false, date: "", x: 0, y: 0 });
      }
    };

    if (popover.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popover.isOpen]);

  const loadAttendanceData = () => {
    try {
      const storedData = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      if (storedData) {
        const allAttendance = JSON.parse(storedData);
        const monthData = new Map<string, AttendanceStatus>();

        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

        days.forEach((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const key = `${employeeId}-${dateStr}`;
          if (allAttendance[key]) {
            monthData.set(dateStr, allAttendance[key]);
          }
        });

        setAttendanceData(monthData);
      }
    } catch (error) {
      console.error("Error loading attendance data:", error);
    }
  };

  const saveAttendance = (date: string, status: AttendanceStatus) => {
    try {
      const storedData = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      const allAttendance = storedData ? JSON.parse(storedData) : {};

      const key = `${employeeId}-${date}`;
      allAttendance[key] = status;

      localStorage.setItem(
        ATTENDANCE_STORAGE_KEY,
        JSON.stringify(allAttendance)
      );

      setAttendanceData((prev) => {
        const newData = new Map(prev);
        newData.set(date, status);
        return newData;
      });
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  const handleDayClick = (date: Date, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const dateStr = format(date, "yyyy-MM-dd");

    setPopover({
      isOpen: true,
      date: dateStr,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });
  };

  const handleStatusChange = (status: AttendanceStatus) => {
    if (popover.date) {
      saveAttendance(popover.date, status);
      setPopover({ isOpen: false, date: "", x: 0, y: 0 });
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Calculate calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart); // 0 = Sunday

  // Pad the beginning of the calendar
  const paddingDays = Array(startDayOfWeek).fill(null);
  const calendarDays = [...paddingDays, ...days];

  // Calculate KPIs
  const calculateKPIs = () => {
    let workingDays = 0;
    let presentDays = 0;
    let absentDays = 0;
    let leaveDays = 0;
    let lateDays = 0;

    days.forEach((day) => {
      // Count weekdays as working days
      if (!isWeekend(day)) {
        workingDays++;
      }

      const dateStr = format(day, "yyyy-MM-dd");
      const status = attendanceData.get(dateStr);

      if (status === "Present") presentDays++;
      else if (status === "Absent") absentDays++;
      else if (status === "On Leave") leaveDays++;
      else if (status === "Late") lateDays++;
    });

    const attendancePercentage =
      workingDays > 0
        ? (((presentDays + lateDays) / workingDays) * 100).toFixed(1)
        : "0.0";

    return {
      workingDays,
      presentDays,
      absentDays,
      leaveDays,
      lateDays,
      attendancePercentage,
    };
  };

  const kpis = calculateKPIs();

  // Export to CSV
  const exportToCSV = () => {
    const rows = [["Employee ID", "Employee Name", "Date", "Day", "Status"]];

    days.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const status = attendanceData.get(dateStr) || "Not Marked";
      const dayName = format(day, "EEEE");

      rows.push([employeeId, employeeName, dateStr, dayName, status]);
    });

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${employeeName}-${format(
      currentMonth,
      "yyyy-MM"
    )}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      if (popover.isOpen) {
        setPopover({ isOpen: false, date: "", x: 0, y: 0 });
      } else {
        onClose();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Monthly Attendance - {employeeName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Employee ID: {employeeId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Month Switcher */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                {format(currentMonth, "MMMM yyyy")}
              </h4>
            </div>

            <button
              onClick={handleNextMonth}
              disabled={
                isSameMonth(currentMonth, new Date()) ||
                currentMonth > new Date()
              }
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next month"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Working Days
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {kpis.workingDays}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-900">
              <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                Present
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {kpis.presentDays}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-900">
              <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                Absent
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {kpis.absentDays}
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-900">
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">
                On Leave
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {kpis.leaveDays}
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-900">
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">
                Late
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {kpis.lateDays}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-900">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Attendance %
                </p>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {kpis.attendancePercentage}%
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Legend:
            </span>
            {Object.entries(STATUS_COLORS).map(([status, colors]) => (
              <div key={status} className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${colors.bg} ${colors.text}`}
                >
                  {colors.chip}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {status}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-bold rounded bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                —
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Not Marked
              </span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-700">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="px-2 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square border-r border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30"
                    />
                  );
                }

                const dateStr = format(day, "yyyy-MM-dd");
                const status = attendanceData.get(dateStr);
                const isWeekendDay = isWeekend(day);
                const isFuture = day > new Date();

                return (
                  <button
                    key={dateStr}
                    onClick={(e) => !isFuture && handleDayClick(day, e)}
                    disabled={isFuture}
                    className={`aspect-square border-r border-b border-gray-200 dark:border-gray-700 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors ${
                      isWeekendDay
                        ? "bg-gray-50 dark:bg-gray-900/50"
                        : "bg-white dark:bg-gray-800"
                    } ${
                      isFuture
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    aria-label={`${format(day, "MMMM d, yyyy")} - ${
                      status || "Not marked"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-between h-full">
                      <span
                        className={`text-sm font-medium ${
                          isWeekendDay
                            ? "text-gray-400 dark:text-gray-600"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {format(day, "d")}
                      </span>
                      {status ? (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_COLORS[status].bg} ${STATUS_COLORS[status].text}`}
                        >
                          {STATUS_COLORS[status].chip}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300 dark:text-gray-600 font-bold">
                          —
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Status Change Popover */}
      {popover.isOpen && (
        <div
          ref={popoverRef}
          className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-3 z-50"
          style={{
            left: `${popover.x}px`,
            top: `${popover.y}px`,
            transform: "translateX(-50%)",
          }}
          role="dialog"
          aria-label="Change attendance status"
        >
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {format(new Date(popover.date), "MMM dd, yyyy")}
          </p>
          <div className="space-y-1">
            {(
              Object.entries(STATUS_COLORS) as [
                AttendanceStatus,
                (typeof STATUS_COLORS)[AttendanceStatus]
              ][]
            ).map(([status, colors]) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${colors.bg} ${colors.text} hover:opacity-80`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
