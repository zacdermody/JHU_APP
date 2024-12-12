import unittest
import json
from app import app  # Import your Flask app

class FlaskAppTestCase(unittest.TestCase):
    def setUp(self):
        # Set up the test client
        self.app = app.test_client()
        self.app.testing = True

    # Test the base route
    def test_base_route(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Welcome to the Scheduling Wizard', response.data)

    # Test /verify-access-key with a valid key
    def test_verify_access_key_valid(self):
        response = self.app.post('/verify-access-key', json={'accessKey': 'EMP-1234-5678-XYZ'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Access key verified!')

    # Test /verify-access-key with an invalid key
    def test_verify_access_key_invalid(self):
        response = self.app.post('/verify-access-key', json={'accessKey': 'INVALID-KEY'})
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertIn('error', data)
        self.assertEqual(data['error'], 'Invalid access key.')

    # Test adding a new resident
    def test_add_resident(self):
        new_resident = {
            'name': 'John Doe',
            'year': 'PGY-1',
            'email': 'john.doe@example.com'
        }
        response = self.app.post('/api/residents', json=new_resident)
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Resident added!')

    # Test fetching all residents
    def test_get_residents(self):
        response = self.app.get('/api/residents')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)

    # Test updating a resident
    def test_edit_resident(self):
        updated_resident = {
            'name': 'John Doe Jr.',
            'year': 'PGY-2',
            'email': 'john.doe@example.com',
            'created_account': 'Yes',
            'submitted_form': 'Yes'
        }
        response = self.app.put('/api/residents/john.doe@example.com', json=updated_resident)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Resident updated successfully!')

    # Test deleting a resident
    def test_delete_resident(self):
        response = self.app.delete('/api/residents/john.doe@example.com')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Resident deleted successfully!')

    # Test submitting dates
    def test_submit_dates(self):
        date_submission = {
            'email': 'jane.doe@example.com',
            'vacationWeeks': ['Week 1', 'Week 2'],
            'electiveWeeks': ['Week 3', 'Week 4']
        }
        response = self.app.post('/submit-dates', json=date_submission)
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Dates submitted successfully!')

    # Test forgot password with existing user
    def test_forgot_password_existing_user(self):
        # First, ensure the user exists in the database
        self.app.post('/api/residents', json={
            'name': 'Jane Doe',
            'year': 'PGY-1',
            'email': 'jane.doe@example.com'
        })
        response = self.app.post('/forgot-password', json={'email': 'jane.doe@example.com'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Password reset instructions sent')

    # Test forgot password with non-existing user
    def test_forgot_password_non_existing_user(self):
        response = self.app.post('/forgot-password', json={'email': 'non.existent@example.com'})
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertEqual(data['error'], 'User not found.')

    # Test fetching assignments
    def test_get_assignments(self):
        response = self.app.get('/api/assignments')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)

    # Test fetching dates mapping
    def test_get_dates_mapping(self):
        response = self.app.get('/api/dates_mapping')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)

    # Test fetching assignments metadata
    def test_get_assignments_metadata(self):
        response = self.app.get('/api/assignments_metadata')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)

if __name__ == '__main__':
    unittest.main()
