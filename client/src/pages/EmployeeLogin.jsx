import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeLogin = () => {
  const [accessKey, setAccessKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/verify-access-key', { accessKey });

      if (response.status === 200) {
        toast.success('Access Key Verified! Logging you in...');
        // Redirect to the employee dashboard or desired page after successful verification
        setTimeout(() => {
          navigate('/employee/dashboard'); // Change this route to your actual employee dashboard page
        }, 1000);
      } else {
        toast.error('Invalid Access Key!');
      }
    } catch (error) {
      toast.error('Error verifying access key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f2fa] flex flex-col items-center justify-center">
      <ToastContainer />
      <div className="bg-white p-10 shadow-lg rounded-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-[#3172AE] text-center mb-6">Employee Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accessKey">
              Enter Access Key
            </label>
            <input
              type="text"
              id="accessKey"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3172AE] text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'} text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md`}
          >
            {isLoading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;
