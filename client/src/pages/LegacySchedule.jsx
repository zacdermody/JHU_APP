import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LegacySchedule.css'; 
import EditFeatureComponent from '../components/EditFeatureComponent';
import ResidentDetailsComponent from '../components/ResidentDetailsComponent';

const LegacySchedule = ({ data = [], times = [] }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [residentDetails, setResidentDetails] = useState(null);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleCellClick = (person, weekIndex) => {
    setSelectedPerson(person);
    setSelectedWeek(weekIndex);
    setIsEditOpen(true);
  };

  const handleModalClose = () => {
    setIsEditOpen(false);
  };

  const handleResidentClick = (resident) => {
    setResidentDetails(resident);
  };

  const handleCloseResidentDetails = () => {
    setResidentDetails(null);
  };

  return (
    <div className="legacy-schedule-page">
      <div className="legacy-schedule-table-container">
        <table className="legacy-schedule-table">
          <thead>
            <tr>
              <th className="date-col-header">Start Date</th>
              <th className="date-col-header">End Date</th>
              {filteredData.map((resident, index) => (
                <th
                  key={index}
                  className="resident-header"
                  onClick={() => handleResidentClick(resident)}
                >
                  {resident.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time, timeIndex) => {
              const dateParts = time ? time.split(' to ') : [];
              const startDate = dateParts[0] || '';
              const endDate = dateParts[1] || '';
              return (
                <tr key={timeIndex}>
                  <td className="date-cell">
                    {startDate ? (
                      <Link to={`/admin/date/${encodeURIComponent(time)}`}>
                        {startDate}
                      </Link>
                    ) : (
                      'No Date'
                    )}
                  </td>
                  <td className="date-cell">
                    {endDate ? (
                      <Link to={`/admin/date/${encodeURIComponent(time)}`}>
                        {endDate}
                      </Link>
                    ) : (
                      'No Date'
                    )}
                  </td>
                  {filteredData.map((person, personIndex) => {
                    const assignment = Array.isArray(person.assignments)
                      ? person.assignments[timeIndex] || '-'
                      : '-';
                    return (
                      <td
                        key={personIndex}
                        className="assignment-cell"
                        onClick={() => handleCellClick(person, timeIndex)}
                      >
                        {assignment}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isEditOpen && (
        <EditFeatureComponent
          selectedPerson={selectedPerson}
          selectedWeek={selectedWeek}
          data={data}
          onClose={handleModalClose}
        />
      )}

      {residentDetails && (
        <ResidentDetailsComponent
          resident={residentDetails}
          onClose={handleCloseResidentDetails}
        />
      )}
    </div>
  );
};

export default LegacySchedule;
