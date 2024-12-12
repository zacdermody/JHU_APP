from flask import Blueprint, request, jsonify
from models import create_resident, get_residents, update_resident
from utils import send_temp_password

resident_routes = Blueprint('resident_routes', __name__)

@resident_routes.route('/residents', methods=['POST'])
def add_resident():
    data = request.json
    try:
        # Create a new resident and insert into the database
        resident = {
            'name': data['name'],
            'year': data['year'],
            'email': data['email'],
            'created_account': 'No',
            'submitted_form': 'No'
        }
        create_resident(resident)
        
        # Generate a temporary username and password
        temp_username = data['name'].split()[0].lower()
        temp_password = "temporaryPassword123"

        # Send temporary login details to the resident
        send_temp_password(data['email'], temp_username, temp_password)

        return jsonify({"message": "Resident added and email sent!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@resident_routes.route('/residents', methods=['GET'])
def fetch_residents():
    try:
        residents = get_residents()
        return jsonify(residents), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@resident_routes.route('/submit-dates', methods=['POST'])
def submit_dates():
    try:
        data = request.json
        name = data['name']
        vacation_dates = data['vacationDates']
        elective_dates = data['electiveDates']
        
        # Update resident's record
        update_resident(name, {
            'vacation_dates': vacation_dates,
            'elective_dates': elective_dates,
            'submitted_form': 'Yes'
        })

        return jsonify({"message": "Form submitted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
