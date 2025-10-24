const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { CreditReport } = require('../models/CreditReport');
const path = require('path');

describe('Credit Report API Tests', () => {
    beforeAll(async () => {
        // Connect to test database
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/creditsea_test';
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        // Clean up database and close connection
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear the reports collection before each test
        await CreditReport.deleteMany({});
    });

    describe('POST /api/upload', () => {
        it('should upload and process XML file successfully', async () => {
            const response = await request(app)
                .post('/api/upload')
                .attach('file', path.join(__dirname, '../test/fixtures/sample.xml'));

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('reportId');
            expect(response.body).toHaveProperty('message', 'Credit report processed successfully');
        });

        it('should return 400 when no file is uploaded', async () => {
            const response = await request(app)
                .post('/api/upload');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/reports', () => {
        it('should return list of reports', async () => {
            // Create a sample report first
            const sampleReport = new CreditReport({
                basicDetails: {
                    name: 'John Doe',
                    mobilePhone: '1234567890',
                    pan: 'ABCDE1234F',
                    creditScore: 750
                },
                reportSummary: {
                    totalAccounts: 2,
                    activeAccounts: 1,
                    closedAccounts: 1,
                    currentBalanceAmount: 50000,
                    securedAccountsAmount: 40000,
                    unsecuredAccountsAmount: 10000,
                    lastSevenDaysCreditEnquiries: 0
                },
                creditAccounts: [],
                xmlFileName: 'test.xml'
            });
            await sampleReport.save();

            const response = await request(app).get('/api/reports');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBe(1);
            expect(response.body[0].basicDetails.name).toBe('John Doe');
        });
    });

    describe('GET /api/reports/:id', () => {
        it('should return a specific report', async () => {
            // Create a sample report first
            const sampleReport = new CreditReport({
                basicDetails: {
                    name: 'Jane Doe',
                    mobilePhone: '9876543210',
                    pan: 'ZYXWV9876G',
                    creditScore: 800
                },
                reportSummary: {
                    totalAccounts: 3,
                    activeAccounts: 2,
                    closedAccounts: 1,
                    currentBalanceAmount: 75000,
                    securedAccountsAmount: 60000,
                    unsecuredAccountsAmount: 15000,
                    lastSevenDaysCreditEnquiries: 1
                },
                creditAccounts: [],
                xmlFileName: 'test2.xml'
            });
            await sampleReport.save();

            const response = await request(app).get(`/api/reports/${sampleReport._id}`);

            expect(response.status).toBe(200);
            expect(response.body.basicDetails.name).toBe('Jane Doe');
            expect(response.body.basicDetails.creditScore).toBe(800);
        });

        it('should return 404 for non-existent report', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/reports/${nonExistentId}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Report not found');
        });
    });
});