import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const ImportStudents = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setCsvFile(event.target.files[0]);
    };

    const handleImport = async () => {
        if (!csvFile) {
            setError('Please select a CSV file.');
            return;
        }

        setMessage('');
        setError('');

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const csvData = e.target.result;
                const response = await axios.post(`${API_BASE_URL}/students/import`, csvData, {
                    headers: {
                        'Content-Type': 'text/csv',
                    },
                });
                setMessage(response.data.message);
                setCsvFile(null);
            };
            reader.readAsText(csvFile);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to import students.');
        }
    };

    return (
        <div>
            <h2>Import Students from CSV</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <input type="file" accept=".csv" onChange={handleFileChange} />
                <button onClick={handleImport} disabled={!csvFile}>Import</button>
            </div>
            <p>The CSV file should have columns: name, class_name, student_id</p>
        </div>
    );
};

export default ImportStudents;