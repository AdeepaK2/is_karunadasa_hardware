"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  CheckCircle,
  CalendarDays,
  Info,
} from "lucide-react";
import { Employee } from "@/types";
import { format } from "date-fns";
import MonthlyAttendance from "@/components/MonthlyAttendance";
import { initializeDummyAttendance } from "@/lib/mockData";

type AttendanceStatus = "Present" | "Absent" | "On Leave" | "Late";

const ATTENDANCE_STORAGE_KEY = "pos.attendance.v1";

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [attendanceData, setAttendanceData] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [showMonthlyAttendance, setShowMonthlyAttendance] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    role: "cashier" as "admin" | "manager" | "cashier",
    phone: "",
    email: "",
    salary: 0,
    joiningDate: new Date(),
    isActive: true,
    attendanceStatus: "present" as "present" | "absent" | "leave",
  });

  // Initialize dummy attendance data on first load
  useEffect(() => {
    initializeDummyAttendance();
  }, []);

  // Load attendance data when date changes
  useEffect(() => {
    const loadAttendanceForDate = () => {
      try {
        const storedData = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
        if (storedData) {
          const allAttendance = JSON.parse(storedData);
          const dateAttendance: Record<string, AttendanceStatus> = {};

          employees.forEach((employee) => {
            const key = `${employee.id}-${selectedDate}`;
            if (allAttendance[key]) {
              dateAttendance[employee.id] = allAttendance[key];
            }
          });

          setAttendanceData(dateAttendance);
        }
      } catch (error) {
        console.error("Error loading attendance data:", error);
      }
    };

    loadAttendanceForDate();
  }, [selectedDate, employees]);

  // Save attendance status for a specific employee and date
  const saveAttendance = (employeeId: string, status: AttendanceStatus) => {
    try {
      const storedData = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      const allAttendance = storedData ? JSON.parse(storedData) : {};

      const key = `${employeeId}-${selectedDate}`;
      allAttendance[key] = status;

      localStorage.setItem(
        ATTENDANCE_STORAGE_KEY,
        JSON.stringify(allAttendance)
      );

      setAttendanceData((prev) => ({
        ...prev,
        [employeeId]: status,
      }));
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  // Mark all employees as present for the selected date
  const markAllPresent = () => {
    try {
      const storedData = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      const allAttendance = storedData ? JSON.parse(storedData) : {};

      const newAttendanceData: Record<string, AttendanceStatus> = {};

      employees.forEach((employee) => {
        const key = `${employee.id}-${selectedDate}`;
        allAttendance[key] = "Present";
        newAttendanceData[employee.id] = "Present";
      });

      localStorage.setItem(
        ATTENDANCE_STORAGE_KEY,
        JSON.stringify(allAttendance)
      );
      setAttendanceData(newAttendanceData);
    } catch (error) {
      console.error("Error marking all present:", error);
    }
  };

  // Calculate attendance counters for selected date
  const getAttendanceCounters = () => {
    const counters = {
      total: employees.length,
      present: 0,
      absent: 0,
      onLeave: 0,
      late: 0,
    };

    employees.forEach((employee) => {
      const status = attendanceData[employee.id];
      if (status === "Present") counters.present++;
      else if (status === "Absent") counters.absent++;
      else if (status === "On Leave") counters.onLeave++;
      else if (status === "Late") counters.late++;
    });

    return counters;
  };

  const attendanceCounters = getAttendanceCounters();

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone.includes(searchQuery) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || employee.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formData);
    } else {
      addEmployee(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "cashier",
      phone: "",
      email: "",
      salary: 0,
      joiningDate: new Date(),
      isActive: true,
      attendanceStatus: "present",
    });
    setEditingEmployee(null);
    setShowModal(false);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      role: employee.role,
      phone: employee.phone,
      email: employee.email || "",
      salary: employee.salary,
      joiningDate: employee.joiningDate,
      isActive: employee.isActive,
      attendanceStatus: employee.attendanceStatus,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id);
    }
  };

  const handleOpenMonthlyAttendance = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowMonthlyAttendance(true);
  };

  const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);
  const activeEmployees = employees.filter((e) => e.isActive).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Employee Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage staff information and attendance
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Employees
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {employees.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {activeEmployees}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monthly Salary
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            LKR {totalSalary.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Avg. Salary
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            LKR{" "}
            {employees.length > 0
              ? Math.round(totalSalary / employees.length).toLocaleString()
              : 0}
          </p>
        </div>
      </div>

      {/* Attendance Date Selector & Stats */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
            📊 Sample Attendance Data Available
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Dummy attendance data for October 2025 has been loaded. Click the
            calendar icon <CalendarDays className="w-3 h-3 inline" /> in the
            Actions column to view monthly attendance for any employee.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Attendance Date:
              </label>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))}
              className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 font-medium"
            >
              Today
            </button>
            <button
              onClick={markAllPresent}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Mark All Present
            </button>
          </div>
        </div>

        {/* Attendance Counters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
              {attendanceCounters.total}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-900">
            <p className="text-xs text-green-600 dark:text-green-400">
              Present
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
              {attendanceCounters.present}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-900">
            <p className="text-xs text-red-600 dark:text-red-400">Absent</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
              {attendanceCounters.absent}
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-900">
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              On Leave
            </p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
              {attendanceCounters.onLeave}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-900">
            <p className="text-xs text-orange-600 dark:text-orange-400">Late</p>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400 mt-1">
              {attendanceCounters.late}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="cashier">Cashier</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Joining Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Attendance ({format(new Date(selectedDate), "MMM dd")})
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {employee.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full capitalize">
                      {employee.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                    {employee.phone}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                    LKR {employee.salary.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                    {format(new Date(employee.joiningDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={attendanceData[employee.id] || ""}
                      onChange={(e) =>
                        saveAttendance(
                          employee.id,
                          e.target.value as AttendanceStatus
                        )
                      }
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        !attendanceData[employee.id]
                          ? "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700"
                          : attendanceData[employee.id] === "Present"
                          ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                          : attendanceData[employee.id] === "Absent"
                          ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                          : attendanceData[employee.id] === "On Leave"
                          ? "border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                          : "border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400"
                      }`}
                    >
                      <option value="">Not Marked</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Late">Late</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        employee.isActive
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {employee.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenMonthlyAttendance(employee)}
                        className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg"
                        title="View Monthly Attendance"
                      >
                        <CalendarDays className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(employee)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+94 71 234 5678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary *
                </label>
                <input
                  type="number"
                  required
                  value={formData.salary || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attendance Status *
                </label>
                <select
                  value={formData.attendanceStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attendanceStatus: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="leave">On Leave</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Active Employee
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingEmployee ? "Update Employee" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Monthly Attendance Modal */}
      {showMonthlyAttendance && selectedEmployee && (
        <MonthlyAttendance
          employeeId={selectedEmployee.id}
          employeeName={selectedEmployee.name}
          month={format(new Date(selectedDate), "yyyy-MM")}
          onClose={() => {
            setShowMonthlyAttendance(false);
            setSelectedEmployee(null);
            // Reload attendance data to reflect any changes
            const loadAttendanceForDate = () => {
              try {
                const storedData = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
                if (storedData) {
                  const allAttendance = JSON.parse(storedData);
                  const dateAttendance: Record<string, AttendanceStatus> = {};

                  employees.forEach((employee) => {
                    const key = `${employee.id}-${selectedDate}`;
                    if (allAttendance[key]) {
                      dateAttendance[employee.id] = allAttendance[key];
                    }
                  });

                  setAttendanceData(dateAttendance);
                }
              } catch (error) {
                console.error("Error loading attendance data:", error);
              }
            };
            loadAttendanceForDate();
          }}
        />
      )}
    </div>
  );
}
