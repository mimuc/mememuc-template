// Importing necessary modules
const express = require('express');
const ImageEditor = require("../../tools/imageEditor");
const { zipBuffers } = require("../../tools/imageZipper");

// Creating an Express router to define API endpoints
const router = express.Router();

// Define a GET endpoint for meme generation
router.get("/", async (req, res) => {
    console.log("Received API call");

    try {
        // Fetch the URL of the meme template based on the template name provided in the query
        const url = await fetchMemeUrl(req.query.template);

        // Fetch the image from the URL and convert it to an ArrayBuffer for editing
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();

        // Initialize the image editor with the image buffer
        const imageEditor = new ImageEditor(buffer);
        
        // Parse the meme configurations from the request query
        const memeConfigs = parseMemesFromReq(req);
        console.log("Create", memeConfigs.length, "memes for template ", req.query.template);
        
        // Create an array of promises to edit each meme configuration
        const editorPromises = memeConfigs.map(memeConfig => imageEditor.addCaptionsToBuffer(memeConfig));
        
        // Wait for all memes to be edited
        const results = await Promise.all(editorPromises);
        console.log("Finished editing memes");

        // Zip the edited memes and send the archive in the response
        const archive = await zipBuffers(results, res);
        res.end(archive);
    } catch (e) {
        console.error(e);
        // Send an error response in case of failure
        res.status(500).send("An error occurred while processing your request.");
    }
});

// Function to parse meme configurations from the request
function parseMemesFromReq(req) {
    return req.query.memes.map(JSON.parse);
}

// Function to fetch the meme template URL based on the template name
async function fetchMemeUrl(template) {
    const response = await fetch("https://api.imgflip.com/get_memes");
    const { data } = await response.json();
    const meme = data.memes.find(m => m.name === template);
    if (!meme) throw new Error("Template not found");
    return meme.url;
}

// Export the router for use in the main server file
module.exports = router;
