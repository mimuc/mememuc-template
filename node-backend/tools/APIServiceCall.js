/**
 * Searches for memes in the MongoDB collection based on the provided request query parameters.
 * 
<<<<<<< Updated upstream
 * @param {Object} req The request object from Express route, containing query parameters.
 * @returns A promise that resolves to an array of memes matching the search criteria.
=======
 * @param {Object} req // The request object from Express route, containing query parameters.
 * @returns //A promise that resolves to an array of memes matching the search criteria.
>>>>>>> Stashed changes
 */
function findMemesInDB(req) {
    // Initialize search parameters with default condition to exclude private memes
    let searchParams = {
        'status': {$ne: 'private'} // Exclude memes marked as 'private'
    };

    // Apply filter by title if provided, using case-insensitive regex for partial match
    if (req.query.title) {
        searchParams['title'] = {$regex: req.query.title, $options: 'i'};
    }

    // Apply filter by creator email if provided
    if (req.query.creator) {
        searchParams['CreatorMail'] = req.query.creator;
    }

    // Determine sorting order based on 'order' query parameter, defaulting to descending
    let sortParams = {
        'memeCreated': req.query.order === "ascending" ? 1 : -1
    };

    // Determine the limit for number of results, defaulting to 10 if not specified or invalid
    let limit = parseInt(req.query.limit, 10) || 10;

    // Perform the database query with the constructed search and sort parameters, and apply limit
    return req.mongoDB.collection('memes')
        .find(searchParams)
        .sort(sortParams)
        .limit(limit)
        .toArray(); // Convert the query result to an array of documents
}

// Export the findMemesInDB function for use in other parts of the application
module.exports.findMemesInDB = findMemesInDB;