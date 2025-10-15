import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getCourseById, getLessonsByCourseId } from "../services/courseService";
import {
  enrollInCourse,
  markLessonAsComplete,
} from "../services/enrollmentService";
import { useAuth } from "../contexts/AuthContext";
import type { Course, Lesson } from "../types";
import {
  CheckCircleIcon,
  PlayCircleIcon,
  LockClosedIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const passedEnrollmentStatus = location.state?.isEnrolled || false;

  const { user, isAuthenticated, token } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [isMarking, setIsMarking] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const courseData = await getCourseById(courseId, token);

        if (location.state?.isEnrolled) {
          courseData.enrollment = passedEnrollmentStatus;
        }

        const lessonsData = await getLessonsByCourseId(courseId, token);
        setCourse(courseData);
        setLessons(lessonsData);
        if (lessonsData.length > 0) setSelectedLesson(lessonsData[0]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseId, token, passedEnrollmentStatus, location.state]);

  const handleEnroll = async () => {
    if (!token || !courseId) return;
    setIsEnrolling(true);
    setEnrollmentError(null);
    try {
      await enrollInCourse(courseId, token);
      setCourse((prev) => (prev ? { ...prev, enrollment: true } : null));
    } catch (err: any) {
      setEnrollmentError(err.message);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!token || !selectedLesson) return;
    setIsMarking(true);
    try {
      await markLessonAsComplete(selectedLesson._id, token);
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson._id === selectedLesson._id
            ? { ...lesson, isCompleted: true }
            : lesson
        )
      );
      setSelectedLesson((prev) =>
        prev ? { ...prev, isCompleted: true } : null
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsMarking(false);
    }
  };

  const getEmbedUrl = (url: string, videoType?: string) => {
    if (videoType === "link") {
      const youtubeMatch = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
      );
      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }

      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
    }

    return url;
  };

  const renderVideoPlayer = (lesson: Lesson) => {
    const embedUrl = getEmbedUrl(lesson.videoUrl, lesson.videoType);
    const isEmbedded = embedUrl !== lesson.videoUrl;

    if (isEmbedded) {
      return (
        <iframe
          key={lesson._id}
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={lesson.title}
        />
      );
    } else {
      return (
        <video
          key={lesson._id}
          className="w-full h-full"
          controls
          autoPlay
          src={lesson.videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  // Calculate progress
  const completedLessons = lessons.filter((l) => l.isCompleted).length;
  const totalLessons = lessons.length;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-700 font-medium text-base">
              Loading Course
            </p>
            <div className="flex gap-1">
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
  if (error)
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-md w-full">
          <p className="text-red-700 font-semibold">Error Loading Course</p>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      </div>
    );
  if (!course)
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Course not found.</p>
          <Link
            to="/courses"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );

  const isInstructorOwner =
    user?.role === "Instructor" && user?._id === course.instructor._id;
  const isEnrolledStudent = user?.role === "Student" && course.enrollment;
  const isStudent = user?.role === "Student";
  const canWatchVideo = isInstructorOwner || isEnrolledStudent;

  if (!course.isActive && !isInstructorOwner) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="text-center max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-12 w-full">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LockClosedIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Course Unavailable
          </h1>
          <p className="text-gray-600 mb-8">
            This course is no longer active and cannot be accessed.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition shadow-lg hover:shadow-xl"
          >
            ← Back to All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex-1 min-w-0 w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 leading-tight break-words">
              {course.title}
            </h1>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4">
              {course.description}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-sm border border-gray-200 w-full sm:w-auto">
                <AcademicCapIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Instructor:
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {course.instructor.name}
                </span>
              </div>

              {isInstructorOwner && (
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md">
                  ✨ Your Course
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-200 w-full sm:w-auto sm:min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ClockIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Total Lessons
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {totalLessons}
                </p>
              </div>
            </div>
            {isEnrolledStudent && totalLessons > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">
                    Progress
                  </span>
                  <span className="text-xs font-bold text-blue-600">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {completedLessons} of {totalLessons} completed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            {selectedLesson ? (
              <>
                <div
                  className="relative w-full"
                  style={{ paddingTop: "56.25%" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
                    {canWatchVideo ? (
                      renderVideoPlayer(selectedLesson)
                    ) : (
                      <>
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 sm:p-6 bg-gradient-to-t from-black/80 to-black/40">
                          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-8 max-w-md w-full border border-white/20">
                            <LockClosedIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white mb-3 sm:mb-4 mx-auto" />
                            <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                              Content Locked
                            </h3>
                            <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                              {isAuthenticated
                                ? "Enroll in this course to unlock all video lessons and start learning."
                                : "Please log in and enroll to access this exclusive content."}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-3 sm:mb-4 gap-3">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex-1 break-words">
                      {selectedLesson.title}
                    </h2>
                    {isEnrolledStudent && (
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex-shrink-0 ${
                          selectedLesson.isCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {selectedLesson.isCompleted ? (
                          <>
                            <CheckCircleIcon className="w-4 h-4" />
                            <span>Done</span>
                          </>
                        ) : (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                            <span>Pending</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className={`text-gray-700 mb-4 sm:mb-6 transition-all duration-300 ${
                      showFullDescription
                        ? "max-h-none"
                        : "max-h-[200px] overflow-hidden relative"
                    }`}
                  >
                    <div
                      className={`prose prose-sm max-w-none prose-html ${
                        !showFullDescription ? "mask-gradient" : ""
                      }`}
                    >
                      {selectedLesson.content.includes("<") &&
                      selectedLesson.content.includes(">") ? (
                        <div
                          className="space-y-2 text-sm sm:text-base"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(selectedLesson.content, {
                              ALLOWED_TAGS: [
                                "h1",
                                "h2",
                                "h3",
                                "h4",
                                "h5",
                                "h6",
                                "p",
                                "br",
                                "strong",
                                "em",
                                "b",
                                "i",
                                "u",
                                "ul",
                                "ol",
                                "li",
                                "a",
                                "blockquote",
                                "code",
                                "pre",
                                "span",
                                "div",
                                "img",
                                "table",
                                "thead",
                                "tbody",
                                "tr",
                                "th",
                                "td",
                              ],
                              ALLOWED_ATTR: [
                                "href",
                                "src",
                                "alt",
                                "title",
                                "class",
                                "id",
                              ],
                            } as any),
                          }}
                        />
                      ) : (
                        <ReactMarkdown
                          components={{
                            h1: ({ ...props }) => (
                              <h1
                                className="text-xl sm:text-2xl font-bold mt-4 mb-2"
                                {...props}
                              />
                            ),
                            h2: ({ ...props }) => (
                              <h2
                                className="text-lg sm:text-xl font-bold mt-3 mb-2"
                                {...props}
                              />
                            ),
                            h3: ({ ...props }) => (
                              <h3
                                className="text-base sm:text-lg font-bold mt-2 mb-1"
                                {...props}
                              />
                            ),
                            p: ({ ...props }) => (
                              <p
                                className="mb-2 text-sm sm:text-base"
                                {...props}
                              />
                            ),
                            ul: ({ ...props }) => (
                              <ul
                                className="list-disc list-inside mb-2 text-sm sm:text-base"
                                {...props}
                              />
                            ),
                            ol: ({ ...props }) => (
                              <ol
                                className="list-decimal list-inside mb-2 text-sm sm:text-base"
                                {...props}
                              />
                            ),
                            li: ({ ...props }) => (
                              <li className="ml-2" {...props} />
                            ),
                            strong: ({ ...props }) => (
                              <strong className="font-bold" {...props} />
                            ),
                            em: ({ ...props }) => (
                              <em className="italic" {...props} />
                            ),
                            code: ({ ...props }) => (
                              <code
                                className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm font-mono"
                                {...props}
                              />
                            ),
                            pre: ({ ...props }) => (
                              <pre
                                className="bg-gray-100 p-3 rounded mb-2 overflow-auto text-xs sm:text-sm"
                                {...props}
                              />
                            ),
                            blockquote: ({ ...props }) => (
                              <blockquote
                                className="border-l-4 border-gray-300 pl-4 italic my-2 text-sm sm:text-base"
                                {...props}
                              />
                            ),
                            a: ({ ...props }) => (
                              <a
                                className="text-blue-600 underline hover:text-blue-800 break-words"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {selectedLesson.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    {!showFullDescription && (
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
                    )}
                  </div>

                  {selectedLesson.content &&
                    selectedLesson.content.length > 300 && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                        className="mb-4 sm:mb-6 text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-2 transition-all duration-200 hover:gap-3 group"
                      >
                        {showFullDescription ? (
                          <>
                            <span>View Less</span>
                            <svg
                              className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          </>
                        ) : (
                          <>
                            <span>View More</span>
                            <svg
                              className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    )}

                  {isEnrolledStudent && (
                    <button
                      onClick={handleMarkComplete}
                      disabled={selectedLesson.isCompleted || isMarking}
                      className={`w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed ${
                        selectedLesson.isCompleted
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 active:scale-[0.98]"
                      }`}
                    >
                      {isMarking ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Marking...
                        </span>
                      ) : selectedLesson.isCompleted ? (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                          Lesson Completed
                        </span>
                      ) : (
                        "Mark as Complete"
                      )}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-base sm:text-lg">
                  This course has no lessons yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden lg:sticky lg:top-6">
            <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
              {(() => {
                if (isInstructorOwner) {
                  return (
                    <Link
                      to={`/instructor/courses/${course._id}/students`}
                      className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 sm:py-4 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        View Enrolled Students
                      </span>
                    </Link>
                  );
                }

                if (!isAuthenticated) {
                  return (
                    <Link
                      to="/login"
                      className="block w-full text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 sm:py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
                    >
                      Login to Enroll
                    </Link>
                  );
                }

                if (course.enrollment) {
                  return (
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-center rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-green-200 text-sm sm:text-base">
                      <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                      You're Enrolled!
                    </div>
                  );
                }

                if (isStudent) {
                  return (
                    <div className="space-y-3">
                      <button
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 sm:py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
                      >
                        {isEnrolling ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Enrolling...
                          </span>
                        ) : (
                          "Enroll Now"
                        )}
                      </button>
                      {enrollmentError && (
                        <div className="p-3 bg-red-50 text-red-600 text-xs sm:text-sm rounded-lg border border-red-200">
                          {enrollmentError}
                        </div>
                      )}
                    </div>
                  );
                }

                return null;
              })()}
            </div>

            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                Course Lessons
              </h3>
              <div className="max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {lessons.length > 0 ? (
                  lessons.map((lesson, index) => (
                    <button
                      key={lesson._id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-200 group ${
                        selectedLesson?._id === lesson._id
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-md"
                          : "hover:bg-gray-50 border-2 border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center flex-1 min-w-0 gap-2 sm:gap-3">
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs sm:text-sm ${
                            selectedLesson?._id === lesson._id
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                          }`}
                        >
                          {lessons.length - index}
                        </div>
                        <span
                          className={`font-medium text-left truncate text-sm sm:text-base ${
                            selectedLesson?._id === lesson._id
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>
                      {isEnrolledStudent &&
                        (lesson.isCompleted ? (
                          <CheckCircleIcon
                            className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0 ml-2"
                            title="Completed"
                          />
                        ) : (
                          <div
                            className="h-5 w-5 sm:h-6 sm:w-6 border-2 border-gray-300 rounded-full flex-shrink-0 ml-2 group-hover:border-gray-400"
                            title="Not Completed"
                          ></div>
                        ))}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <PlayCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base">
                      No lessons available yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .prose-html h1,
        .prose-html h2,
        .prose-html h3,
        .prose-html h4,
        .prose-html h5,
        .prose-html h6 {
          margin-top: 1rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        .prose-html p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        .prose-html ul,
        .prose-html ol {
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
        }
        .prose-html li {
          margin-bottom: 0.25rem;
        }
        .prose-html a {
          color: #2563eb;
          text-decoration: underline;
        }
        .prose-html a:hover {
          color: #1d4ed8;
        }
        .prose-html code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
        }
        .prose-html pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin-bottom: 0.75rem;
        }
        .prose-html blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          font-style: italic;
          margin: 0.75rem 0;
        }
        .prose-html strong {
          font-weight: 700;
        }
        .prose-html em {
          font-style: italic;
        }
      `}</style>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
      `}</style>
    </div>
  );
};

export default CourseDetailPage;
