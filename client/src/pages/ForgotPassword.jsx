import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST request to backend to trigger password recovery email
      await axios.post('http://127.0.0.1:5000/forgot-password', { email });
      setIsSubmitted(true);
      toast.success('Password reset instructions have been sent to your email.');
    } catch (error) {
      toast.error('Error sending password reset instructions.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <ToastContainer />
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded-md w-full mb-4"
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full">
              Send Reset Instructions
            </button>
          </form>
        ) : (
          <p className="text-green-500 text-center">Check your email for password reset instructions.</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
