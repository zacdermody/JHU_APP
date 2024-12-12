import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import IndividualScheduleComponent from '../components/IndividualScheduleComponent';

const BACKEND_URL = 'http://localhost:5000';

const UserHomepage = () => {
  const { user } = useAuth(); // Access logged-in user details
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.residentName) {
      const fetchSchedule = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/schedule`, {
            params: { residentName: user.residentName },
          });
          setSchedule(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching schedule:', err);
          setError('Failed to load schedule');
          setLoading(false);
        }
      };

      fetchSchedule();
    } else {
      setError('User not logged in');
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-[#e6f2fa] p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-[#3172AE] mb-4">
          Welcome, {user.residentName}!
        </h1>
        <IndividualScheduleComponent residentName={user.residentName} schedule={schedule} />
      </div>
    </div>
  );
};

export default UserHomepage;
