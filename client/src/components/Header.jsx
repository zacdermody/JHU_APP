import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">{title}</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 p-2 rounded-md text-white"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
