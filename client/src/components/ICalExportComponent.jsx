import React from 'react';
import { saveAs } from 'file-saver';
import { generateICal } from './generateICal'; // Ensure this function is implemented correctly
import themeConfig from '../config/themeConfig'; // Import themeConfig

const ICalExportComponent = ({ selectedResident, dateRanges }) => {
  // Set CSS variables dynamically based on themeConfig
  React.useEffect(() => {
    Object.keys(themeConfig).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, themeConfig[key]);
    });
  }, []);

  const handleDownload = () => {
    if (!selectedResident) {
      console.warn('No resident selected for iCal download.');
      return;
    }

    console.log('Selected resident:', selectedResident);

    if (!selectedResident.assignments || !Array.isArray(selectedResident.assignments)) {
      console.error('No valid assignments found for the selected resident.');
      return;
    }

    const residentAssignments = selectedResident.assignments.slice(0, 52); // Limit assignments to 52
    const limitedDateRanges = dateRanges.slice(0, 52); // Limit date ranges to 52

    const formattedAssignments = residentAssignments
      .map((assignment, index) => {
        const dateRange = limitedDateRanges[index]; // Use limited date ranges

        // Validate the date range before formatting it for iCal
        if (!dateRange || typeof dateRange !== 'string') {
          console.error(`Invalid dateRange: ${dateRange}`);
          return null; // Skip if invalid
        }

        const [startStr, endStr] = dateRange.split(' to ').map((date) => date.trim());
        const start = new Date(startStr);
        const end = new Date(endStr);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.error(`Invalid start or end date in dateRange: ${dateRange}`);
          return null;
        }

        // Return the formatted assignment and date range for iCal
        return {
          dateRange: `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`,
          assignment,
        };
      })
      .filter((item) => item !== null); // Filter out any null values

    console.log('Formatted resident assignments for iCal:', formattedAssignments);

    const iCalData = generateICal(selectedResident, formattedAssignments);
    const blob = new Blob([iCalData], { type: 'text/calendar;charset=utf-8' });
    saveAs(blob, `schedule.ics`); // Download the iCal file
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-[var(--buttonColor)] text-[var(--textColor)] rounded shadow hover:bg-[var(--buttonHoverColor)] transition duration-300"
      >
        Download Schedule as iCal
      </button>
    </div>
  );
};

export default ICalExportComponent;
