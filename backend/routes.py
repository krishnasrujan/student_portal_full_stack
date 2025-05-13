import db

from flask import Blueprint, jsonify, request, abort
from models import Student, VaccinationDrive, VaccinationRecord
from datetime import datetime, timedelta
from utils import import_students_from_csv
from flask_cors import CORS
from flask import g
from functools import wraps

main = Blueprint('main', __name__)
CORS(main) # Enable CORS for all routes in this blueprint


def authenticate():
    # In a real app, you'd verify a token or session here
    # For this assignment, let's just return True (always authenticated)
    return True

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Simulate role check (can be extended to use headers or tokens)
        if not authenticate():
            return jsonify({'message': 'Unauthorized'}), 401
        # Simulate admin check
        g.user_role = 'admin'  # In real world, parse from token
        if g.user_role != 'admin':
            return jsonify({'message': 'Forbidden'}), 403
        return f(*args, **kwargs)
    return decorated_function

# --- Student Management ---

@main.route('/students', methods=['GET'])
@admin_required
def get_students():
    students = Student.query.all()
    return jsonify([{'id': s.id, 'name': s.name, 'class_name': s.class_name, 'student_id': s.student_id} for s in students])

@main.route('/students/<int:student_id>', methods=['GET'])
@admin_required
def get_student(student_id):
    student = Student.query.get_or_404(student_id)
    return jsonify({'id': student.id, 'name': student.name, 'class_name': student.class_name, 'student_id': student.student_id})

@main.route('/students', methods=['POST'])
@admin_required
def create_student():
    data = request.get_json()
    new_student = Student(name=data['name'], class_name=data['class_name'], student_id=data['student_id'])
    db.session.add(new_student)
    db.session.commit()
    return jsonify({'message': 'Student created successfully!', 'id': new_student.id}), 201

@main.route('/students/<int:student_id>', methods=['PUT'])
@admin_required
def update_student(student_id):
    student = Student.query.get_or_404(student_id)
    data = request.get_json()
    student.name = data['name']
    student.class_name = data['class_name']
    student.student_id = data['student_id']
    db.session.commit()
    return jsonify({'message': 'Student updated successfully!'})

@main.route('/students/<int:student_id>', methods=['DELETE'])
@admin_required
def delete_student(student_id):
    student = Student.query.get_or_404(student_id)
    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': 'Student deleted successfully!'})

@main.route('/students/import', methods=['POST'])
@admin_required
def import_students():
    csv_data = request.data.decode('utf-8')  # Get CSV data from request body
    try:
        imported_students = import_students_from_csv(csv_data)
        return jsonify({'message': f'Imported {len(imported_students)} students successfully!'}), 201
    except Exception as e:
        return jsonify({'message': f'Error importing students: {str(e)}'}), 400


# --- Vaccination Drive Management ---

@main.route('/drives', methods=['GET'])
@admin_required
def get_drives():
    drives = VaccinationDrive.query.all()
    return jsonify([{'id': d.id, 'vaccine_name': d.vaccine_name, 'drive_date': d.drive_date.isoformat(),
                     'available_doses': d.available_doses, 'applicable_classes': d.applicable_classes} for d in drives])

@main.route('/drives/<int:drive_id>', methods=['GET'])
@admin_required
def get_drive(drive_id):
    drive = VaccinationDrive.query.get_or_404(drive_id)
    return jsonify({'id': drive.id, 'vaccine_name': drive.vaccine_name, 'drive_date': drive.drive_date.isoformat(),
                     'available_doses': drive.available_doses, 'applicable_classes': drive.applicable_classes})

@main.route('/drives', methods=['POST'])
@admin_required
def create_drive():
    data = request.get_json()
    drive_date = datetime.strptime(data['drive_date'], '%Y-%m-%d').date()

    # Validation: Drive scheduled at least 15 days in advance
    if drive_date <= datetime.now().date() + timedelta(days=15):
        return jsonify({'message': 'Drive must be scheduled at least 15 days in advance.'}), 400

    # Validation: Prevent Overlaps (Basic - check for same date, can be improved)
    existing_drive = VaccinationDrive.query.filter_by(drive_date=drive_date).first()
    if existing_drive:
        return jsonify({'message': 'A drive already exists on this date.'}), 400

    new_drive = VaccinationDrive(vaccine_name=data['vaccine_name'], drive_date=drive_date,
                                  available_doses=data['available_doses'], applicable_classes=data['applicable_classes'])
    db.session.add(new_drive)
    db.session.commit()
    return jsonify({'message': 'Drive created successfully!', 'id': new_drive.id}), 201

