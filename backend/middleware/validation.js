const { check, validationResult } = require('express-validator');

exports.validateUpload = [
    check('file')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('No file uploaded');
            }
            if (!req.file.originalname.match(/\.(xml)$/)) {
                throw new Error('Only XML files are allowed');
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];