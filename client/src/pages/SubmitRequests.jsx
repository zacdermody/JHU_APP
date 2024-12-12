import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SubmitRequests() {
  const [formData, setFormData] = useState({
    vacationWeeks: '',
    electiveWeeks: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can log or process form data here if needed, but no actual API call is made.
    console.log('Form data:', formData);
    navigate('/user/home'); // Redirect to the homepage
  };

  return (
    <div className="submit-requests">
      <h1>Enter Your Vacation and Elective Preferences</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="vacationWeeks">Vacation Weeks:</label>
          <input
            type="text"
            id="vacationWeeks"
            name="vacationWeeks"
            value={formData.vacationWeeks}
            onChange={handleChange}
            placeholder="Enter vacation weeks"
          />
        </div>
        <div>
          <label htmlFor="electiveWeeks">Elective Weeks:</label>
          <input
            type="text"
            id="electiveWeeks"
            name="electiveWeeks"
            value={formData.electiveWeeks}
            onChange={handleChange}
            placeholder="Enter elective weeks"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SubmitRequests;
