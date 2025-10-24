const mongoose = require('mongoose');

const BasicDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobilePhone: { type: String, required: true },
    pan: { type: String, required: true },
    creditScore: { type: Number, required: true }
});

const ReportSummarySchema = new mongoose.Schema({
    totalAccounts: { type: Number, required: true },
    activeAccounts: { type: Number, required: true },
    closedAccounts: { type: Number, required: true },
    currentBalanceAmount: { type: Number, required: true },
    securedAccountsAmount: { type: Number, required: true },
    unsecuredAccountsAmount: { type: Number, required: true },
    lastSevenDaysCreditEnquiries: { type: Number, required: true }
});

const CreditAccountSchema = new mongoose.Schema({
    creditCardNumber: { type: String, required: true },
    bank: { type: String, required: true },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    accountNumber: { type: String, required: true },
    amountOverdue: { type: Number, default: 0 },
    currentBalance: { type: Number, required: true }
});

const CreditReportSchema = new mongoose.Schema({
    basicDetails: { type: BasicDetailsSchema, required: true },
    reportSummary: { type: ReportSummarySchema, required: true },
    creditAccounts: [CreditAccountSchema],
    uploadedAt: { type: Date, default: Date.now },
    xmlFileName: { type: String, required: true }
}, {
    timestamps: true
});

// Indexes for faster queries
CreditReportSchema.index({ 'basicDetails.pan': 1 });
CreditReportSchema.index({ uploadedAt: -1 });

module.exports = {
    CreditReport: mongoose.model('CreditReport', CreditReportSchema),
    BasicDetails: mongoose.model('BasicDetails', BasicDetailsSchema),
    ReportSummary: mongoose.model('ReportSummary', ReportSummarySchema),
    CreditAccount: mongoose.model('CreditAccount', CreditAccountSchema)
};