const express = require('express');
const multer = require('multer');
const { predict } = require('../controllers/predictionController');

const router = express.Router();
const upload = multer(); // Memory storage for uploaded files

router.post('/predict', upload.single('image'), predict);

module.exports = router;
