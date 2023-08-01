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

// const saml = require('passport-saml');
// const axios = require('axios');

// const primaryCert = `-----BEGIN CERTIFICATE-----
// MIICbzCCAdgCByAVCSMZIQEwDQYJKoZIhvcNAQEFBQAwfTELMAkGA1UEBhMCREUx 
// HDAaBgNVBAoTE1NBUCBUcnVzdCBDb21tdW5pdHkxEzARBgNVBAsTClNBUCBXZWIg
// QVMxFDASBgNVBAsTC0kwMDIwNzgxMTc1MSUwIwYDVQQDExxERTEgU2lzdC5TU0wg
// Y2xpZW50IFN0YW5kYXJkMB4XDTE1MDkyMzE5MjEwMVoXDTM4MDEwMTAwMDAwMVow
// fTELMAkGA1UEBhMCREUxHDAaBgNVBAoTE1NBUCBUcnVzdCBDb21tdW5pdHkxEzAR
// BgNVBAsTClNBUCBXZWIgQVMxFDASBgNVBAsTC0kwMDIwNzgxMTc1MSUwIwYDVQQD
// ExxERTEgU2lzdC5TU0wgY2xpZW50IFN0YW5kYXJkMIGfMA0GCSqGSIb3DQEBAQUA
// A4GNADCBiQKBgQCqXd6BdcEJX9I4SyKlp4+BKKhRPBwaDYp3H5bLXlX4ZlG32Ld6
// vOZvtCawLQdngOLfKdXdKmyL0qtGVexWJvEkzSmw/3avkXBKFNyB6EOuKM5FEPhy
// iDJwFLiNq6LF5Dud06wNjDJfzLsuiv2TZ5zzbfNkOZr6QQVfXr8LkSYXNwIDAQAB
// MA0GCSqGSIb3DQEBBQUAA4GBACKoYL1H2+zJrYZOp5FCDGybYWC9ajkivsDrSPVf
// cXEhp1DM6whTJcup/JgvbAvMdtQajSxTQOxNvmSMDO9iUpXirQQN3wJ/wzTsLFRk
// Bii1qJlza6nlTOipV0RNcxZlVGgXiIY8taBHz5ljbN0iKzQgPgHMvV60DiImuz5Y
// Z7vK
// -----END CERTIFICATE-----`;

// const samlStrategy = new saml.Strategy({
//   path: '/login/callback',
//   entryPoint: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100&sap-language=PT',
//   issuer: 'passport-saml',
//   cert: primaryCert // Use the primary certificate here
// },
// function(profile, done) {
//   // In this function, you can access the user profile information contained in the SAML assertion.
//   // You would typically use this to look up the user in your database and create a user session.
//   // For now, we'll just call done immediately with the user profile.
//   return done(null, profile);
// });

// // Use the `samlStrategy.generateServiceProviderMetadata()` function to generate the SP metadata.
// const serviceProviderMetadata = samlStrategy.generateServiceProviderMetadata();

// console.log('ServiceProviderMetadata:');
// console.log(serviceProviderMetadata);

// You can use the `serviceProviderMetadata` to configure your SAML identity provider (IdP).

// Once you have configured the IdP and the SAML response is received, you can extract the assertion
// and use it in your API request as before.

// const saml = require('passport-saml');
// const axios = require('axios');

