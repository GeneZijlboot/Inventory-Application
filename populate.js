const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'your_database_name';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to populate the database
const populateDatabase = async () => {
    try {
        // Connect to the server
        await client.connect();

        // Select the database
        const db = client.db(GameGenres);

        // Add your population logic here

        // Example: Insert documents into a collection
        const collection = db.collection('your_collection_name');
        const documents = [
            { title: 'Document 1' },
            { description: 'Document 2' },
            { price: 'Document 2' }
            
        ];

        await collection.insertMany(documents);

        console.log('Documents inserted successfully');
    } finally {
        // Close the client
        await client.close();
        console.log('Connection closed');
    }
};

// Call the populate function
// to populate: 
// node populate.js 
populateDatabase();