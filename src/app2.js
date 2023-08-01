const express = require('express');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const axios = require('axios');

const primaryCert = `-----BEGIN CERTIFICATE-----
MIICbzCCAdgCByAVCSMZIQEwDQYJKoZIhvcNAQEFBQAwfTELMAkGA1UEBhMCREUx 
HDAaBgNVBAoTE1NBUCBUcnVzdCBDb21tdW5pdHkxEzARBgNVBAsTClNBUCBXZWIg
QVMxFDASBgNVBAsTC0kwMDIwNzgxMTc1MSUwIwYDVQQDExxERTEgU2lzdC5TU0wg
Y2xpZW50IFN0YW5kYXJkMB4XDTE1MDkyMzE5MjEwMVoXDTM4MDEwMTAwMDAwMVow
fTELMAkGA1UEBhMCREUxHDAaBgNVBAoTE1NBUCBUcnVzdCBDb21tdW5pdHkxEzAR
BgNVBAsTClNBUCBXZWIgQVMxFDASBgNVBAsTC0kwMDIwNzgxMTc1MSUwIwYDVQQD
ExxERTEgU2lzdC5TU0wgY2xpZW50IFN0YW5kYXJkMIGfMA0GCSqGSIb3DQEBAQUA
A4GNADCBiQKBgQCqXd6BdcEJX9I4SyKlp4+BKKhRPBwaDYp3H5bLXlX4ZlG32Ld6
vOZvtCawLQdngOLfKdXdKmyL0qtGVexWJvEkzSmw/3avkXBKFNyB6EOuKM5FEPhy
iDJwFLiNq6LF5Dud06wNjDJfzLsuiv2TZ5zzbfNkOZr6QQVfXr8LkSYXNwIDAQAB
MA0GCSqGSIb3DQEBBQUAA4GBACKoYL1H2+zJrYZOp5FCDGybYWC9ajkivsDrSPVf
cXEhp1DM6whTJcup/JgvbAvMdtQajSxTQOxNvmSMDO9iUpXirQQN3wJ/wzTsLFRk
Bii1qJlza6nlTOipV0RNcxZlVGgXiIY8taBHz5ljbN0iKzQgPgHMvV60DiImuz5Y
Z7vK
-----END CERTIFICATE-----`;
// Your SAML configuration options (issuer, callbackUrl, entryPoint, cert, etc.)
const samlConfig = {
  // Replace these values with your actual SAML configuration
  entryPoint: 'http://localhost/login/callback',
  callbackUrl: 'http://localhost/saml/callback',
  issuer: 'passport-saml',
  cert: primaryCert,
  // Add other SAML configuration options here if needed
};

// Create a new SamlStrategy
const samlStrategy = new SamlStrategy(samlConfig, (profile, done) => {
  // This function will be called after successful authentication.
  // You can perform any necessary actions here, e.g., save the user profile to a database.
  // For now, let's just return the user profile.
  return done(null, profile);
});

// Initialize passport and use the SamlStrategy
passport.use(samlStrategy);

const app = express();

// Endpoint to initiate SAML authentication
app.get('/login', passport.authenticate('saml', { session: false }), (req, res) => {
  // This route will redirect the user to the AuthnRequest URL for SAML authentication
  // Once authenticated, the user will be redirected back to the callback URL.
  // Add any additional logic here if needed.
});

// Callback endpoint to handle SAML response
app.post('/saml/callback', passport.authenticate('saml', { session: false }), (req, res) => {
  // This route will be called after successful SAML authentication.
  // You can access the authenticated user's profile in req.user.
  // Add any additional logic here if needed.
  res.send('SAML Authentication Successful!'); // You can customize the response message here.
});

// API endpoint to query the service with proper authentication
app.get('/queryService', passport.authenticate('saml', { session: false }), async (req, res) => {
  try {
    // API endpoint of the service you want to query
    const apiUrl = 'http://vsapdev.tipler.com.br:8000/sap/opu/odata/sap/ZTESTE_SRV/ZiItemBatchSet';

    // Replace 'YOUR_USERNAME' and 'YOUR_PASSWORD' with the actual username and password for authentication
    const username = 'REDWARE_ABAP';
    const password = 'Redware@2024';

    // Create a base64-encoded string of the username and password for Basic Authentication
    const authString = Buffer.from(`${username}:${password}`).toString('base64');

    // Make the authenticated API request using axios
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Basic ${authString}`,
      },
    });

    // Extract and return the data from the response
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error('Error querying the service:', error);
    res.status(500).send('Error querying the service');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
