// components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';

const Dashboard = () => {
  const [data, setData] = useState({ total: 0, vaccinated: 0, upcoming: [] });

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get('/dashboard');
      setData(res.data);
    };
    fetchData();
  }, []);

  const vaccinatedPercentage = ((data.vaccinated / data.total) * 100).toFixed(2);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <p>Total Students: {data.total}</p>
      <p>Vaccinated: {data.vaccinated} ({vaccinatedPercentage}%)</p>
      <h3 className="mt-4 font-semibold">Upcoming Drives:</h3>
      {data.upcoming.length ? (
        <ul>{data.upcoming.map((d, i) => <li key={i}>{d.vaccine} - {d.date}</li>)}</ul>
      ) : (
        <p>No upcoming drives</p>
      )}
    </div>
  );
};

export default Dashboard;
