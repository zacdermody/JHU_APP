import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const links = [
    { to: "/", label: "Home" },
    { to: "/admin/manage-residents", label: "Manage Residents" },
    { to: "/admin/resident-schedule", label: "Resident Schedule" },
    { to: "/admin/profile", label: "Profile" },
    { to: "/admin/legacy-schedule", label: "Legacy Schedule" }, // Existing Legacy Schedule tab
    { to: "/admin/analytics", label: "Analytics" }, // New Analytics tab
  ];

  return (
    <div className={`bg-gray-800 transition-all duration-300 fixed h-full ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
      <div className={`flex flex-col h-full ${isOpen ? 'block' : 'hidden'}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-white p-2 focus:outline-none hover:bg-gray-700 rounded-full mx-auto my-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <nav className="flex flex-col mt-5">
          {links.map((link, index) => (
            <Link key={index} to={link.to} className="text-white px-4 py-2 hover:bg-gray-700">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="fixed top-4 left-4 text-white p-2 bg-gray-800 rounded-full focus:outline-none hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default AdminSidebar;
