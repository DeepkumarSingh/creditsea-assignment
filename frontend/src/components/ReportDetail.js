import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import axios from 'axios';

// Utility function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount);
};

// Function to get credit score color
const getCreditScoreColor = (score) => {
  if (score >= 750) return '#4caf50';
  if (score >= 700) return '#8bc34a';
  if (score >= 650) return '#ffc107';
  if (score >= 600) return '#ff9800';
  return '#f44336';
};

// Function to get credit score analysis text
const getCreditScoreText = (score) => {
  if (score >= 750) return "Excellent credit score. You're likely to receive the best rates and terms on credit products.";
  if (score >= 700) return "Very good credit score. You should receive above-average rates from lenders.";
  if (score >= 650) return "Good credit score. You may qualify for loans with reasonable rates.";
  if (score >= 600) return "Fair credit score. You may face higher interest rates or may need to work on improving your score.";
  return "Poor credit score. You may have difficulty getting approved for credit or face very high interest rates.";
};

const ReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reports/${id}`);
        setReport(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">No report found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Credit Report Details
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => window.print()}
          startIcon={<CloudDownloadIcon />}
          sx={{ borderRadius: 2 }}
        >
          Download Report
        </Button>
      </Box>

      {/* Credit Score Card */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: `linear-gradient(135deg, ${getCreditScoreColor(report.basicDetails.creditScore)} 0%, #ffffff 100%)`,
          borderRadius: 3
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
              {report.basicDetails.creditScore}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666' }}>
              Credit Score
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                Score Analysis
              </Typography>
              <Typography variant="body2">
                {getCreditScoreText(report.basicDetails.creditScore)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Basic Details */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4,
          borderRadius: 2,
          borderLeft: '4px solid #1976d2'
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: '#1976d2',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <PersonIcon /> Basic Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography color="textSecondary" variant="subtitle2">Full Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{report.basicDetails.name}</Typography>
            </Box>
            <Box>
              <Typography color="textSecondary" variant="subtitle2">Mobile Number</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{report.basicDetails.mobilePhone}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography color="textSecondary" variant="subtitle2">PAN</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{report.basicDetails.pan}</Typography>
            </Box>
            <Box>
              <Typography color="textSecondary" variant="subtitle2">Report Date</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {new Date().toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Report Summary */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          borderLeft: '4px solid #2e7d32'
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: '#2e7d32',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AssessmentIcon /> Report Summary
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                backgroundColor: '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Account Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1 }}>
                  {report.reportSummary.totalAccounts}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Accounts
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'medium' }}>
                    {report.reportSummary.activeAccounts}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Active
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'medium' }}>
                    {report.reportSummary.closedAccounts}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Closed
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                backgroundColor: '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Balance Overview
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 1 }}>
                  ₹{formatCurrency(report.reportSummary.currentBalanceAmount)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Balance
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'medium' }}>
                    ₹{formatCurrency(report.reportSummary.securedAccountsAmount)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Secured
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" sx={{ color: '#ed6c02', fontWeight: 'medium' }}>
                    ₹{formatCurrency(report.reportSummary.unsecuredAccountsAmount)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Unsecured
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                backgroundColor: '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ color: '#673ab7', fontWeight: 'bold', mb: 1 }}>
                  {report.reportSummary.lastSevenDaysCreditEnquiries}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Credit Enquiries (Last 7 Days)
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Last Updated: {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Credit Accounts */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          borderLeft: '4px solid #673ab7'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#673ab7',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 3
          }}
        >
          <CreditCardIcon /> Credit Accounts
        </Typography>
        <Grid container spacing={3}>
          {report.creditAccounts.map((account, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                elevation={2}
                sx={{ 
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalanceIcon sx={{ color: '#673ab7', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      {account.bank}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography color="textSecondary" variant="caption">Card Number</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {account.creditCardNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography color="textSecondary" variant="caption">Account Number</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {account.accountNumber}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 1.5, 
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography color="textSecondary" variant="caption">Current Balance</Typography>
                          <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                            ₹{formatCurrency(account.currentBalance)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary" variant="caption">Amount Overdue</Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: account.amountOverdue > 0 ? '#d32f2f' : '#2e7d32',
                              fontWeight: 'bold'
                            }}
                          >
                            ₹{formatCurrency(account.amountOverdue)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>

                  <Typography color="textSecondary" variant="caption">Address</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {account.address.street}, {account.address.city},{' '}
                    {account.address.state} - {account.address.pincode}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ReportDetail;