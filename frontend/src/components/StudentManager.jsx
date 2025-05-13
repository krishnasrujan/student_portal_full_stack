// components/StudentManager.jsx
import React, { useState, useEffect } from 'react';
import API from '../api/api';

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', class: '', id: '' });

  useEffect(() => {
    API.get('/students').then(res => setStudents(res.data));
  }, []);

  const addStudent = async () => {
    await API.post('/students', form);
    const res = await API.get('/students');
    setStudents(res.data);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Add Student</h2>
      <input placeholder="Name" className="border p-1 m-1" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Class" className="border p-1 m-1" onChange={e => setForm({ ...form, class: e.target.value })} />
      <input placeholder="ID" className="border p-1 m-1" onChange={e => setForm({ ...form, id: e.target.value })} />
      <button className="bg-green-500 text-white p-1 m-1" onClick={addStudent}>Add</button>

      <h3 className="mt-4">Student List</h3>
      <ul>{students.map((s, i) => <li key={i}>{s.name} - {s.class} - {s.vaccinated ? '✅' : '❌'}</li>)}</ul>
    </div>
  );
};

export default StudentManager;
