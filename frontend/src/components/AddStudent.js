import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const AddStudent = () => {
    const [name, setName] = useState('');
    const [className, setClassName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/students`, {
                name,
                class_name: className,
                student_id: studentId,
            });
            setMessage(response.data.message);
            setName('');
            setClassName('');
            setStudentId('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add student');
        }
    };

    return (
        <div>
            <h2>Add New Student</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Class:</label>
                    <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} />
                </div>
                <div>
                    <label>Student ID:</label>
                    <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
                </div>
                <button type="submit">Add Student</button>
            </form>
        </div>
    );
};

export default AddStudent;