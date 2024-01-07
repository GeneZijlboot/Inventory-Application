async function createDocument(client, collection, document) {
    try {
        // Insert the document into the specified collection
        const result = await collection.insertOne(document);
        console.log(`Document inserted with ID: ${result.insertedId}`);
    } catch (error) {
        console.error('Error inserting document:', error);
        throw error;
    }
}

module.exports = { createDocument };