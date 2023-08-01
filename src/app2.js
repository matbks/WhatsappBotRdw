const express = require('express');
const axios = require('axios');
const qs = require('querystring');

const app = express();

const oauthConfig = {
  tokenUrl: 'https://vsapdev.tipler.com.br:8000/sap/bc/sec/oauth2/token', // Replace with the correct URL
  authorizeUrl: 'https://vsapdev.tipler.com.br:8000/sap/bc/sec/oauth2/authorize', // Replace with the correct URL
  client_id: 'ODATA_RED', // Replace with your client id
  redirect_uri: 'https://bot.redware.io/callback', // Replace with your redirect URI
  username: 'REDWARE_ABAP', // Replace with your SAP username
  password: 'Redware@2024' // Replace with your SAP password
};

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post(oauthConfig.tokenUrl, qs.stringify({
      ...oauthConfig,
      code,
      grant_type: 'authorization_code',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
        username: oauthConfig.username,
        password: oauthConfig.password
      }
    });

    console.log('Token response:', tokenResponse.data); // Log the token response

    const accessToken = tokenResponse.data.access_token;

    // You now have the access token and can use it to make authenticated requests
    // to the SAP service. For example:

    // const response = await axios.get('https://vsapdev.tipler.com.br:8000/sap/opu/odata/sap/ZTESTE_SRV/ZiItemBatchSet', {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });

    // const data = response.data;
    // res.json(data);

    res.json({ accessToken });
  } catch (error) {
    console.error('Error getting access token:', error);
    res.status(500).send('Error getting access token');
  }
});

const port = 3002;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
