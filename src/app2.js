const express = require('express');
const axios = require('axios');
const qs = require('querystring');

const app = express();

const oauthConfig = {
  tokenUrl: 'http://vsapdev.tipler.com.br:8000/sap/bc/sec/oauth2/token', // Replace with the correct URL
  authorizeUrl: 'http://vsapdev.tipler.com.br:8000/sap/bc/sec/oauth2/authorize', // Replace with the correct URL
  client_id: 'ODATA_RED', // Replace with your client id
  client_secret: '', // Replace with your client secret
  grant_type: 'authorization_code',
  username: 'REDWARE_ABAP',
  password: 'Redware@2024',
  redirect_uri: 'http://localhost:3003/callback' // Replace with your redirect URI
};

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post(oauthConfig.tokenUrl, qs.stringify({
      ...oauthConfig,
      code,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // API endpoint of the service you want to query
    const apiUrl = 'http://vsapdev.tipler.com.br:8000/sap/opu/odata/sap/ZTESTE_SRV/ZiItemBatchSet';

    // Make the authenticated API request using axios
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

const port = 3003;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});


// const express = require('express');
// const axios = require('axios');
// const qs = require('querystring');

// const app = express();

// const oauthConfig = {
//   tokenUrl: 'http://vsapdev.tipler.com.br:8000/sap/bc/sec/oauth2/token', // Replace with the correct URL
//   authorizeUrl: 'http://vsapdev.tipler.com.br:8000/sap/bc/sec/oauth2/authorize', // Replace with the correct URL
//   client_id: 'YOUR_CLIENT_ID', // Replace with your client id
//   client_secret: 'YOUR_CLIENT_SECRET', // Replace with your client secret
//   grant_type: 'password',
//   username: 'REDWARE_ABAP',
//   password: 'Redware@2024'
// };

// app.get('/queryService', async (req, res) => {
//   try {
//     // Get the OAuth2 token
//     const tokenResponse = await axios.post(oauthConfig.tokenUrl, qs.stringify(oauthConfig), {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     });

//     const accessToken = tokenResponse.data.access_token;

//     // API endpoint of the service you want to query
//     const apiUrl = 'http://vsapdev.tipler.com.br:8000/sap/opu/odata/sap/ZTESTE_SRV/ZiItemBatchSet';

//     // Make the authenticated API request using axios
//     const response = await axios.get(apiUrl, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     // Extract and return the data from the response
//     const data = response.data;
//     res.json(data);
//   } catch (error) {
//     console.error('Error querying the service:', error);
//     res.status(500).send('Error querying the service');
//   }
// });

// const port = 3003;
// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });
