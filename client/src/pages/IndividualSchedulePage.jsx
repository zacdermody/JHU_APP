import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ICalExportComponent from '../components/ICalExportComponent';
import EditEventModal from '../components/EditEventModal';
import themeConfig from '../config/themeConfig'; // Import themeConfig
import './IndividualSchedulePage.css';

const IndividualSchedulePage = ({ residents, times, assignmentsMeta }) => {
  const { residentName } = useParams();
  const [selectedResident, setSelectedResident] = useState(null);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedEvent, setSelectedEvent] = useState(null); // Selected event data

  const totalWeeks = times ? times.length : 0;
  const initialCalendarDate = times && times[0] ? times[0].split(' to ')[0] : null;

  // Set CSS variables dynamically based on themeConfig
  useEffect(() => {
    Object.keys(themeConfig).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, themeConfig[key]);
    });
  }, []);

  useEffect(() => {
    if (
      residentName &&
      residents &&
      residents.length > 0 &&
      times &&
      assignmentsMeta
    ) {
      handleResidentSelect(residentName);
    }
  }, [residentName, residents, times, assignmentsMeta]);

  const handleResidentSelect = (residentName) => {
    const resident = residents.find(
      (r) => r.name.trim().toLowerCase() === residentName.trim().toLowerCase()
    );

    if (!resident) {
      console.error(`No resident found with name: '${residentName}'.`);
      return;
    }

    setSelectedResident(resident);

    const residentAssignments = resident.assignments.slice(0, totalWeeks);
    const limitedDateRanges = times.slice(0, totalWeeks);

    try {
      const newEvents = residentAssignments.flatMap((assignment, index) => {
        const dateRange = limitedDateRanges[index];
        const meta = assignmentsMeta[assignment] || { DailyTimes: {}, Location: '', Head_Teacher: '' };

        const [startStr, endStr] = dateRange.split(' to ').map((date) => date.trim());
        const startDate = parseDate(startStr);
        const endDate = parseDate(endStr, true);

        const datesInRange = getDatesBetween(startDate, endDate);

        return datesInRange.map((date) => {
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          const timesForDay = meta.DailyTimes[dayName] || { start: '09:00', end: '17:00' };

          const [startHour, startMinute] = timesForDay.start.split(':');
          const [endHour, endMinute] = timesForDay.end.split(':');

          const eventStart = new Date(date);
          eventStart.setHours(startHour, startMinute);
          const eventEnd = new Date(date);
          eventEnd.setHours(endHour, endMinute);

          return {
            id: `${assignment}-${date.toISOString()}`,
            title: assignment,
            start: eventStart.toISOString(),
            end: eventEnd.toISOString(),
            allDay: false,
            extendedProps: {
              ...meta,
              Time: `${timesForDay.start} - ${timesForDay.end}`,
              Location: meta.Location || '',
              Head_Teacher: meta.Head_Teacher || '',
            },
          };
        });
      });

      setEvents(newEvents);
    } catch (error) {
      console.error("Error processing resident assignments:", error);
    }
  };

  const parseDate = (dateStr, isEndDate = false) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return date;
  };

  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const handleEventClick = (clickInfo) => {
    const { title, extendedProps, start, end } = clickInfo.event;
    setSelectedEvent({
      id: clickInfo.event.id,
      title,
      Location: extendedProps.Location,
      Time: extendedProps.Time,
      Head_Teacher: extendedProps.Head_Teacher,
      start: start,
      end: end,
    });
    setIsModalOpen(true);
  };

  const handleSave = (updatedEventData) => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (!residents || !times || !assignmentsMeta) {
    return (
      <div className="individual-schedule-page flex items-center justify-center min-h-screen bg-blue-100">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="individual-schedule-page flex items-center justify-center min-h-screen bg-blue-100">
      <div className="calendar-container bg-white shadow-lg rounded-lg p-6 border border-gray-300 max-w-5xl w-full relative">
        <div className="flex items-center justify-center relative mb-6">
          <Link
            to="/admin/resident-schedule"
            className="absolute left-0 px-4 py-2 bg-[var(--buttonColor)] text-[var(--textColor)] rounded shadow hover:bg-[var(--buttonHoverColor)]"
          >
            Return to Full Schedule
          </Link>
          <h2 className="text-3xl font-bold text-center">{selectedResident?.name}</h2>
        </div>

        {selectedResident && (
          <>
            <ICalExportComponent
              selectedResident={selectedResident}
              dateRanges={times}
              assignmentsMeta={assignmentsMeta}
            />
            <div className="calendar-wrapper bg-white p-4 rounded-lg shadow-md">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                initialDate={initialCalendarDate}
                eventClick={handleEventClick}
                eventContent={(arg) => {
                  const { title, extendedProps } = arg.event;
                  const { Location, Time, Head_Teacher } = extendedProps;

                  return (
                    <div className="event-content">
                      <b>{title}</b>
                      {Location && <div>{Location}</div>}
                      {Time && <div>{Time}</div>}
                      {Head_Teacher && <div>{Head_Teacher}</div>}
                    </div>
                  );
                }}
              />
            </div>
          </>
        )}
      </div>

      <EditEventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default IndividualSchedulePage;