// // Replace this with the actual certificate string in PEM format
// const primaryCert = `-----BEGIN CERTIFICATE-----
// MIICbzCCAdgCByAVCSMZIQEwDQYJKoZIhvcNAQEFBQAwfTELMAkGA1UEBhMCREUx
// HDAaBgNVBAoTE1NBUCBUcnVzdCBDb21tdW5pdHkxEzARBgNVBAsTClNBUCBXZWIg
// QVMxFDASBgNVBAsTC0kwMDIwNzgxMTc1MSUwIwYDVQQDExxERTEgU2lzdC5TU0wg
// Y2xpZW50IFN0YW5kYXJkMB4XDTE1MDkyMzE5MjEwMVoXDTM4MDEwMTAwMDAwMVow
// fTELMAkGA1UEBhMCREUxHDAaBgNVBAoTE1NBUCBUcnVzdCBDb21tdW5pdHkxEzAR
// BgNVBAsTClNBUCBXZWIgQVMxFDASBgNVBAsTC0kwMDIwNzgxMTc1MSUwIwYDVQQD
// ExxERTEgU2lzdC5TU0wgY2xpZW50IFN0YW5kYXJkMIGfMA0GCSqGSIb3DQEBAQUA
// A4GNADCBiQKBgQCqXd6BdcEJX9I4SyKlp4+BKKhRPBwaDYp3H5bLXlX4ZlG32Ld6
// vOZvtCawLQdngOLfKdXdKmyL0qtGVexWJvEkzSmw/3avkXBKFNyB6EOuKM5FEPhy
// iDJwFLiNq6LF5Dud06wNjDJfzLsuiv2TZ5zzbfNkOZr6QQVfXr8LkSYXNwIDAQAB
// MA0GCSqGSIb3DQEBBQUAA4GBACKoYL1H2+zJrYZOp5FCDGybYWC9ajkivsDrSPVf
// cXEhp1DM6whTJcup/JgvbAvMdtQajSxTQOxNvmSMDO9iUpXirQQN3wJ/wzTsLFRk
// Bii1qJlza6nlTOipV0RNcxZlVGgXiIY8taBHz5ljbN0iKzQgPgHMvV60DiImuz5Y
// Z7vK
// -----END CERTIFICATE-----`;
// const saml = require('passport-saml');
// const axios = require('axios');

// const primaryCert = `-----BEGIN CERTIFICATE-----
// MIICbzCCAdgCByAVCSMZIQEwDQYJKoZIhvcNAQEFBQAwfTELMAkGA1UEBhMCREUx 
// HDAaBgNVBAoTE1NBUCBUcnVzdCBDb21tdW5pdHkxEzARBgNVBAsTClNBUCBXZWIg
// QVMxFDASBgNVBAsTC0kwMDIwNzgxMTc1MSUwIwYDVQQDExxERTEgU2lzdC5TU0wg
// Y2xpZW50IFN0YW5kYXJkMB4XDTE1MDkyMzE5MjEwMVoXDTM4MDEwMTAwMDAwMVow
// fTELMAkGA1UEBhMCREUxHDAaBgNVBAoTE1NBUCBUcnVzdCBDb21tdW5pdHkxEzAR
// BgNVBAsTClNBUCBXZWIgQVMxFDASBgNVBAsTC0kwMDIwNzgxMTc1MSUwIwYDVQQD
// ExxERTEgU2lzdC5TU0wgY2xpZW50IFN0YW5kYXJkMIGfMA0GCSqGSIb3DQEBAQUA
// A4GNADCBiQKBgQCqXd6BdcEJX9I4SyKlp4+BKKhRPBwaDYp3H5bLXlX4ZlG32Ld6
// vOZvtCawLQdngOLfKdXdKmyL0qtGVexWJvEkzSmw/3avkXBKFNyB6EOuKM5FEPhy
// iDJwFLiNq6LF5Dud06wNjDJfzLsuiv2TZ5zzbfNkOZr6QQVfXr8LkSYXNwIDAQAB
// MA0GCSqGSIb3DQEBBQUAA4GBACKoYL1H2+zJrYZOp5FCDGybYWC9ajkivsDrSPVf
// cXEhp1DM6whTJcup/JgvbAvMdtQajSxTQOxNvmSMDO9iUpXirQQN3wJ/wzTsLFRk
// Bii1qJlza6nlTOipV0RNcxZlVGgXiIY8taBHz5ljbN0iKzQgPgHMvV60DiImuz5Y
// Z7vK
// -----END CERTIFICATE-----`;

// const samlStrategy = new saml.Strategy({
//   path: '/login/callback',
//   entryPoint: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100&sap-language=PT',
//   issuer: 'passport-saml',
//   cert: primaryCert // Use the primary certificate here
// },
// function(profile, done) {
//   // In this function, you can access the user profile information contained in the SAML assertion.
//   // You would typically use this to look up the user in your database and create a user session.
//   // For now, we'll just call done immediately with the user profile.
//   return done(null, profile);
// });

