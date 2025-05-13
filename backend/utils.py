import csv
import db

from io import StringIO
from models import Student

def import_students_from_csv(csv_data):
    """
    Imports student data from a CSV string.

    Args:
        csv_data (str): CSV data as a string.

    Returns:
        list: A list of imported Student objects.
    """
    csv_file = StringIO(csv_data)
    csv_reader = csv.DictReader(csv_file)
    imported_students = []

    for row in csv_reader:
        student = Student(
            name=row['name'],
            class_name=row['class_name'],
            student_id=row['student_id']
        )
        db.session.add(student)
        imported_students.append(student)

    db.session.commit()
    return imported_students