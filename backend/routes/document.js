const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios'); // Make sure axios is imported
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// @route   POST /api/documents/upload
router.post('/upload', upload.single('document'), async (req, res) => {
    // This route remains the same as before
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    try {
        const fileContent = fs.readFileSync(req.file.path, 'utf8');
        const nlpResponse = await axios.post('http://localhost:5001/api/check', {
            text: fileContent
        });
        fs.unlinkSync(req.file.path);
        res.status(200).json(nlpResponse.data);
    } catch (error) {
        console.error('Error calling NLP service:', error.message);
        res.status(500).send('Error analyzing the document.');
    }
});

// --- NEW REWRITE PROXY ROUTE ---
// @route   POST /api/documents/rewrite
// @desc    Securely proxies rewrite request to Python service
router.post('/rewrite', async (req, res) => {
    const { sentence } = req.body;
    if (!sentence) {
        return res.status(400).json({ msg: 'Sentence is required' });
    }

    try {
        // Call the Python service, passing the sentence and the API key from our secure .env file
        const nlpResponse = await axios.post(
            `http://localhost:5001/api/rewrite`,
            {
                sentence: sentence,
                api_key: process.env.GEMINI_API_KEY 
            }
        );
        res.json(nlpResponse.data);
    } catch (error) {
        console.error('Error proxying rewrite request:', error.message);
        res.status(500).send('Error rewriting the sentence.');
    }
});

module.exports = router;