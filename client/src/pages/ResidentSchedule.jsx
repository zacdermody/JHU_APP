import React from 'react';
import TableComponent from './TableComponent';

function ResidentSchedule({ data, times, assignmentsMeta, weeksPerPage }) {
  return (
    <div className="p-10 bg-white shadow-lg rounded-lg">
      {/* Update heading to use Hopkins Dark Blue */}
      <h1 className="text-4xl font-bold text-[#002D72] mb-8 text-center">
        Resident Schedule
      </h1>
      {/* Update subtitle to say 'for Hopkins' */}
      <p className="text-xl text-[#002D72] text-center">
        Full Resident Schedule generated for Hopkins
      </p>

      {/* Render TableComponent with passed props */}
      <TableComponent
        data={data}
        times={times}
        assignmentsMeta={assignmentsMeta}
        weeksPerPage={weeksPerPage}
      />
    </div>
  );
}

export default ResidentSchedule;
