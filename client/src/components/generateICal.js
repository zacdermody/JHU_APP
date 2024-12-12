function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function extractStartDate(dateRange) {
  if (!dateRange || typeof dateRange !== 'string') {
    console.error(`Invalid dateRange value: ${JSON.stringify(dateRange)}`);
    return null;
  }

  const [startDate] = dateRange.split(' to ');
  return startDate;
}

export function generateICal(resident, times) {
  console.log('Resident object:', resident);
  console.log('Times array passed to generateICal:', times);

  const calStart = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n';
  const calEnd = 'END:VCALENDAR';

  let events = '';

  resident.assignments.forEach((assignment, index) => {
    if (assignment !== '-') {
      const rawDateRange = times[index]?.dateRange;

      console.log(`Raw date range at index ${index}:`, rawDateRange);

      const startDateString = extractStartDate(rawDateRange);
      if (!startDateString) {
        console.error(`Skipping event due to invalid date range: ${JSON.stringify(rawDateRange)}`);
        return;
      }

      // Adjusting the start date to be one day forward (Saturday)
      const startDate = new Date(startDateString);
      startDate.setDate(startDate.getDate() + 1); // Move start date forward by one day

      if (isNaN(startDate.getTime())) {
        console.error(`Invalid start date at index ${index}: ${startDateString}`);
        return;
      }

      // Set end date to be 6 days after the start date (Friday)
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7); // End on Friday

      const formattedStart = formatDate(startDate);
      const formattedEnd = formatDate(endDate);

      console.log(`Event ${index + 1}:`, {
        assignment,
        rawDateRange,
        formattedStart,
        formattedEnd,
      });

      events += `BEGIN:VEVENT\nSUMMARY:${assignment}\nDTSTART:${formattedStart}\nDTEND:${formattedEnd}\nEND:VEVENT\n`;
    }
  });

  const iCalData = `${calStart}${events}${calEnd}`;

  console.log('Generated iCal data:', iCalData);

  return iCalData;
}
