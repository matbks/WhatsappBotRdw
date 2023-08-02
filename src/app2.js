const express = require('express');
const samlify = require('samlify');
const axios = require('axios');
const querystring = require('querystring');

const app = express();

// SP (Service Provider) configuration
const sp = samlify.ServiceProvider({
  entityID: 'saml-poc',
  authnRequestsSigned: false,
  wantAssertionsSigned: true,
  privateKey: '<Your SP Private Key>', // Replace with your actual SP private key
  privateKeyPass: 'password', // Replace with your actual password
  assertionConsumerService: [
    {
      Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
      Location: 'http://localhost:7000/acs'
    }
  ],
  singleLogoutService: [
    {
      Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      Location: 'http://localhost:7000/slo'
    }
  ],
});

// IdP (Identity Provider) configuration
const idp = samlify.IdentityProvider({
  metadata: '<Your IdP Metadata XML>', // Replace with your actual IdP metadata XML
  wantAuthnRequestsSigned: true,
  wantLogoutResponseSigned: true,
  wantLogoutRequestSigned: true,
});

// Set up Express routes
app.get('/login', async (req, res) => {
  try {
    const { context } = await sp.createLoginRequest(idp, 'redirect');
    return res.redirect(context);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

app.post('/acs', async (req, res) => {
  try {
    const { extract } = await sp.parseLoginResponse(idp, 'post', req);
    // Perform additional actions after successful login
    return res.send('Login successful!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

app.post('/slo', async (req, res) => {
  try {
    await sp.parseLogoutRequest(idp, 'post', req);
    // Perform additional actions after successful logout
    return res.send('Logout successful!');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(7000, () => console.log('Server started on port 7000'));