// const samlRequestUrl = samlStrategy.getAuthorizeUrl();
// console.log('SAML Request URL:', samlRequestUrl);

// Use the samlRequestUrl to initiate the SAML request with your IdP
// Once the SAML response is received, you can proceed with your API request
// with the assertion obtained from the SAML response.
// The specific implementation of the SAML request handling will depend on your IdP.

// Once you receive the SAML response and extract the assertion,
// you can use it in the API request as before.




// const axios = require('axios');
// const https = require('https');
// const qs = require('qs');

// const agent = new https.Agent({  
//   rejectUnauthorized: false
// });

// const username = 'REDWARE_ABAP';
// const password = 'Redware@2024';

// axios({
//   method: 'post',
//   url: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100&sap-language=PT',
//   headers: {
//     'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
//     'Content-Type': 'application/x-www-form-urlencoded'
//   },
//   httpsAgent: agent,
//   data: qs.stringify({
//     grant_type: 'password',
//     username: username,
//     password: password
//   })
// })
// .then(response => {
//   console.log(response.data);
// })
// .catch(error => {
//   console.error(error);
// });



/////////////////////////////////////////// grrrrr

// const axios = require('axios');
// const https = require('https');

// const agent = new https.Agent({  
//   rejectUnauthorized: false
// });

// axios.post('https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100&sap-language=PT', {
//   grant_type: 'password',
//   username: 'REDWARE_ABAP',
//   password: 'Redware@2024'
// }, { 
//   httpsAgent: agent,
// })
// .then(response => {
//   console.log(response.data);
// })
// .catch(error => {
//   console.error(error);
// });
 
// const axios = require('axios');
// const https = require('https');

// const agent = new https.Agent({  
//   rejectUnauthorized: false
// });

// axios.post('https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100&sap-language=PT', {}, { 
//   httpsAgent: agent,
//   auth: { 
//     username: 'REDWARE_ABAP',
//     password: 'Redware@2024'
//   }
// })
// .then(response => {
//   console.log(response.data);
// })
// .catch(error => {
//   console.error(error);
// });


// const axios = require('axios');
// const qs = require('qs');

// async function getAccessToken() {
//   // const tokenUrl = 'http://vsapdev.tipler.com.br:8000/sap/bc/sec/oauth2/token'; // Replace with your token endpoint
//   const tokenUrl = 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100&sap-language=PT'; // Replace with your token endpoint
//   const clientId = 'ODATA_RED'; // Replace with your client ID
//   const username = 'REDWARE_ABAP'; // Replace with the resource owner's username
//   const password = 'Redware@2024'; // Replace with the resource owner's password

//   const data = qs.stringify({
//     grant_type: 'password',
//     username: username,
//     password: password,
//     client_id: clientId
//   });

//   const headers = {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   };

//   try {
//     const response = await axios.post(tokenUrl, data, { headers });
//     console.log(response.data.access_token); // Moved this line inside the try block
//     return response.data.access_token;
//   } catch (error) {
//     console.error('Error obtaining access token', error);
//     return null;
//   }
// }

// getAccessToken();


// const axios = require('axios');
// const qs = require('qs');
// const express = require('express');
// const app = express();

// const clientId = 'ODATA_RED';
// const clientSecret = ''; // If you don't have a client secret, just leave it as an empty string
// const authorizationEndpoint = 'http://vsapdev.tipler.com.br:8000/sap/bc/sec/oauth2/authorize';
// const tokenEndpoint = 'http://vsapdev.tipler.com.br:8000/sap/bc/sec/oauth2/token';
// const redirectUri = 'http://localhost:3000/callback'; // Replace with your redirect URI

// app.get('/authorize', (req, res) => {
//   res.redirect(`${authorizationEndpoint}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`);
// });

// app.get('/callback', async (req, res) => {
//   const code = req.query.code;

//   const data = qs.stringify({
//     grant_type: 'authorization_code',
//     client_id: clientId,
//     client_secret: clientSecret,
//     redirect_uri: redirectUri,
//     code: code
//   });

//   const headers = {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   };

