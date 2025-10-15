import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  BookOpen,
  ChevronRight,
} from "lucide-react";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 text-white z-50 shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-white border-opacity-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              L
            </div>
            <div>
              <h1 className="text-lg font-bold">LMS Admin</h1>
              <p className="text-xs text-blue-200">Management Portal</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isSidebarOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <nav className="p-4 space-y-2">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-lg"
                    : "text-white hover:bg-white hover:bg-opacity-10"
                }`
              }
              onClick={closeSidebar}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-lg"
                    : "text-white hover:bg-white hover:bg-opacity-10"
                }`
              }
              onClick={closeSidebar}
            >
              <Users size={20} />
              <span className="font-medium">Users</span>
            </NavLink>
            <NavLink
              to="/admin/courses"
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-lg"
                    : "text-white hover:bg-white hover:bg-opacity-10"
                }`
              }
              onClick={closeSidebar}
            >
              <BookOpen size={20} />
              <span className="font-medium">Courses</span>
            </NavLink>
          </nav>
        </div>
      </div>

      <aside className="hidden lg:flex w-80 bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-900 text-white flex-col h-screen sticky top-0 shadow-2xl">
        <div className="p-6 border-b border-white border-opacity-10">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-500 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
              L
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">LMS Admin</h2>
              <p className="text-sm text-blue-300">Management Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 py-8 space-y-3">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `group flex items-center px-6 py-4 rounded-3xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-white hover:bg-white hover:bg-opacity-10"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard className="w-6 h-6" />
                <span className="ml-4 font-semibold text-lg">Dashboard</span>
                {isActive && <ChevronRight className="w-5 h-5 ml-auto" />}
              </>
            )}
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `group flex items-center px-6 py-4 rounded-3xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-white hover:bg-white hover:bg-opacity-10"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Users className="w-6 h-6" />
                <span className="ml-4 font-medium text-lg">Users</span>
                {isActive && <ChevronRight className="w-5 h-5 ml-auto" />}
              </>
            )}
          </NavLink>
          <NavLink
            to="/admin/courses"
            className={({ isActive }) =>
              `group flex items-center px-6 py-4 rounded-3xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-white hover:bg-white hover:bg-opacity-10"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <BookOpen className="w-6 h-6" />
                <span className="ml-4 font-medium text-lg">Courses</span>
                {isActive && <ChevronRight className="w-5 h-5 ml-auto" />}
              </>
            )}
          </NavLink>
        </nav>

        <div className="p-6 border-t border-white border-opacity-10">
          <button
            onClick={handleLogout}
            className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-3xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-auto mt-[73px] lg:mt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
