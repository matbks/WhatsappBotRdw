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

const samlStrategy = new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100&sap-language=PT',
    issuer: 'passport-saml',
    cert: primaryCert, // Use the primary certificate here
  },
  function (profile, done) {
    // In this function, you can access the user profile information contained in the SAML assertion.
    // You would typically use this to look up the user in your database and create a user session.
    // For now, we'll just call done immediately with the user profile.
    return done(null, profile);
  }
);

passport.use(samlStrategy);

const app = express();

// Initialize passport and use the SamlStrategy
app.use(passport.initialize());

// Use the `samlStrategy.generateServiceProviderMetadata()` function to generate the SP metadata.
const serviceProviderMetadata = samlStrategy.generateServiceProviderMetadata();

console.log('ServiceProviderMetadata:');
console.log(serviceProviderMetadata);

// You can use the `serviceProviderMetadata` to configure your SAML identity provider (IdP).

// Endpoint to initiate SAML authentication
app.get('/login', passport.authenticate('saml', { session: false }), (req, res) => {
  // This route will redirect the user to the AuthnRequest URL for SAML authentication
  // Once authenticated, the user will be redirected back to the callback URL.
  // Add any additional logic here if needed.
});

// Callback endpoint to handle SAML response
app.post('/login/callback', passport.authenticate('saml', { session: false }), (req, res) => {
  // This route will be called after successful SAML authentication.
  // You can access the SAML response in req.body.SAMLResponse.

  // Extract the SAML assertion from the SAML response
  const samlAssertion = req.body.SAMLResponse;

  // Use the SAML assertion to authenticate your API request
  // Replace 'YOUR_USERNAME' and 'YOUR_PASSWORD' with the actual username and password for authentication
  const username = 'ABAP_REDWARE';
  const password = 'Redware@2024';

  // Create a base64-encoded string of the username and password for Basic Authentication
  const authString = Buffer.from(`${username}:${password}`).toString('base64');

  // API endpoint of the service you want to query
  const apiUrl = 'https://vsapdev.tipler.com.br:8000/sap/opu/odata/sap/ZTESTE_SRV/?$format=xml';

  // Make the authenticated API request using axios with the SAML assertion in the Authorization header
  axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${samlAssertion}`,
      },
    })
    .then((response) => {
      // Handle the response from the service
      const data = response.data;
      res.json(data);
    })
    .catch((error) => {
      console.error('Error querying the service:', error);
      res.status(500).send('Error querying the service');
    });
});

// Start the server
const port = 3002;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
