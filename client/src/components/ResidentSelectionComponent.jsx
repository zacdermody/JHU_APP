import React, { useState } from 'react';
import './ResidentSelectionComponent.css'; // Add styles for the dropdown if needed

const ResidentSelectionComponent = ({ residents, onResidentSelect }) => {
  const [selectedResident, setSelectedResident] = useState('');

  console.log("Residents prop received: ", residents); // Debug: Log the residents array

  const handleSelectChange = (e) => {
    const selectedName = e.target.value;
    setSelectedResident(selectedName);
    console.log("Resident selected: ", selectedName); // Debug: Log the selected resident name
    onResidentSelect(selectedName); // Pass the name to the parent component
  };

  return (
    <div className="resident-selection-container">
      <label htmlFor="resident-select">Select a Resident:</label>
      <select id="resident-select" value={selectedResident} onChange={handleSelectChange}>
        <option value="">-- Residents --</option>
        {residents.map((residentName, index) => (
          <option key={index} value={residentName}>
            {residentName} {/* Correctly display resident names */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ResidentSelectionComponent;