//   try {
//     const response = await axios.post(tokenEndpoint, data, { headers });
//     console.log(response.data.access_token);
//     res.send('Access token obtained: ' + response.data.access_token);
//   } catch (error) {
//     console.error('Error obtaining access token', error);
//     res.status(500).send('Error obtaining access token');
//   }
// });

// app.listen(3000, () => {
//   console.log('App listening on port 3000');
// });



// const axios = require('axios');
// const qs = require('qs');

// async function getAccessToken() {
//   const tokenUrl = 'http://vsapdev.tipler.com.br:8000/sap/bc/sec/oauth2/token'; // Replace with your token endpoint
//   const clientId = 'REDWARE_ABAP'; // Replace with your client ID
//   const clientSecret = 'Redware@2024'; // Replace with your client secret
//   // const authorizationGrant = 'your-authorization-grant'; // Replace with your authorization grant

//   const auth = {
//     username: clientId,
//     password: clientSecret
//   };

//   const data = qs.stringify({
//     grant_type: 'authorization_code', // Or 'client_credentials' or other grant type depending on your OAuth 2.0 flow
//     code: authorizationGrant // Not needed for 'client_credentials' grant type
//   });

//   const headers = {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   };

//   try {
//     const response = await axios.post(tokenUrl, data, { auth, headers });
//     return response.data.access_token;
//   } catch (error) {
//     console.error('Error obtaining access token', error);
//     return null;
//   }
// }

// // Add this at the top of your file
// const qs = require('qs');

// // Add this function to your code
// async function getAccessToken() {
//   const tokenUrl = 'https://your-sap-service.com/oauth/token'; // Replace with your token endpoint
//   const clientId = 'REDWARE_ABAP'; // Replace with your client ID
//   const clientSecret = 'Redware@2024'; // Replace with your client secret

//   const auth = {
//     username: clientId,
//     password: clientSecret
//   };

//   const data = qs.stringify({
//     grant_type: 'client_credentials'
//   });

//   const headers = {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   };

//   try {
//     const response = await axios.post(tokenUrl, data, { auth, headers });
//     return response.data.access_token;
//   } catch (error) {
//     console.error('Error obtaining access token', error);
//     return null;
//   }
// }

// // Then, in your webhook POST handler, you can use this function to get an access token
// app.post('/webhook', async (req, res) => {
//   // ... existing code ...

//   // Get an access token
//   const accessToken = await getAccessToken();

//   // Use the access token in your API requests
//   // For example:
//   const response = await axios.post('https://bot.redware.io/message', {
//     recipient_type: 'individual',
//     to: message.from,
//     type: 'text',
//     text: {
//       body: 'You selected option 1.',
//     },
//   }, {
//     headers: {
//       'Authorization': `Bearer ${accessToken}`
//     }
//   });

//   // ... existing code ...
// });

// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const passport = require('passport');
// const SamlStrategy = require('passport-saml').Strategy;

// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(passport.initialize());

// passport.use(new SamlStrategy(
//   {
//     path: '/login/callback',
//     entryPoint: 'https://your-idp.com/entry-point',
//     issuer: 'issuer',
//     // Certificado e chave privada para assinatura
//     // cert: fs.readFileSync('./cert.pem', 'utf-8'),
//     // privateCert: fs.readFileSync('./key.pem', 'utf-8'),
//   },
//   function(profile, done) {
//     // Aqui você pode verificar o perfil SAML e decidir se o usuário está autenticado ou não
//     return done(null, profile);
//   })
// );

// app.post('/login/callback',
//   passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
//   function(req, res) {
//     res.redirect('/');
//   }
// );

// // O restante do seu código vai aqui

// app.listen(3002, () => {
//   console.log('WhatsApp Bot is listening to port 3002');
// });


// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.get('/webhook', (req, res) => {
//   if (req.query['hub.mode'] === 'subscribe' &&
//       req.query['hub.verify_token'] === 'RdwMessage') {
//     console.log('Webhook validated');
//     res.status(200).send(req.query['hub.challenge']);
//   } else {
//     console.error('Failed validation. Make sure the validation tokens match.');
//     res.sendStatus(403);          
//   }  
// });

// app.post('/webhook', async (req, res) => {

//   if (req.body){

//   const message = req.body.messages[0];

