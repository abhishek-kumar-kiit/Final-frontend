import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getUsers,
  toggleUserStatus,
  createAdmin,
  type UserFilters,
  type CreateAdminData,
} from "../services/adminService";
import type { PaginatedUsersResponse } from "../types/index";
import { debounce } from "lodash";
import { UserPlus } from "lucide-react";
import CreateAdminModal from "../components/CreateAdminModal";

const LoadingSpinner = ({ message = "Loading Users" }) => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-700 font-semibold text-lg">{message}</p>
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
};

const AdminUsersPage = () => {
  const { token } = useAuth();
  const [usersResponse, setUsersResponse] =
    useState<PaginatedUsersResponse | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    role: "",
    isActive: "",
    search: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const fetchUsers = useCallback(
    async (currentFilters: UserFilters) => {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUsers(token, currentFilters);
        setUsersResponse(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const debouncedFetch = useCallback(
    debounce((newFilters) => fetchUsers(newFilters), 500),
    [fetchUsers]
  );

  useEffect(() => {
    debouncedFetch(filters);
    return () => debouncedFetch.cancel();
  }, [filters, debouncedFetch]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (
      newPage < 1 ||
      (usersResponse && newPage > usersResponse.pagination.totalPages)
    ) {
      return;
    }
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleToggleStatus = async (userId: string) => {
    if (
      !token ||
      !window.confirm("Are you sure you want to change this user's status?")
    )
      return;
    try {
      const updatedUser = await toggleUserStatus(userId, token);
      setUsersResponse((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          data: prev.data.map((user) =>
            user._id === userId
              ? { ...user, isActive: updatedUser.isActive }
              : user
          ),
        };
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateAdmin = async (adminData: CreateAdminData) => {
    if (!token) {
      alert("No authentication token found");
      return;
    }
    setIsCreatingAdmin(true);
    try {
      console.log("Creating admin with data:", {
        ...adminData,
        password: "[REDACTED]",
      });
      const result = await createAdmin(adminData, token);
      console.log("Admin created successfully:", result);
      alert("Admin created successfully!");
      setIsModalOpen(false);

      fetchUsers(filters);
    } catch (err: any) {
      console.error("Failed to create admin:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Unknown error occurred";
      alert(`Failed to create admin: ${errorMessage}`);
      throw err;
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
        >
          <UserPlus size={20} />
          <span>Create Admin</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-md">
        <input
          type="text"
          name="search"
          placeholder="Search by name or email..."
          onChange={handleFilterChange}
          className="p-2 border rounded text-sm sm:text-base"
        />
        <select
          name="role"
          onChange={handleFilterChange}
          className="p-2 border rounded text-sm sm:text-base"
        >
          <option value="">All Roles</option>
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
        </select>
        <select
          name="isActive"
          onChange={handleFilterChange}
          className="p-2 border rounded text-sm sm:text-base"
        >
          <option value="">Any Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {isLoading && <LoadingSpinner message="Loading users..." />}

      {error && <p className="text-red-500 text-center py-4">Error: {error}</p>}

      {!isLoading && usersResponse && (
        <>
          <div className="block lg:hidden space-y-4">
            {usersResponse.data.map((user) => (
              <div key={user._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Role:</span>
                    <p className="font-semibold">{user.role}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Joined:</span>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleStatus(user._id)}
                  className="w-full text-blue-500 hover:text-blue-700 font-medium py-2 border border-blue-500 rounded hover:bg-blue-50 transition"
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>

          <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersResponse.data.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className="text-blue-500 hover:underline"
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!isLoading &&
        usersResponse?.pagination &&
        usersResponse.pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-4 sm:mt-6 gap-3">
            <button
              onClick={() =>
                handlePageChange(usersResponse.pagination.currentPage - 1)
              }
              disabled={!usersResponse.pagination.hasPreviousPage}
              className="w-full sm:w-auto px-4 py-2 border rounded-md mx-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              &larr; Previous
            </button>
            <span className="px-4 text-sm sm:text-base">
              Page {usersResponse.pagination.currentPage} of{" "}
              {usersResponse.pagination.totalPages}
            </span>
            <button
              onClick={() =>
                handlePageChange(usersResponse.pagination.currentPage + 1)
              }
              disabled={!usersResponse.pagination.hasNextPage}
              className="w-full sm:w-auto px-4 py-2 border rounded-md mx-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Next &rarr;
            </button>
          </div>
        )}

      <CreateAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAdmin}
        isLoading={isCreatingAdmin}
      />
    </div>
  );
};

export default AdminUsersPage;
