import React from 'react';
import './DropdownComponent.css';

const DropdownComponent = ({ selectedValue, onChange }) => {
  // Move the assignment options array to the Dropdown component
  const assignmentOptions = [
    'Clinic-L',
'Clinic-T','Lahey Sr','Tufts Sr',
'Psych-Cons',
'Psych-Add',
'Peds OP',
'Peds IP',
'Peds-NCCU',
'NF-L',
'NF-T',
'EEG',
'EMG',
'NCCU',
'Tufts Jr',
'Lahey Jr',
'L-Cons Jr',
'L-Cons Sr',
'T-Cons',
'Orientation',
'Vacation',
'Elective',
'NCCU-S'

  ];

  return (
    <select value={selectedValue} onChange={onChange}>
      {assignmentOptions.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default DropdownComponent;
