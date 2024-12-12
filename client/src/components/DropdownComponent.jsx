import React from 'react';
import './DropdownComponent.css';

const DropdownComponent = ({ selectedValue, onChange }) => {
  // Move the assignment options array to the Dropdown component
  const assignmentOptions = [
    'CCU',
'SICU','Back Up','BV',
'Electives',
'Vacatation',
'Nights',
'Off',
'NP',
'MD',
'MICU',

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
