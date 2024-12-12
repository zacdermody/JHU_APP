import React, { useState } from 'react';
import './EditFeatureComponent.css'; // Add your CSS styles for modal, etc.
import DropdownComponent from './DropdownComponent'; // Import the Dropdown Component

const EditFeatureComponent = ({ selectedPerson, selectedWeek, data, onClose }) => {
  const [editedAssignment, setEditedAssignment] = useState(selectedPerson.assignments[selectedWeek] || '');

  const handleAssignmentChange = (e) => {
    setEditedAssignment(e.target.value);
  };

  const handleSave = () => {
    const updatedData = [...data];
    const personIndex = data.findIndex((p) => p.name === selectedPerson.name);
    updatedData[personIndex].assignments[selectedWeek] = editedAssignment;

    // Close the modal after saving
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Assignment</h3>
        <DropdownComponent
          selectedValue={editedAssignment}
          onChange={handleAssignmentChange}
        />
        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditFeatureComponent;
