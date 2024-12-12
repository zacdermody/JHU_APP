// AdminLayout.js
import React from 'react';
import AdminSidebar from './AdminSidebar';

function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = React.useState(true); // Track the sidebar state

  return (
    <div className="flex min-h-screen">
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`flex-grow transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'}`}> {/* Change margin based on state */}
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
