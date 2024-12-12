import React from 'react';

const IndividualScheduleComponent = ({ residentName, schedule }) => {
  if (!schedule || Object.keys(schedule).length === 0) {
    return <p>No schedule available for {residentName}.</p>; // Provide feedback if no schedule is available
  }

  return (
    <div className="schedule-container">
      <h2>Schedule for {residentName}</h2>
      <table className="schedule-table" aria-label={`Schedule for ${residentName}`}>
        <thead>
          <tr>
            <th>Date Range</th>
            <th>Assignment</th>
            <th>Daily Schedule</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(schedule).map(([dateRange, assignment], index) => (
            <tr key={index}>
              <td>{formatDateRange(dateRange)}</td> {/* Format date range for better readability */}
              <td>{assignment}</td>
              <td>
                {/* Display individual day times */}
                {assignment.DailyTimes ? (
                  <table className="daily-schedule-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Start</th>
                        <th>End</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(assignment.DailyTimes).map(([day, times], dayIndex) => (
                        <tr key={dayIndex}>
                          <td>{day}</td>
                          <td>{times.start}</td>
                          <td>{times.end}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No daily schedule available</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to format date ranges for better readability
const formatDateRange = (dateRange) => {
  console.log(`Original Date Range: ${dateRange}`); // Debug: log the original date range
  
  const [start, end] = dateRange.split(' to ');
  
  if (!start || !end) {
    console.error(`Invalid Date Range: ${dateRange}`); // Debug: log if the date range is invalid
    return dateRange; // If the format is unexpected, return as-is
  }

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedStart = new Date(start).toLocaleDateString(undefined, options);
  const formattedEnd = new Date(end).toLocaleDateString(undefined, options);

  console.log(`Formatted Start Date: ${formattedStart}`); // Debug: log the formatted start date
  console.log(`Formatted End Date: ${formattedEnd}`); // Debug: log the formatted end date

  return `${formattedStart} to ${formattedEnd}`;
};

export default IndividualScheduleComponent;
