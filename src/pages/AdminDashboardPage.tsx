import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardData, type DashboardData } from "../services/adminService";
import { Users, GraduationCap, BookOpen, UserCheck } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient = "from-blue-500 via-blue-600 to-cyan-500",
  bgGradient = "from-blue-50 to-cyan-50",
  iconBg = "bg-gradient-to-br from-blue-500 to-cyan-500",
}: {
  title: string;
  value: number;
  icon: any;
  gradient?: string;
  bgGradient?: string;
  iconBg?: string;
}) => (
  <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:-translate-y-2 cursor-pointer overflow-hidden">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
    ></div>
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`${iconBg} p-4 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      <h3
        className={`text-sm font-bold mb-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300`}
      >
        {title}
      </h3>
      <p
        className={`text-5xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block drop-shadow-lg`}
      >
        {value}
      </p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const data = await getDashboardData(token);
          setDashboardData(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-700 font-semibold text-lg">
              Loading Dashboard
            </p>
            <div className="flex gap-1.5">
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <p className="text-red-600 text-center">Error: {error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
        <p className="text-yellow-700 text-center">No data available.</p>
      </div>
    );
  }

  const { stats } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 font-medium">
          Welcome back, Admin! 👋
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          gradient="from-blue-500 via-blue-600 to-cyan-500"
          bgGradient="from-blue-50 to-cyan-50"
          iconBg="bg-gradient-to-br from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Total Instructors"
          value={stats.totalInstructors}
          icon={GraduationCap}
          gradient="from-purple-500 via-purple-600 to-pink-500"
          bgGradient="from-purple-50 to-pink-50"
          iconBg="bg-gradient-to-br from-purple-500 to-pink-500"
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          gradient="from-green-500 via-emerald-600 to-teal-500"
          bgGradient="from-green-50 to-teal-50"
          iconBg="bg-gradient-to-br from-green-500 to-teal-500"
        />
        <StatCard
          title="Total Enrollments"
          value={stats.totalEnrollments}
          icon={UserCheck}
          gradient="from-orange-500 via-red-500 to-pink-500"
          bgGradient="from-orange-50 to-pink-50"
          iconBg="bg-gradient-to-br from-orange-500 to-pink-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
          Quick Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border-l-4 border-blue-500 hover:shadow-md">
            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">
              Average Enrollments per Course
            </p>
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {stats.totalCourses > 0
                ? (stats.totalEnrollments / stats.totalCourses).toFixed(1)
                : "0"}
            </p>
          </div>
          <div className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border-l-4 border-green-500 hover:shadow-md">
            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">
              Student to Instructor Ratio
            </p>
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              {stats.totalInstructors > 0
                ? (stats.totalStudents / stats.totalInstructors).toFixed(1)
                : "0"}
              :1
            </p>
          </div>
          <div className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border-l-4 border-purple-500 hover:shadow-md">
            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">
              Courses per Instructor
            </p>
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {stats.totalInstructors > 0
                ? (stats.totalCourses / stats.totalInstructors).toFixed(1)
                : "0"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
