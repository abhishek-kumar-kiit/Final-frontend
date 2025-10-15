import React from "react";
import { Link } from "react-router-dom";
 

const HomePage: React.FC = () => {
 
  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      <section className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-16 sm:py-20 md:py-24 lg:py-0 min-h-[calc(100vh-80px)] lg:h-screen overflow-hidden">
        <img
          src="https://img.freepik.com/free-vector/online-education-illustration_1284-68476.jpg?w=1380"
          alt="Online Learning"
          className="absolute inset-0 w-full h-full object-cover opacity-10 lg:hidden"
        />

        <div className="relative z-10 flex-1 text-center lg:text-left mb-10 lg:mb-0 max-w-3xl lg:max-w-none mx-auto lg:mx-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
            Empower Your Learning Journey <br className="hidden sm:block" />
            with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              Learnify
            </span>
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg lg:text-base xl:text-lg max-w-xl mx-auto lg:mx-0 px-2 sm:px-0 leading-relaxed">
            Discover expert-led online courses. Build your skills and achieve
            your learning goals with our interactive platform.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-medium text-sm sm:text-base hover:opacity-90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            View Courses
          </Link>

          <div className="flex justify-center lg:justify-start space-x-3 sm:space-x-4 md:space-x-5 mt-6 sm:mt-8 text-gray-600">
            <a
              href="https://www.instagram.com/utkallabs/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 transition p-2 hover:bg-pink-50 rounded-full"
            >
              <i className="fab fa-instagram text-lg sm:text-xl md:text-2xl"></i>
            </a>
            <a
              href="https://www.facebook.com/utkallabsindia/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded-full"
            >
              <i className="fab fa-facebook text-lg sm:text-xl md:text-2xl"></i>
            </a>
            <a
              href="https://x.com/UtkalLabs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-500 transition p-2 hover:bg-sky-50 rounded-full"
            >
              <i className="fab fa-twitter text-lg sm:text-xl md:text-2xl"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/utkal-labs/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-700 transition p-2 hover:bg-blue-50 rounded-full"
            >
              <i className="fab fa-linkedin text-lg sm:text-xl md:text-2xl"></i>
            </a>
          </div>
        </div>

        <div className="flex-1 hidden lg:flex justify-center items-center lg:pl-8 xl:pl-12">
          <img
            src="https://img.freepik.com/free-vector/online-education-illustration_1284-68476.jpg?w=1380"
            alt="Learning Illustration"
            className="w-full max-w-sm lg:max-w-md xl:max-w-lg rounded-xl shadow-lg"
          />
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 px-2 sm:px-0">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              Learnify
            </span>
            ?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-7 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 duration-300">
              <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-graduation-cap text-white text-lg sm:text-xl md:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Expert Instructors
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Learn from industry professionals with years of experience in
                their fields.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-7 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 duration-300">
              <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-clock text-white text-lg sm:text-xl md:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Learn at Your Pace
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Access courses anytime, anywhere. Study at your own convenience
                and schedule.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 sm:p-7 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-certificate text-white text-lg sm:text-xl md:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Earn Certificates
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Get recognized for your achievements with course completion
                certificates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
