
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCourses, toggleCourseStatus, type CourseFilters } from '../services/adminService';
import type { PaginatedAdminCoursesResponse } from '../types/index';
import { debounce } from 'lodash';

const LoadingSpinner = ({ message = "Loading Courses" }) => {
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
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminCoursesPage = () => {
  const { token } = useAuth();
  const [coursesResponse, setCoursesResponse] = useState<PaginatedAdminCoursesResponse | null>(null);
  const [filters, setFilters] = useState<CourseFilters>({ page: 1, limit: 10, category: '', isActive: '', search: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async (currentFilters: CourseFilters) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCourses(token, currentFilters);
      setCoursesResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const debouncedFetch = useCallback(debounce((newFilters) => fetchCourses(newFilters), 500), [fetchCourses]);

  useEffect(() => {
    debouncedFetch(filters);
    return () => debouncedFetch.cancel();
  }, [filters, debouncedFetch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, page: 1, [e.target.name]: e.target.value }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (coursesResponse && newPage > coursesResponse.pagination.totalPages)) {
      return;
    }
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleToggleStatus = async (courseId: string) => {
    if (!token || !window.confirm("Are you sure you want to change this course's status?")) return;
    try {
      const updatedCourse = await toggleCourseStatus(courseId, token);
      setCoursesResponse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          data: prev.data.map(course => 
            course._id === courseId ? { ...course, isActive: updatedCourse.isActive } : course
          ),
        };
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Course Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-md">
        <input 
          type="text" 
          name="search" 
          placeholder="Search by title..." 
          onChange={handleFilterChange} 
          className="p-2 border rounded text-sm sm:text-base" 
        />
        <input 
          type="text" 
          name="category" 
          placeholder="Filter by category..." 
          onChange={handleFilterChange} 
          className="p-2 border rounded text-sm sm:text-base" 
        />
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
      
     
      {isLoading && <LoadingSpinner message="Loading courses..." />}
      
      
      {error && <p className="text-red-500 text-center py-4">Error: {error}</p>}

      {!isLoading && coursesResponse && (
        <>
         
          <div className="block lg:hidden space-y-4">
            {coursesResponse.data.map(course => (
              <div key={course._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.instructor?.name || 'Instructor Not Found'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {course.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Enrollments:</span>
                    <p className="font-semibold">{course.enrollmentCount}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <p className="font-medium">{new Date(course.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggleStatus(course._id)} 
                  className="w-full text-blue-500 hover:text-blue-700 font-medium py-2 border border-blue-500 rounded hover:bg-blue-50 transition"
                >
                  {course.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>

          <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="p-4">Title</th>
                  <th className="p-4">Instructor</th>
                  <th className="p-4">Enrollments</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coursesResponse.data.map(course => (
                  <tr key={course._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{course.title}</td>
                    <td className="p-4">{course.instructor?.name || 'Instructor Not Found'}</td>
                    <td className="p-4 font-semibold text-center">{course.enrollmentCount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">{new Date(course.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 whitespace-nowrap">
                      <button onClick={() => handleToggleStatus(course._id)} className="text-blue-500 hover:underline">
                        {course.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    
      {!isLoading && coursesResponse?.pagination && coursesResponse.pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-4 sm:mt-6 gap-3">
          <button 
            onClick={() => handlePageChange(coursesResponse.pagination.currentPage - 1)} 
            disabled={!coursesResponse.pagination.hasPreviousPage} 
            className="w-full sm:w-auto px-4 py-2 border rounded-md mx-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            &larr; Previous
          </button>
          <span className="px-4 text-sm sm:text-base">
            Page {coursesResponse.pagination.currentPage} of {coursesResponse.pagination.totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(coursesResponse.pagination.currentPage + 1)} 
            disabled={!coursesResponse.pagination.hasNextPage} 
            className="w-full sm:w-auto px-4 py-2 border rounded-md mx-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;