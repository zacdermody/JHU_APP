const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Replace the connection URL and database name with your MongoDB details
const uri = 'mongodb+srv://schedulingwiz:s.06017781A@cluster0.yd3nt.mongodb.net/schedulerDB?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function uploadAssignmentMetadata() {
  try {
    await client.connect();
    const database = client.db('mydatabase');
    const collection = database.collection('assignments_metadata');

    // Define the path to the JSON file using `path` for compatibility
    const filePath = path.join(__dirname, 'assignment_metadata copy.json'); // Adjust path as needed

    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Transform JSON data into an array of documents for MongoDB
    const documents = Object.keys(data).map(assignmentName => ({
      assignment_name: assignmentName,
      time: data[assignmentName].Time,
      location: data[assignmentName].Location,
      head_teacher: data[assignmentName].Head_Teacher
    }));

    // Insert documents into the collection
    const result = await collection.insertMany(documents);
    console.log(`${result.insertedCount} documents were inserted`);

  } catch (error) {
    console.error('Error uploading data:', error);
  } finally {
    await client.close();
  }
}

// Run the function
uploadAssignmentMetadata();