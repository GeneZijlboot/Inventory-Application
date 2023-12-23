async function createCollection(database, genre){
    try {
        await database.createCollection(genre);
        console.log(`Collection '${genre}' created successfully.`);
    } catch (error) {
        console.error(`Error creating new Genre '${genre}':`, error);
    }
}

module.exports = { createCollection };