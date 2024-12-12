import React, { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // On initial load, try to retrieve user from localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Whenever 'user' changes, update localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      const newUser = { username, role: 'admin' };
      setUser(newUser);
      return true;
    } else if (username === 'user' && password === 'user') {
      const newUser = { username, role: 'user' };
      setUser(newUser);
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setUser(null); // This will also remove from localStorage due to the useEffect above
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
