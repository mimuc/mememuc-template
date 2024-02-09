// Importing necessary modules
const express = require('express');
const bodyParser = require('body-parser'); // For parsing POST request bodies
const ImageEditor = require("../../tools/imageEditor");
const { zipBuffers } = require("../../tools/imageZipper");

// Creating an Express app and router
const app = express();
const router = express.Router();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define a POST endpoint for meme generation
router.post("/generateMeme", async (req, res) => {
    console.log("Received meme generation request");

    try {
        const memes = req.body.memes; // Expecting an array of meme configurations
        const templates = req.body.templates; // Expecting an array of templates or a single template
        
        // Validate input (basic validation for demonstration)
        if (!memes || !templates) {
            return res.status(400).send("Missing memes or templates in the request");
        }
        
        // Process each template with its corresponding texts
        const results = await Promise.all(templates.map(async (template) => {
            const url = await fetchMemeUrl(template.name || template); // Support both template name or URL directly
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            const imageEditor = new ImageEditor(buffer);
            
            // Process each text configuration for the current template
            const editorPromises = memes.map(memeConfig => imageEditor.addCaptionsToBuffer({...memeConfig, template}));
            return await Promise.all(editorPromises);
        }));

        // Flatten the results array and zip the edited memes
        const flatResults = results.flat();
        const archive = await zipBuffers(flatResults);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="memes.zip"');
        res.end(archive);
    } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred while processing your request.");
    }
});

// Function to fetch the meme template URL based on the template name or direct URL
async function fetchMemeUrl(template) {
    if (template.startsWith('http')) {
        // Direct URL provided
        return template;
    } else {
        // Fetch from a predefined source or database
        const response = await fetch("https://api.imgflip.com/get_memes");
        const { data } = await response.json();
        const meme = data.memes.find(m => m.name === template);
        if (!meme) throw new Error("Template not found");
        return meme.url;
    }
}

// Use the router and start the server
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the app for testing
module.exports = app;
