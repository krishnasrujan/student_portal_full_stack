// components/DriveManager.jsx
import React, { useState, useEffect } from 'react';
import API from '../api/api';

const DriveManager = () => {
  const [drives, setDrives] = useState([]);
  const [form, setForm] = useState({ vaccine: '', date: '', doses: '', grades: '' });

  const loadDrives = async () => {
    const res = await API.get('/drives');
    setDrives(res.data);
  };

  useEffect(() => {
    loadDrives();
  }, []);

  const createDrive = async () => {
    await API.post('/drives', form);
    loadDrives();
  };

  return (
    <div className="p-4">
      <h2>Create Drive</h2>
      <input placeholder="Vaccine" className="border p-1 m-1" onChange={e => setForm({ ...form, vaccine: e.target.value })} />
      <input type="date" className="border p-1 m-1" onChange={e => setForm({ ...form, date: e.target.value })} />
      <input placeholder="Doses" className="border p-1 m-1" onChange={e => setForm({ ...form, doses: e.target.value })} />
      <input placeholder="Grades (e.g., 5-7)" className="border p-1 m-1" onChange={e => setForm({ ...form, grades: e.target.value })} />
      <button className="bg-blue-600 text-white p-1 m-1" onClick={createDrive}>Submit</button>

      <h3 className="mt-4">Upcoming Drives</h3>
      <ul>{drives.map((d, i) => <li key={i}>{d.vaccine} - {d.date} - {d.doses} doses</li>)}</ul>
    </div>
  );
};

export default DriveManager;
