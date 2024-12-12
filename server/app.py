from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from flask_mail import Mail, Message
import datetime
import logging
import os

# ---------------------- Flask App Initialization ---------------------- #
app = Flask(__name__, static_folder='build', static_url_path='')

# Enable CORS to allow requests from the frontend (React)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Setup logging for debugging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# ---------------------- MongoDB Configuration ---------------------- #
client = MongoClient('mongodb+srv://schedulingwiz:s.06017781A@cluster0.yd3nt.mongodb.net/')
db = client.mydatabase

# Collections for storing resident and date information
residents_collection = db.residents
assignments_collection = db.residents_assignments1
dates_mapping_collection = db.date_mapping1
assignments_metadata_collection = db.assignments_metadata

# ---------------------- Flask-Mail Configuration ---------------------- #
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USERNAME='your_email@gmail.com',  # Replace with your email
    MAIL_PASSWORD='your_password',         # Replace with your email password or app password
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_DEFAULT_SENDER='your_email@gmail.com'
)

mail = Mail(app)

# ---------------------- Employee Access Key Verification ---------------------- #
ACCESS_KEYS = {"EMP-1234-5678-XYZ", "EMP-9876-5432-ABC"}

@app.route('/verify-access-key', methods=['POST'])
def verify_access_key():
    logging.debug("Request received at /verify-access-key")
    data = request.get_json()
    access_key = data.get('accessKey')

    logging.debug(f"Access key provided: {access_key}")

    if access_key in ACCESS_KEYS:
        return jsonify({"message": "Access key verified!"}), 200
    else:
        logging.warning("Invalid access key provided.")
        return jsonify({"error": "Invalid access key."}), 401

# ---------------------- Resident Management ---------------------- #
@app.route('/api/residents', methods=['GET', 'POST'])
def manage_residents():
    if request.method == 'GET':
        return fetch_residents()
    elif request.method == 'POST':
        return add_resident()

def add_resident():
    logging.debug("POST request received at /api/residents")
    data = request.get_json()
    logging.debug(f"Data received for new resident: {data}")
    try:
        resident = {
            'name': data['name'],
            'year': data['year'],
            'email': data['email'],
            'created_account': 'No',
            'submitted_form': 'No'
        }
        result = residents_collection.insert_one(resident)
        logging.debug(f"Resident added with ID: {result.inserted_id}")
        return jsonify({"message": "Resident added!"}), 201
    except Exception as e:
        logging.error(f"Error adding resident: {e}")
        return jsonify({"error": str(e)}), 400

def fetch_residents():
    logging.debug("GET request received at /api/residents")
    try:
        residents = list(residents_collection.find({}, {'_id': 0}))
        logging.debug(f"Residents fetched: {residents}")
        return jsonify(residents), 200
    except Exception as e:
        logging.error(f"Error fetching residents: {e}")
        return jsonify({"error": str(e)}), 400

@app.route('/api/residents/<string:email>', methods=['DELETE', 'PUT'])
def modify_resident(email):
    if request.method == 'DELETE':
        return delete_resident(email)
    elif request.method == 'PUT':
        return edit_resident(email)

def delete_resident(email):
    logging.debug(f"DELETE request received at /api/residents/{email}")
    try:
        result = residents_collection.delete_one({"email": email})
        if result.deleted_count > 0:
            logging.debug(f"Resident with email {email} deleted successfully.")
            return jsonify({"message": "Resident deleted successfully!"}), 200
        else:
            logging.warning(f"Resident with email {email} not found.")
            return jsonify({"error": "Resident not found."}), 404
    except Exception as e:
        logging.error(f"Error deleting resident: {e}")
        return jsonify({"error": str(e)}), 400

def edit_resident(email):
    logging.debug(f"PUT request received at /api/residents/{email}")
    data = request.get_json()
    logging.debug(f"Data received for updating resident: {data}")
    try:
        update_result = residents_collection.update_one({"email": email}, {"$set": {
            'name': data['name'],
            'year': data['year'],
            'email': data['email'],
            'created_account': data.get('created_account', 'No'),
            'submitted_form': data.get('submitted_form', 'No')
        }})
        if update_result.matched_count > 0:
            logging.debug(f"Resident with email {email} updated successfully.")
            return jsonify({"message": "Resident updated successfully!"}), 200
        else:
            logging.warning(f"Resident with email {email} not found for update.")
            return jsonify({"error": "Resident not found."}), 404
    except Exception as e:
        logging.error(f"Error updating resident: {e}")
        return jsonify({"error": str(e)}), 400

