const xml2js = require('xml2js');
const fs = require('fs').promises;
const { CreditReport } = require('../models/CreditReport');
const logger = require('../utils/logger');

// XML upload and processing
exports.uploadXML = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const xmlData = await fs.readFile(req.file.path, 'utf8');
        const parser = new xml2js.Parser({ 
            explicitArray: false,
            trim: true,
            explicitRoot: true
        });
        const result = await parser.parseStringPromise(xmlData);
        
        logger.info('Parsed XML:', JSON.stringify(result, null, 2));

        // Extract data from XML
        const creditData = extractCreditData(result);

        // Save to MongoDB
        const creditReport = new CreditReport(creditData);
        await creditReport.save();

        // Clean up uploaded file
        await fs.unlink(req.file.path);

        res.status(201).json({
            message: 'Credit report processed successfully',
            reportId: creditReport._id
        });
    } catch (error) {
        logger.error('Error processing XML file:', error);
        res.status(500).json({ error: 'Error processing XML file' });
    }
};

// Get all reports
exports.getReports = async (req, res) => {
    try {
        const reports = await CreditReport.find()
            .select('-__v')
            .sort({ uploadedAt: -1 })
            .limit(10);
        res.json(reports);
    } catch (error) {
        logger.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Error fetching reports' });
    }
};

// Get report by ID
exports.getReportById = async (req, res) => {
    try {
        const report = await CreditReport.findById(req.params.id).select('-__v');
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json(report);
    } catch (error) {
        logger.error('Error fetching report:', error);
        res.status(500).json({ error: 'Error fetching report' });
    }
};

// Helper function to extract credit data from XML
function extractCreditData(xmlResult) {
    const report = xmlResult.INProfileResponse;
    
    if (!report) {
        throw new Error('Invalid XML format: Missing INProfileResponse element');
    }

    // Extract name from current application or CAIS holder details
    const name = report.Current_Application?.Current_Application_Details?.Current_Applicant_Details?.First_Name + ' ' + 
                report.Current_Application?.Current_Application_Details?.Current_Applicant_Details?.Last_Name;
    
    // Get PAN and mobile from Current Application or first CAIS account
    const mobilePhone = report.Current_Application?.Current_Application_Details?.Current_Applicant_Details?.MobilePhoneNumber;
    const pan = report.CAIS_Account?.CAIS_Account_DETAILS?.[0]?.CAIS_Holder_Details?.Income_TAX_PAN;
    
    // Get credit score
    const creditScore = parseInt(report.SCORE?.BureauScore) || 0;

    // Get account summary
    const summary = report.CAIS_Account?.CAIS_Summary?.Credit_Account || {};
    const balances = report.CAIS_Account?.CAIS_Summary?.Total_Outstanding_Balance || {};

    return {
        basicDetails: {
            name: name || 'Unknown',
            mobilePhone: mobilePhone || 'Unknown',
            pan: pan || 'Unknown',
            creditScore: creditScore
        },
        reportSummary: {
            totalAccounts: parseInt(summary.CreditAccountTotal) || 0,
            activeAccounts: parseInt(summary.CreditAccountActive) || 0,
            closedAccounts: parseInt(summary.CreditAccountClosed) || 0,
            currentBalanceAmount: parseFloat(balances.Outstanding_Balance_All) || 0,
            securedAccountsAmount: parseFloat(balances.Outstanding_Balance_Secured) || 0,
            unsecuredAccountsAmount: parseFloat(balances.Outstanding_Balance_UnSecured) || 0,
            lastSevenDaysCreditEnquiries: parseInt(report.TotalCAPS_Summary?.TotalCAPSLast7Days) || 0
        },
        creditAccounts: report.CAIS_Account?.CAIS_Account_DETAILS?.map(account => ({
            creditCardNumber: account.Account_Number || 'Unknown',
            bank: account.Subscriber_Name?.trim() || 'Unknown',
            address: {
                street: [
                    account.CAIS_Holder_Address_Details?.First_Line_Of_Address_non_normalized,
                    account.CAIS_Holder_Address_Details?.Second_Line_Of_Address_non_normalized,
                    account.CAIS_Holder_Address_Details?.Third_Line_Of_Address_non_normalized
                ].filter(Boolean).join(', '),
                city: account.CAIS_Holder_Address_Details?.City_non_normalized || 'Unknown',
                state: account.CAIS_Holder_Address_Details?.State_non_normalized || 'Unknown',
                pincode: account.CAIS_Holder_Address_Details?.ZIP_Postal_Code_non_normalized || 'Unknown'
            },
            accountNumber: account.Account_Number || 'Unknown',
            amountOverdue: parseFloat(account.Amount_Past_Due) || 0,
            currentBalance: parseFloat(account.Current_Balance) || 0
        })) || [],
        xmlFileName: report.CreditProfileHeader?.ReportNumber || 'Unknown'
    };
}