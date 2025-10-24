const express = require('express');
const router = express.Router();
const multer = require('multer');
const { validateUpload } = require('../middleware/validation');
const { uploadXML, getReports, getReportById } = require('../controllers/reportController');

// Configure multer for XML file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/xml' || file.originalname.endsWith('.xml')) {
            cb(null, true);
        } else {
            cb(new Error('Only XML files are allowed'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Routes
router.post('/upload', upload.single('file'), validateUpload, uploadXML);
router.get('/reports', getReports);
router.get('/reports/:id', getReportById);

module.exports = router;