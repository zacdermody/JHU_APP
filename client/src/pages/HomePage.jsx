import React from 'react';
import { Link } from 'react-router-dom';
import schoolConfig from '../config/schoolConfig';

function HomePage() {
  const schoolId = 'default'; // Replace with logic to fetch school dynamically
  const config = schoolConfig[schoolId] || schoolConfig.default;

  const buttonBaseClasses =
    'px-6 py-3 text-white rounded-full transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 shadow-lg transform hover:scale-105';

  return (
    <div className={`${config.primaryColor} min-h-screen flex flex-col items-center justify-center`}>
      <div className="text-center -mt-16">
        {/* Logo */}
        <img
          src={config.logo}
          alt={`${config.programName} Logo`}
          className="mx-auto w-[600px] h-auto object-contain mb-10"
        />

        {/* Main Title */}
        <div className="text-xl italic font-serif flex flex-col items-center space-y-2 md:flex-row md:space-x-4 md:space-y-0">
          <span className={`${config.titleColor}`}>Welcome to</span>
          <span className={`text-2xl ${config.titleStrongColor}`}>Johns Hopkins Fellowship Schedule Manager</span>
        </div>

        {/* Program Indicator */}
        <p className="text-base mt-4 italic text-gray-300 font-serif">
          Created by <span className="font-semibold">{config.programName}</span>
        </p>

        {/* Description */}
        <p className="text-sm mt-2 italic text-white font-serif">{config.programTagline}</p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <Link to="/login" className={`${buttonBaseClasses} ${config.buttonPrimary}`}>
            Login
          </Link>
          <Link to="/employee" className={`${buttonBaseClasses} ${config.buttonSecondary}`}>
            Employee
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