# ---------------------- Elective/Vacation Dates Submission ---------------------- #
@app.route('/submit-dates', methods=['POST'])
def submit_dates():
    logging.debug("POST request received at /submit-dates")
    data = request.get_json()
    email = data.get('email')
    logging.debug(f"Data received for date submission: {data}")

    if not email:
        logging.warning("Email is required for date submission.")
        return jsonify({"error": "Email is required."}), 400

    try:
        dates_collection = db.dates_submissions

        dates_collection.insert_one({
            "email": email,
            "vacationWeeks": data['vacationWeeks'],
            "electiveWeeks": data['electiveWeeks'],
            "submitted_at": datetime.datetime.utcnow()
        })
        residents_collection.update_one({"email": email}, {"$set": {"submitted_form": "Yes"}})
        logging.debug(f"Dates submitted successfully for resident with email {email}.")
        return jsonify({"message": "Dates submitted successfully!"}), 201
    except Exception as e:
        logging.error(f"Error submitting dates: {e}")
        return jsonify({"error": str(e)}), 400

# ---------------------- Schedule Endpoint ---------------------- #
@app.route('/api/schedule', methods=['GET'])
def get_individual_schedule():
    """
    Fetch the schedule for a specific resident based on their name or email.
    """
    logging.debug("GET request received at /api/schedule")
    resident_name = request.args.get('residentName')
    email = request.args.get('email')

    if not resident_name and not email:
        logging.warning("Resident name or email is required for fetching schedule.")
        return jsonify({"error": "Resident name or email is required."}), 400

    try:
        query = {}
        if resident_name:
            query['resident_name'] = resident_name
        if email:
            query['email'] = email

        schedule = assignments_collection.find_one(query, {'_id': 0})

        if not schedule:
            logging.warning(f"Schedule not found for query: {query}")
            return jsonify({"error": "Schedule not found."}), 404

        logging.debug(f"Schedule fetched: {schedule}")
        return jsonify(schedule), 200
    except Exception as e:
        logging.error(f"Error fetching schedule: {e}")
        return jsonify({"error": str(e)}), 500

# ---------------------- New Data Endpoints ---------------------- #
@app.route('/api/residents_assignments1/assignments', methods=['GET'])
def api_get_assignments():
    logging.debug("GET request received at /api/residents_assignments1/assignments")
    try:
        assignments_list = list(assignments_collection.find({}, {'_id': 0}))
        logging.debug(f"Assignments fetched: {assignments_list}")

        residents_data = []
        for item in assignments_list:
            resident_name = item.get('resident_name')
            assignments = item.get('assignments', {})
            residents_data.append({
                'name': resident_name,
                'assignments': assignments
            })

        return jsonify(residents_data), 200
    except Exception as e:
        logging.error(f"Error fetching assignments: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/date_mapping1', methods=['GET'])
def api_get_dates_mapping():
    logging.debug("GET request received at /api/date_mapping1")
    try:
        dates_mapping_list = list(dates_mapping_collection.find({}, {'_id': 0}))
        logging.debug(f"Dates mapping fetched: {dates_mapping_list}")

        dates_mapping_dict = {str(item['week_number']): item['date_range'] for item in dates_mapping_list}
        return jsonify(dates_mapping_dict), 200
    except Exception as e:
        logging.error(f"Error fetching dates mapping: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/assignments_metadata', methods=['GET'])
def api_get_assignments_metadata():
    logging.debug("GET request received at /api/assignments_metadata")
    try:
        assignments_metadata_list = list(assignments_metadata_collection.find({}, {'_id': 0}))
        logging.debug(f"Assignments metadata fetched: {assignments_metadata_list}")

        assignments_metadata = assignments_metadata_list[0] if assignments_metadata_list else {}
        return jsonify(assignments_metadata), 200
    except Exception as e:
        logging.error(f"Error fetching assignments metadata: {e}")
        return jsonify({"error": str(e)}), 500

# ---------------------- Serving React Frontend ---------------------- #
@app.route('/', methods=['GET'])
def serve_index():
    return send_from_directory('build', 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_react_app(path):
    if os.path.exists(os.path.join('build', path)):
        return send_from_directory('build', path)
    else:
        return send_from_directory('build', 'index.html')

# ---------------------- Run Flask App ---------------------- #
if __name__ == '__main__':
    app.run(debug=True, port=5000)
