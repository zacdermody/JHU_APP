import React, { useMemo } from 'react';
import './AnalyticsPage.css'; // Make sure to create and adjust this CSS file

const AnalyticsPage = ({ data = [], times = [] }) => {
  // Extract all resident names
  const residentNames = useMemo(() => {
    return data.map((resident) => resident.name);
  }, [data]);

  // Compute a mapping: { assignmentName: { [residentName]: countOfWeeks } }
  const assignmentResidentMatrix = useMemo(() => {
    const matrix = {};

    data.forEach((resident) => {
      const { name, assignments } = resident;
      if (Array.isArray(assignments)) {
        assignments.forEach((assg) => {
          const key = assg || '-'; // Use '-' if empty
          if (!matrix[key]) {
            matrix[key] = {};
          }
          // Initialize resident count if not present
          if (!matrix[key][name]) {
            matrix[key][name] = 0;
          }
          matrix[key][name] += 1;
        });
      }
    });

    return matrix;
  }, [data]);

  // Get all unique assignments and sort them (optional)
  const allAssignments = useMemo(() => {
    return Object.keys(assignmentResidentMatrix).sort();
  }, [assignmentResidentMatrix]);

  return (
    <div className="analytics-page">
      <h2>Required Assignments Summary</h2>
      <p>This table shows how many weeks each resident spends on each assignment.</p>
      <div className="analytics-table-container">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Assignment</th>
              {residentNames.map((resName) => (
                <th key={resName}>{resName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allAssignments.map((assignment) => (
              <tr key={assignment}>
                <td className="assignment-name-cell">{assignment}</td>
                {residentNames.map((resName) => {
                  const count = assignmentResidentMatrix[assignment][resName] || 0;
                  return <td key={resName}>{count}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsPage;
