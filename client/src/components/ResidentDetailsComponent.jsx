import React from 'react';
import { Link } from 'react-router-dom';
import './ResidentDetailsComponent.css';

// Function to generate fake email and login based on resident's name
const generateFakeDetails = (name) => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
  const email = `${name.toLowerCase().replace(' ', '.')}@example.com`; // Fake email
  const login = `${name.toLowerCase().replace(' ', '')}${randomNum}`; // Fake login

  return { email, login };
};

const ResidentDetailsComponent = ({ resident, onClose }) => {
  if (!resident) return null;

  const { email, login } = generateFakeDetails(resident.name);

  return (
    <div className="resident-details-overlay">
      <div className="resident-details">
        <h2>{resident.name}</h2>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Login:</strong> {login}</p>
        
        <div className="button-group">
          {/* Individual Schedule Button */}
          <Link to={`/individual-schedule/${resident.name}`} className="button individual-schedule-button">
            Individual Schedule
          </Link>

          {/* Close Button */}
          <button className="button close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentDetailsComponent;
