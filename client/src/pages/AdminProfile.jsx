import React from 'react';

function AdminProfile() {
  const adminProfile = {
    email: 'admin@tuftsresidency.com',
    firstName: 'John',
    middleName: 'A.',
    lastName: 'Doe',
    role: 'Administrator',
    specialty: 'Cardiology',
    department: 'Internal Medicine',
  };

  return (
    <div className="p-10 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-[#3172AE] mb-8 text-center">Profile</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xl font-semibold">First Name:</p>
          <p className="text-gray-700">{adminProfile.firstName}</p>
        </div>
        <div>
          <p className="text-xl font-semibold">Middle Name:</p>
          <p className="text-gray-700">{adminProfile.middleName}</p>
        </div>
        <div>
          <p className="text-xl font-semibold">Last Name:</p>
          <p className="text-gray-700">{adminProfile.lastName}</p>
        </div>
        <div>
          <p className="text-xl font-semibold">Email:</p>
          <p className="text-gray-700">{adminProfile.email}</p>
        </div>
        <div>
          <p className="text-xl font-semibold">Role:</p>
          <p className="text-gray-700">{adminProfile.role}</p>
        </div>
        <div>
          <p className="text-xl font-semibold">Specialty:</p>
          <p className="text-gray-700">{adminProfile.specialty}</p>
        </div>
        <div>
          <p className="text-xl font-semibold">Department:</p>
          <p className="text-gray-700">{adminProfile.department}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
