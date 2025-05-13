import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';
import DriveList from './components/DriveList';
import AddDrive from './components/AddDrive';
import EditDrive from './components/EditDrive';
import RecordVaccination from './components/RecordVaccination';
import VaccinationReport from './components/VaccinationReport';
import ImportStudents from './components/ImportStudents';

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/students">Students</Link></li>
                        <li><Link to="/students/add">Add Student</Link></li>
                        <li><Link to="/students/import">Import Students</Link></li>
                        <li><Link to="/drives">Vaccination Drives</Link></li>
                        <li><Link to="/drives/add">Add Drive</Link></li>
                        <li><Link to="/vaccinations/record">Record Vaccination</Link></li>
                        <li><Link to="/vaccinations/report">Vaccination Report</Link></li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/students" element={<StudentList />} />
                    <Route path="/students/add" element={<AddStudent />} />
                    <Route path="/students/edit/:id" element={<EditStudent />} />
                    <Route path="/students/import" element={<ImportStudents />} />
                    <Route path="/drives" element={<DriveList />} />
                    <Route path="/drives/add" element={<AddDrive />} />
                    <Route path="/drives/edit/:id" element={<EditDrive />} />
                    <Route path="/vaccinations/record" element={<RecordVaccination />} />
                    <Route path="/vaccinations/report" element={<VaccinationReport />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;