@main.route('/drives/<int:drive_id>', methods=['PUT'])
@admin_required
def update_drive(drive_id):
    drive = VaccinationDrive.query.get_or_404(drive_id)
    data = request.get_json()
    drive_date = datetime.strptime(data['drive_date'], '%Y-%m-%d').date()

    # Validation:  Cannot edit past drives
    if drive.drive_date < datetime.now().date():
        return jsonify({'message': 'Cannot edit a past drive.'}), 400

    # Validation: Drive scheduled at least 15 days in advance
    if drive_date <= datetime.now().date() + timedelta(days=15):
        return jsonify({'message': 'Drive must be scheduled at least 15 days in advance.'}), 400

    # Validation: Prevent Overlaps (Basic - check for same date, can be improved)
    existing_drive = VaccinationDrive.query.filter_by(drive_date=drive_date).first()
    if existing_drive and existing_drive.id != drive.id:
        return jsonify({'message': 'A drive already exists on this date.'}), 400

    drive.vaccine_name = data['vaccine_name']
    drive.drive_date = drive_date
    drive.available_doses = data['available_doses']
    drive.applicable_classes = data['applicable_classes']
    db.session.commit()
    return jsonify({'message': 'Drive updated successfully!'})

@main.route('/drives/<int:drive_id>', methods=['DELETE'])
@admin_required
def delete_drive(drive_id):
    drive = VaccinationDrive.query.get_or_404(drive_id)

    # Validation: Cannot delete past drives (same as edit)
    if drive.drive_date < datetime.now().date():
        return jsonify({'message': 'Cannot delete a past drive.'}), 400

    db.session.delete(drive)
    db.session.commit()
    return jsonify({'message': 'Drive deleted successfully!'})


# --- Vaccination Records ---

@main.route('/vaccinations', methods=['POST'])
@admin_required
def create_vaccination_record():
    data = request.get_json()
    student_id = data['student_id']
    drive_id = data['drive_id']

    # Validation: Check if student exists
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'message': 'Student not found.'}), 400

    # Validation: Check if drive exists
    drive = VaccinationDrive.query.get(drive_id)
    if not drive:
        return jsonify({'message': 'Vaccination drive not found.'}), 400

    # Validation:  One student should not be vaccinated twice for the same vaccine.
    existing_record = VaccinationRecord.query.filter_by(student_id=student_id, drive_id=drive_id).first()
    if existing_record:
        return jsonify({'message': 'Student already vaccinated for this drive.'}), 400

    new_record = VaccinationRecord(student_id=student_id, drive_id=drive_id)
    db.session.add(new_record)
    db.session.commit()
    return jsonify({'message': 'Vaccination record created successfully!'}), 201

@main.route('/vaccinations/report', methods=['GET'])
@admin_required
def get_vaccination_report():

    vaccination_records = VaccinationRecord.query.all()
    report_data = []

    for record in vaccination_records:
        student = Student.query.get(record.student_id)
        drive = VaccinationDrive.query.get(record.drive_id)
        report_data.append({
            'student_name': student.name,
            'student_id': student.student_id,
            'vaccine_name': drive.vaccine_name,
            'vaccination_date': record.vaccination_date.isoformat()
        })

    return jsonify(report_data)

@main.route('/vaccinations/student/<int:student_id>', methods=['GET'])
@admin_required
def get_student_vaccinations(student_id):
        student = Student.query.get_or_404(student_id)
        vaccination_records = VaccinationRecord.query.filter_by(student_id=student_id).all()
        vaccinations = []
        for record in vaccination_records:
            drive = VaccinationDrive.query.get(record.drive_id)
            vaccinations.append({
                'vaccine_name': drive.vaccine_name,
                'vaccination_date': record.vaccination_date.isoformat(),
                'drive_date': drive.drive_date.isoformat()
            })
        return jsonify({'student_name': student.name, 'student_id': student.student_id, 'vaccinations': vaccinations})

@main.route('/vaccinations/drive/<int:drive_id>', methods=['GET'])
@admin_required
def get_drive_vaccinations(drive_id):
    drive = VaccinationDrive.query.get_or_404(drive_id)
    vaccination_records = VaccinationRecord.query.filter_by(drive_id=drive_id).all()
    vaccinations = []
    for record in vaccination_records:
        student = Student.query.get(record.student_id)
        vaccinations.append({
            'student_name': student.name,
            'student_id': student.student_id,
            'vaccination_date': record.vaccination_date.isoformat()
        })
    return jsonify({'vaccine_name': drive.vaccine_name, 'drive_date': drive.drive_date.isoformat(),
                    'vaccinations': vaccinations})