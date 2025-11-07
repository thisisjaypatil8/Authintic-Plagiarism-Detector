const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const router = express.Router();

// New libraries
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const upload = multer({ dest: 'uploads/' });

// Function to get plain text from different file types
const getTextFromFile = async (file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filePath = file.path;

    if (ext === '.txt') {
        return fs.readFileSync(filePath, 'utf8');
    } 

    else if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } 

    else if (ext === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    } 

    else if (ext === '.doc') {
        // .doc is a complex, proprietary format.
        // For this project, we'll ask users to re-save as .docx or .pdf
        throw new Error('".doc" files are not supported. Please save as .docx or .pdf');
    }

    else {
        throw new Error('Unsupported file type.');
    }
};

// @route   POST /api/documents/upload
router.post('/upload', upload.single('document'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // 1. Get text content using our new function
        const fileContent = await getTextFromFile(req.file);

        // 2. Call the NLP service (this URL is now correct)
        const nlpResponse = await axios.post('http://localhost:5001/api/check', {
            text: fileContent
        });

        // 3. Send the detailed report back to the frontend
        res.status(200).json(nlpResponse.data);

    } catch (error) {
        console.error('Error processing file:', error.message);
        res.status(500).send(error.message || 'Error analyzing the document.');
    } finally {
        // 4. Clean up the uploaded file
        fs.unlinkSync(req.file.path);
    }
});

// @route   POST /api/documents/rewrite
// (This route remains unchanged and correct)
router.post('/rewrite', async (req, res) => {
    const { sentence } = req.body;
    if (!sentence) {
        return res.status(400).json({ msg: 'Sentence is required' });
    }

    try {
        const nlpResponse = await axios.post(
            `http://localhost:5001/api/rewrite`,
            {
                sentence: sentence,
                api_key: process.env.GEMINI_API_KEY 
            }
        );
        res.json(nlpResponse.data);
    } catch (error) {
        console.error('Error calling rewrite service:', error.message);
        res.status(500).send('Error generating rewrite.');
    }
});

module.exports = router;