//   if (message.fromMe) {
//     // Ignore messages sent by the bot
//     return res.status(200).send('Message received!');
//   }

//   // Your logic here
//   // For example, if the message body is '1', send a response
//   if (message.body === '1') {
//     const response = await axios.post('https://bot.redware.io/message', {
//       recipient_type: 'individual',
//       to: message.from,
//       type: 'text',
//       text: {
//         body: 'You selected option 1.',
//       },
//     });
//   }
// }

//   res.status(200).send('Message received!');
// });

// app.listen(3002, () => {
//   console.log('WhatsApp Bot is listening to port 3002');
// });


// webhook meta
// const express = require('express');
// const bodyParser = require('body-parser');
// const crypto = require('crypto');
// const app = express();

// app.use(bodyParser.json({
//   verify: (req, res, buf) => {
//     req.rawBody = buf;
//   }
// }));

// app.get('/webhook', (req, res) => {
//   if (req.query['hub.mode'] === 'subscribe' &&
//       req.query['hub.verify_token'] === 'RdwMessage') {
//     console.log('Webhook validated');
//     res.status(200).send(req.query['hub.challenge']);
//   } else {
//     console.error('Failed validation. Make sure the validation tokens match.');
//     res.sendStatus(403);          
//   }  
// });

// app.post('/webhook', (req, res) => {
//   var data = req.body;
//   if (data.object === 'page') {
//     data.entry.forEach((entry) => {
//       var pageID = entry.id;
//       var timeOfEvent = entry.time;
//       entry.messaging.forEach((event) => {
//         if (event.message) {
//           receivedMessage(event);
//         } else {
//           console.log('Webhook received unknown event: ', event);
//         }
//       });
//     });
//     res.sendStatus(200);
//   }
// });

// function receivedMessage(event) {
//   // Handle your message here
//   console.log('Message data: ', event.message);
// }

// app.listen(3002, () => console.log('Webhook server is listening, port 3002'));


// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.post('/register', async (req, res) => {
//   const phoneNumber = validNumber(req.body.number);

//   if (phoneNumber) {
//     try {
//       const response = await axios.post('https://your-whatsapp-business-api-client-instance/v1/messages', {
//         recipient_type: 'individual',
//         to: phoneNumber,
//         type: 'text',
//         text: {
//           body: 'Please select an option:\n1. Create Material\n2. Other option',
//         },
//       });

//       res.status(200).send('Message sent!');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       res.status(500).send('Error sending message');
//     }
//   } else {
//     console.log('Falha no registro');
//     res.status(400).send('Invalid phone number');
//   }
// });

// app.post('/webhook', async (req, res) => {
//   const message = req.body.messages[0];

//   if (message.fromMe) {
//     // Ignore messages sent by the bot
//     return res.status(200).send('Message received!');
//   }

//   if (message.body === '1') {
//     // The user selected "Create Material", so ask for the material details
//     const response = await axios.post('https://your-whatsapp-business-api-client-instance/v1/messages', {
//       recipient_type: 'individual',
//       to: message.from,
//       type: 'text',
//       text: {
//         body: 'Please enter the material number, description, and type, separated by commas.',
//       },
//     });
//   } else if (message.body === '2') {
//     // Handle the other option
//   } else {
//     // The user's response didn't match any of the options, so ask them to try again
//     const response = await axios.post('https://your-whatsapp-business-api-client-instance/v1/messages', {
//       recipient_type: 'individual',
//       to: message.from,
//       type: 'text',
//       text: {
//         body: 'Invalid option. Please try again.',
//       },
//     });
//   }

//   res.status(200).send('Message received!');
// });

// app.listen(3002, () => {
//   console.log('WhatsApp Bot is listening to port 3002');
// });

// function validNumber(phoneNumber) {
//   // Your phone number validation logic here
// }

// app.post('/webhook', async (req, res) => {
//   const message = req.body.messages[0];

//   if (message.fromMe) {
//     // Ignore messages sent by the bot
//     return res.status(200).send('Message received!');
//   }

//   if (message.body.includes(',')) {
//     // The user entered the material details, so parse the details and call the SAP service
//     const [materialNumber, description, type] = message.body.split(',');

