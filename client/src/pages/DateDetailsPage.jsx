import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditFeatureComponent from '../components/EditFeatureComponent'; // Adjusted import path

const fullDaysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function rotateDaysOfWeek(startDay) {
  const startIndex = fullDaysOfWeek.indexOf(startDay);
  return [...fullDaysOfWeek.slice(startIndex), ...fullDaysOfWeek.slice(0, startIndex)];
}

function DateDetailsPage({ data, times, assignmentsMeta }) {
  const { date } = useParams();
  const [weekData, setWeekData] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState(fullDaysOfWeek);
  const [isEditOpen, setIsEditOpen] = useState(false); // Modal open/close state
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    const startDate = new Date(decodeURIComponent(date).split(" to ")[0]);
    const startDay = fullDaysOfWeek[startDate.getDay()];
    setDaysOfWeek(rotateDaysOfWeek(startDay));

    const weekIndex = times.findIndex(time => time === decodeURIComponent(date));
    
    if (weekIndex === -1) {
      setWeekData([]);
      return;
    }

    const weekAssignments = data.map(resident => {
      const assignmentForWeek = resident.assignments[weekIndex] || '-';
      const assignmentMeta = assignmentsMeta[assignmentForWeek] || {};

      return {
        name: resident.name,
        assignment: assignmentForWeek,
        dailyTimes: assignmentMeta.DailyTimes || {}
      };
    });

    setWeekData(weekAssignments);
  }, [date, data, times, assignmentsMeta]);

  // Handle cell click to open edit modal
  const handleCellClick = (person, weekIndex) => {
    setSelectedPerson(person);
    setSelectedWeek(weekIndex);
    setIsEditOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditOpen(false);
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen py-10">
      <div className="w-full max-w-lg bg-blue-100 text-black text-center py-4 rounded-md mb-8 shadow border border-black">
        <h2 className="text-2xl font-semibold">Details for {decodeURIComponent(date)}</h2>
      </div>

      <div className="overflow-x-auto w-full max-w-5xl shadow-lg rounded-lg border border-gray-200 bg-white">
        <table className="table-auto w-full text-sm text-center rounded-lg shadow-md">
          <thead className="bg-gradient-to-r from-blue-800 to-blue-900 text-white text-base font-bold sticky top-0 z-10 shadow-md">
            <tr>
              <th className="px-4 py-2">Resident</th>
              {daysOfWeek.map(day => (
                <th key={day} className="px-4 py-2">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekData.map((resident, rowIndex) => (
              <tr
                key={resident.name}
                className={`hover:bg-blue-100 transition-colors ${
                  rowIndex % 2 === 0 ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <td className="border px-4 py-3 font-medium">{resident.name}</td>
                {daysOfWeek.map((day, index) => {
                  const dayTimes = resident.dailyTimes[day];
                  const startTime = dayTimes?.start || '09:00';
                  const endTime = dayTimes?.end || '17:00';
                  const weekIndex = times.findIndex(time => time === decodeURIComponent(date));

                  return (
                    <td
                      key={index}
                      className="border px-4 py-3 cursor-pointer"
                      onClick={() => handleCellClick(resident, weekIndex)}
                    >
                      <div className="font-semibold">{resident.assignment}</div>
                      <div className="text-xs text-gray-600">
                        {dayTimes ? `${startTime} - ${endTime}` : '09:00 - 17:00'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditOpen && selectedPerson && (
        <EditFeatureComponent
          selectedPerson={selectedPerson}
          selectedWeek={selectedWeek}
          data={data}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default DateDetailsPage;
