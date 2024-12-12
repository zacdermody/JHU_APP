import React, { useState } from 'react';
import './FilterComponent.css'; // We'll add some custom styling later

const FilterComponent = ({ onFilterChange }) => {
  const [filterText, setFilterText] = useState('');

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    onFilterChange(e.target.value); // Pass the filter text back to the parent component
  };

  return (
    <div className="filter-container">
      <input
        type="text"
        className="filter-input"
        placeholder="Search by resident name..."
        value={filterText}
        onChange={handleFilterChange}
      />
    </div>
  );
};

export default FilterComponent;
