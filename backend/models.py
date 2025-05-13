from db import db
from datetime import datetime

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    class_name = db.Column(db.String(50))
    student_id = db.Column(db.String(20), unique=True, nullable=False)
    vaccinations = db.relationship('VaccinationRecord', backref='student', lazy=True)

    def __repr__(self):
        return f'<Student {self.name}>'

class VaccinationDrive(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vaccine_name = db.Column(db.String(100), nullable=False)
    drive_date = db.Column(db.Date, nullable=False)
    available_doses = db.Column(db.Integer, nullable=False)
    applicable_classes = db.Column(db.String(255))  # e.g., "5-7, 9"
    records = db.relationship('VaccinationRecord', backref='drive', lazy=True)

    def __repr__(self):
        return f'<VaccinationDrive {self.vaccine_name} on {self.drive_date}>'

class VaccinationRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    drive_id = db.Column(db.Integer, db.ForeignKey('vaccination_drive.id'), nullable=False)
    vaccination_date = db.Column(db.Date, default=datetime.utcnow)

    def __repr__(self):
        return f'<VaccinationRecord for Student {self.student_id} on Drive {self.drive_id}>'