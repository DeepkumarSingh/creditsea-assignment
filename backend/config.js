module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/creditsea',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    environment: process.env.NODE_ENV || 'development'
};