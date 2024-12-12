// EditEventModal.jsx
import React, { useState, useEffect } from 'react';

const EditEventModal = ({ event, isOpen, onClose, onSave }) => {
  // Set up hooks for editable fields
  const [editableTitle, setEditableTitle] = useState('');
  const [editableLocation, setEditableLocation] = useState('');
  const [editableTime, setEditableTime] = useState('');
  const [editableHeadTeacher, setEditableHeadTeacher] = useState('');

  // Update state when the event prop changes
  useEffect(() => {
    if (event) {
      setEditableTitle(event.title || '');
      setEditableLocation(event.extendedProps?.Location || '');
      setEditableTime(event.extendedProps?.Time || '');
      setEditableHeadTeacher(event.extendedProps?.Head_Teacher || '');
    } else {
      // If no event, clear fields (for adding new events)
      setEditableTitle('');
      setEditableLocation('');
      setEditableTime('');
      setEditableHeadTeacher('');
    }
  }, [event]);

  // Return null if modal is not open
  if (!isOpen) return null;

  const handleSaveClick = () => {
    const updatedData = {
      title: editableTitle,
      extendedProps: {
        Location: editableLocation,
        Time: editableTime,
        Head_Teacher: editableHeadTeacher,
      },
    };
    onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {event ? 'Edit Event' : 'Add Event'}
        </h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Title:</label>
          <input
            type="text"
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Event Title"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Location:</label>
          <input
            type="text"
            value={editableLocation}
            onChange={(e) => setEditableLocation(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Location"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Time:</label>
          <input
            type="text"
            value={editableTime}
            onChange={(e) => setEditableTime(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Time (e.g., 10:00 AM - 11:00 AM)"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Head Teacher:</label>
          <input
            type="text"
            value={editableHeadTeacher}
            onChange={(e) => setEditableHeadTeacher(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Head Teacher"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
          >
            Close
          </button>
          <button
            onClick={handleSaveClick}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
