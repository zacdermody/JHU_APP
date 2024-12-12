import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, format } from 'date-fns';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

Modal.setAppElement('#root');

const UserDashboard = () => {
  const [vacationWeeks, setVacationWeeks] = useState([]);
  const [electiveWeeks, setElectiveWeeks] = useState([]);
  const [selectedVacationWeek, setSelectedVacationWeek] = useState(null);
  const [selectedElectiveWeek, setSelectedElectiveWeek] = useState(null);
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(null);
  const [removeType, setRemoveType] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate(); // Initialize navigate for redirection

  const getWeekRange = (date) => {
    if (!date) return null;
    const startDate = new Date(date);
    const endDate = addDays(startDate, 6); // Full 7-day range
    return { startDate, endDate };
  };

  const doesWeekOverlap = (newWeek, weeks) => {
    return weeks.some((week) => {
      return (
        (newWeek.startDate >= week.startDate && newWeek.startDate <= week.endDate) ||
        (newWeek.endDate >= week.startDate && newWeek.endDate <= week.endDate)
      );
    });
  };

  const confirmVacationWeek = () => {
    const newWeek = getWeekRange(selectedVacationWeek);
    if (doesWeekOverlap(newWeek, vacationWeeks)) {
      toast.error('This week overlaps with an already selected vacation week.');
      return;
    }
    if (vacationWeeks.length < 4) {
      setVacationWeeks([...vacationWeeks, newWeek]);
      toast.success('Vacation week added to session!');
    } else {
      toast.error('You can only select up to 4 vacation weeks.');
    }
    setSelectedVacationWeek(null);
  };

  const confirmElectiveWeek = () => {
    const newWeek = getWeekRange(selectedElectiveWeek);
    if (doesWeekOverlap(newWeek, electiveWeeks)) {
      toast.error('This week overlaps with an already selected elective week.');
      return;
    }
    if (electiveWeeks.length < 4) {
      setElectiveWeeks([...electiveWeeks, newWeek]);
      toast.success('Elective week added to session!');
    } else {
      toast.error('You can only select up to 4 elective weeks.');
    }
    setSelectedElectiveWeek(null);
  };

  const openRemoveModal = (index, type) => {
    setRemoveIndex(index);
    setRemoveType(type);
    setRemoveModalIsOpen(true);
  };

  const confirmRemoveWeek = () => {
    if (removeType === 'vacation') {
      setVacationWeeks(vacationWeeks.filter((_, i) => i !== removeIndex));
    } else {
      setElectiveWeeks(electiveWeeks.filter((_, i) => i !== removeIndex));
    }
    toast.success('Week removed from session.');
    setRemoveModalIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { 
        email: 'resident@example.com', // Replace with the logged-in user's email
        vacationWeeks, 
        electiveWeeks 
      };
      await axios.post('http://127.0.0.1:5000/submit-dates', formData);
      setIsSubmitted(true);
      toast.success('Form submitted successfully!');
      navigate('/user/home'); // Redirect to the user homepage after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form.');
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f2fa] p-10 flex flex-col items-center">
      <ToastContainer />
      <div className="max-w-6xl w-full bg-white p-10 shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold text-[#3172AE] mb-8 text-center">Manage Your Dates</h2>

        {/* Submit Button and Instruction Message */}
        <button
          type="submit"
          onClick={handleSubmit}
          className={`w-full mb-4 ${vacationWeeks.length === 4 && electiveWeeks.length === 4 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'} text-white font-bold py-3 px-6 rounded-md transition duration-300 shadow-md`}
          disabled={vacationWeeks.length < 4 || electiveWeeks.length < 4}
          title={vacationWeeks.length === 4 && electiveWeeks.length === 4 ? '' : 'Select all 4 vacation and elective weeks to submit'}
        >
          {isSubmitted ? 'Submitted!' : 'Submit Dates'}
        </button>

        {/* Instruction Line */}
        <p className="text-gray-700 mb-8 text-center">
          {vacationWeeks.length < 4 || electiveWeeks.length < 4
            ? 'Please select all 4 vacation weeks and all 4 elective weeks to submit.'
            : 'All weeks selected. You can now submit your dates.'}
        </p>

        <form>
          {/* Vacation Weeks Section */}
          <h2 className="text-2xl font-bold text-[#3172AE] mb-4">Select Vacation Dates (Up to 4 weeks)</h2>
          <p className="text-gray-700 mb-4">{vacationWeeks.length}/4 weeks selected</p>
          <div className="mb-6">
            {vacationWeeks.map((week, index) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <p className="text-gray-700">
                  {format(week.startDate, 'MMMM d, yyyy')} - {format(week.endDate, 'MMMM d, yyyy')}
                </p>
                <button
                  type="button"
                  onClick={() => openRemoveModal(index, 'vacation')}
                  className="text-red-500 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            {vacationWeeks.length < 4 && (
              <div className="mt-4 flex flex-col items-center">
                <DatePicker
                  selected={selectedVacationWeek}
                  onChange={(date) => setSelectedVacationWeek(date)}
                  inline
                  highlightDates={
                    selectedVacationWeek
                      ? [{ start: getWeekRange(selectedVacationWeek)?.startDate, end: getWeekRange(selectedVacationWeek)?.endDate }]
                      : []
                  }
                  minDate={new Date()}
                  selectsStart
                  startDate={selectedVacationWeek}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  calendarClassName="highlight-week modern-calendar text-center"
                  dayClassName={(date) =>
                    getWeekRange(selectedVacationWeek) &&
                    date >= getWeekRange(selectedVacationWeek)?.startDate &&
                    date <= getWeekRange(selectedVacationWeek)?.endDate
                      ? 'bg-blue-300 text-white'
                      : undefined
                  }
                />
                {selectedVacationWeek && (
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={confirmVacationWeek}
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Confirm Vacation Week
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Elective Weeks Section */}
          <h2 className="text-2xl font-bold text-[#3172AE] mb-4">Select Elective Dates (Up to 4 weeks)</h2>
          <p className="text-gray-700 mb-4">{electiveWeeks.length}/4 weeks selected</p>
          <div className="mb-6">
            {electiveWeeks.map((week, index) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <p className="text-gray-700">
                  {format(week.startDate, 'MMMM d, yyyy')} - {format(week.endDate, 'MMMM d, yyyy')}
                </p>
                <button
                  type="button"
                  onClick={() => openRemoveModal(index, 'elective')}
                  className="text-red-500 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            {electiveWeeks.length < 4 && (
              <div className="mt-4 flex flex-col items-center">
                <DatePicker
                  selected={selectedElectiveWeek}
                  onChange={(date) => setSelectedElectiveWeek(date)}
                  inline
                  highlightDates={
                    selectedElectiveWeek
                      ? [{ start: getWeekRange(selectedElectiveWeek)?.startDate, end: getWeekRange(selectedElectiveWeek)?.endDate }]
                      : []
                  }
                  minDate={new Date()}
                  selectsStart
                  startDate={selectedElectiveWeek}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  calendarClassName="highlight-week modern-calendar text-center"
                  dayClassName={(date) =>
                    getWeekRange(selectedElectiveWeek) &&
                    date >= getWeekRange(selectedElectiveWeek)?.startDate &&
                    date <= getWeekRange(selectedElectiveWeek)?.endDate
                      ? 'bg-blue-300 text-white'
                      : undefined
                  }
                />
                {selectedElectiveWeek && (
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={confirmElectiveWeek}
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Confirm Elective Week
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Modal for remove confirmation */}
        <Modal
          isOpen={removeModalIsOpen}
          onRequestClose={() => setRemoveModalIsOpen(false)}
          contentLabel="Remove Week Confirmation"
          className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Are you sure?</h2>
          <p className="text-gray-700 mb-6">Do you really want to remove this week?</p>
          <div className="flex justify-between">
            <button
              onClick={() => setRemoveModalIsOpen(false)}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmRemoveWeek}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
              Yes, Remove
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserDashboard;

