import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa';
import themeConfig from '../config/themeConfig';

const ManageResidents = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filters, setFilters] = useState({ name: '', year: '', email: '' });
  const [newResName, setNewResName] = useState('');
  const [newResYear, setNewResYear] = useState('');
  const [newResEmail, setNewResEmail] = useState('');

  useEffect(() => {
    Object.keys(themeConfig).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, themeConfig[key]);
    });
    fetchResidents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rows, filters]);

  const fetchResidents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/residents', {
        withCredentials: true,
      });
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching residents:', error);
      toast.error('Failed to fetch residents');
    }
  };

  const applyFilters = () => {
    const filtered = rows.filter((row) => {
      return (
        (!filters.name || row.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.year || row.year.toLowerCase().includes(filters.year.toLowerCase())) &&
        (!filters.email || row.email.toLowerCase().includes(filters.email.toLowerCase()))
      );
    });
    setFilteredRows(filtered);
  };

  const addResident = async () => {
    if (!newResName || !newResYear || !newResEmail) {
      toast.error('Please fill out all fields before adding a resident');
      return;
    }

    try {
      const newResident = {
        name: newResName,
        year: newResYear,
        email: newResEmail,
      };

      await axios.post('http://127.0.0.1:5000/api/residents', newResident, {
        withCredentials: true,
      });

      toast.success('Resident added successfully!');
      
      // Force a full page refresh to ensure the new resident is visible immediately
      window.location.reload();
    } catch (error) {
      console.error('Error adding resident:', error);
      toast.error('Failed to add resident');
    }
  };

  const deleteResidentByEmail = async (email) => {
    if (!email) {
      toast.error('Unable to delete: Resident email is missing');
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:5000/api/residents/${email}`, {
        withCredentials: true,
      });

      setRows((prevRows) => prevRows.filter((row) => row.email !== email));
      toast.success('Resident deleted successfully!');
    } catch (error) {
      console.error('Error deleting resident by email:', error);
      toast.error('Failed to delete resident');
    }
  };

  const clearFilter = () => {
    setFilters({ name: '', year: '', email: '' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center w-full bg-blue-100">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-[#002D72] mb-4 text-center">Manage Residents</h2>

      <div className="flex gap-2 mb-6 w-full px-10">
        <input
          type="text"
          placeholder="Resident Name"
          value={newResName}
          onChange={(e) => setNewResName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#002D72] text-black w-full"
        />
        <input
          type="text"
          placeholder="Resident Year"
          value={newResYear}
          onChange={(e) => setNewResYear(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#002D72] text-black w-full"
        />
        <input
          type="email"
          placeholder="Resident Email"
          value={newResEmail}
          onChange={(e) => setNewResEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#002D72] text-black w-full"
        />
        <button
          onClick={addResident}
          className="bg-[#002D72] text-white font-bold py-2 px-4 rounded-md hover:bg-[#003A99] transition duration-300 shadow-md"
        >
          Add
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg mt-6 w-full px-10">
        <table className="min-w-full divide-y divide-gray-200 bg-blue-200 text-black rounded-lg overflow-hidden">
          <thead className="bg-[#002D72] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.email} className="hover:bg-blue-400 transition duration-300 text-black">
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2">{row.year}</td>
                <td className="px-4 py-2">{row.email}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => deleteResidentByEmail(row.email)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-black py-4">
                  No residents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageResidents;
