// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser'); // For parsing JSON bodies, if needed for advanced filtering
const { findMemesInDB } = require('../../tools/dbApiSearch');
const { zipBuffers } = require("../../tools/imageZipper");
const { createJpegNameBuffersFromMemes, attachMetadataToMemes } = require("../../tools/imageConverter");

// Create an Express app and router
const app = express();
const router = express.Router();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define a GET endpoint for fetching memes based on query parameters
router.get('/fetchMemes', async (req, res) => {
    try {
        // Attempt to find memes in the database using the request's query parameters
        const memes = await findMemesInDB(req.query);

        // If no memes are found, send an appropriate message to the client
        if (memes.length === 0) {
            return res.status(404).send("No memes found for specified parameters.");
        }

        // Optionally, attach metadata to each meme for the intermediate and advanced tiers
        const memesWithMetadata = await attachMetadataToMemes(memes);

        // Determine response format based on request (e.g., zip or individual URLs)
        const shouldZip = req.query.zip === 'true'; // Assume a query parameter 'zip' controls the output format

        if (shouldZip) {
            // Convert found memes into JPEG buffers with names and zip them
            const nameBuffers = await createJpegNameBuffersFromMemes(memesWithMetadata);
            const archive = await zipBuffers(nameBuffers);
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename="memes.zip"');
            res.end(archive);
        } else {
            // If not zipping, send the URLs and metadata directly (for simplicity in this example)
            res.json(memesWithMetadata.map(meme => ({ url: meme.url, metadata: meme.metadata })));
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing your request.");
    }
});

// Function to attach metadata to memes (placeholder function)
async function getMemeMetadataById(memeId) {
    // Simulate a database call or external API request
    // This is a placeholder function. Replace it with your actual data fetching logic.
    return {
        title: `Meme Title for ID ${memeId}`,
        creator: 'Creator Name',
        creationDate: '2021-01-01',
        imageCaptions: ['Top Text', 'Bottom Text'],
        votes: 100,
        usedTemplate: 'Standard Template'
    };
}

// Function to attach metadata to each meme in the list
async function attachMetadataToMemes(memes) {
    // Map each meme to a promise that resolves to the meme with its metadata attached
    const memesWithMetadataPromises = memes.map(async (meme) => {
        const metadata = await getMemeMetadataById(meme.id); // Assume each meme has an id
        return { ...meme, metadata }; // Combine the meme object with its metadata
    });

    // Wait for all promises to resolve and return the enhanced memes
    return await Promise.all(memesWithMetadataPromises);
}

// Use the router and start the server
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the app for testing
module.exports = app;
