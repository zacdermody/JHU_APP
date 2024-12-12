from pymongo import MongoClient

# MongoDB connection
client = MongoClient('mongodb+srv://schedulingwiz:s.06017781A@cluster0.yd3nt.mongodb.net/')
db = client.mydatabase

# Collections
residents_collection = db.residents
assignments_collection = db.residents_assignments
dates_mapping_collection = db.dates_mapping
assignments_metadata_collection = db.assignments_metadata


# Helper functions
def create_resident(data):
    """Creates a new resident in the MongoDB collection."""
    residents_collection.insert_one(data)

def get_residents():
    """Retrieves all residents."""
    return list(residents_collection.find({}, {'_id': 0}))

def update_resident(name, data):
    """Updates a resident's info."""
    residents_collection.update_one({'name': name}, {'$set': data})

# New methods to get data from the new collections

def get_assignments():
    """Retrieves all resident assignments."""
    return list(assignments_collection.find({}, {'_id': 0}))

def get_dates_mapping():
    """Retrieves the week to date mapping."""
    return list(dates_mapping_collection.find({}, {'_id': 0}))

def get_assignments_metadata():
    """Retrieves all assignment metadata."""
    return list(assignments_metadata_collection.find({}, {'_id': 0}))

def get_assignments_for_resident(resident_name):
    """Retrieves the assignments for a specific resident."""
    return assignments_collection.find_one({'resident_name': resident_name}, {'_id': 0})

# Fetch all assignments
assignments = get_assignments()
#print(assignments)

# Fetch week to date mapping
dates_mapping = get_dates_mapping()
#print(dates_mapping)

# Fetch all assignment metadata
assignments_metadata = get_assignments_metadata()
#print(assignments_metadata)

# Fetch assignments for a specific resident
resident_assignments = get_assignments_for_resident('Aya')
#print(resident_assignments)

print(client.list_database_names())
db.residents_assignments.find({})
#db.dates_mapping.find({})
#db.assignments_metadata.find({})