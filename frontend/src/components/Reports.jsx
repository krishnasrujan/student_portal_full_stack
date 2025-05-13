// components/Reports.jsx
import React, { useState, useEffect } from 'react';
import API from '../api/api';

const Reports = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    API.get('/reports').then(res => setRecords(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2>Vaccination Report</h2>
      <table className="table-auto w-full border mt-2">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Vaccine</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.class}</td>
              <td>{r.vaccine}</td>
              <td>{r.status ? '✅' : '❌'}</td>
              <td>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
