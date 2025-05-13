import React from 'react';
import useApi from '../hooks/useApi';
import { Link } from 'react-router-dom';

const StudentList = () => {
    const { value: students, loading, error } = useApi('/students');

    if (loading) return <p>Loading students...</p>;
    if (error) return <p>Error loading students: {error.message}</p>;

    return (
        <div>
            <h2>Student List</h2>
            {students && students.map(student => (
                <div key={student.id}>
                    {student.name} ({student.student_id}) - Class: {student.class_name}
                    <Link to={`/students/edit/${student.id}`}>Edit</Link>
                </div>
            ))}
        </div>
    );
};

export default StudentList;