//     // Call the SAP service with the material details
//     // For example:
//     // const response = await callSapService(materialNumber, description, type);

//     // Then send a message to the user confirming that the material was created
//     const response = await axios.post('https://your-whatsapp-business-api-client-instance/v1/messages', {
//       recipient_type: 'individual',
//       to: message.from,
//       type: 'text',
//       text: {
//         body: 'Material created successfully!',
//       },
//     });
//   } else {
//     // The user's response didn't match the expected format, so ask them to try again
//     const response = await axios.post('https://your-whatsapp-business-api-client-instance/v1/messages', {
//       recipient_type: 'individual',
//       to: message.from,
//       type: 'text',
//       text: {
//         body: 'Invalid format. Please enter the material number, description, and type, separated by commas.',
//       },
//     });
//   }

//   res.status(200).send('Message received!');
// });



// const phone = require("libphonenumber-js");
// const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode-terminal");
// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();
// const dotenv = require("dotenv");
// const path = require("path");
// const fs = require("fs");

// dotenv.config();

// const SESSION_FILE_PATH = path.join(__dirname, "tokens", "session.json");

// let sessionData;
// if (fs.existsSync(SESSION_FILE_PATH)) {
//   sessionData = require(SESSION_FILE_PATH);
// } else {
//   sessionData = {};
// }

// const client = new Client({
//   puppeteer: {
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   },
//   session: sessionData,
//   authStrategy: new LocalAuth(),
// });

// client.on("qr", (qr) => {
//   qrcode.generate(qr, { small: true });
// });

// client.on("ready", () => {
//   console.log("Client is ready!");

//   if (client.session) {
//     fs.writeFile(SESSION_FILE_PATH, JSON.stringify(client.session), (err) => {
//       if (err) {
//         console.error("Error saving session data:", err);
//       }
//     });
//   }
// });

// client.on("message", (message) => {
//   // if (message.body === "Oi") {
//   //   message.reply(`Please stop bothering me`);
//   // }
// });

// client.initialize();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Header",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Headers", "Content-Type");

//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).send({});
//   }

//   next();
// });

// app.post("/register", (req, res) => {
//   console.log(req.body.number);
//   var correctNumber = validNumber(req.body.number);
//   console.log(correctNumber);
//   if (correctNumber) {
//     client.sendMessage(
//       correctNumber,
//       "Obrigado! Seu ponto foi registrado agora " +
//         today() +
//         " às " +
//         now() +
//         "."
//     );
//   } else {
//     console.log("Falha no registro");
//   }
//   res.status(200).send("Message received!");
// });

// app.listen(3002, () => {
//   console.log("Redware WhatsApp Bot is listening to port 3002");
// });

// function today() {
//   var date = new Date();

//   const map = {
//     mm: date.getMonth() + 1,
//     dd: date.getDate(),
//     aa: date.getFullYear().toString().slice(-2),
//     aaaa: date.getFullYear(),
//   };
//   var format = "dd/mm/aa";

//   return format.replace(/mm|dd|aa|aaaa/gi, (matched) => map[matched]);
// }

// function now() {
//   var date = new Date();
//   var options = { timeZone: "America/Sao_Paulo", hour12: false };
//   var time = date.toLocaleString("pt-BR", options).split(" ")[1];
//   return time;
// }

// function validNumber(phoneNumber) {
//   phoneNumber =
//     phone
//       .parsePhoneNumber(phoneNumber, "BR")
//       ?.format("E.164")
//       ?.replace("+", "")
//       ?.replace("-", "") || "";

//   phoneNumber = phoneNumber.includes("55") ? phoneNumber : `55${phoneNumber}`;

//   if (!phoneNumber.length < 13) {
//     phoneNumber = phoneNumber.slice(0, 4) + phoneNumber.slice(5);
//   }

//   phoneNumber = phoneNumber.includes("@c.us")
//     ? phoneNumber
//     : `${phoneNumber}@c.us`;

//   if (phoneNumber.length == 17) {
//     console.info("Número válido ");
//     console.info(phoneNumber);
//   } else {
//     console.info("Número inválido");
//     console.info(phoneNumber);
//     phoneNumber = "";
//   }

//   return phoneNumber;
// }
