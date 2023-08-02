const express = require('express');
const app = express();

app.get('/auth', (req, res) => {
  const authURL = `https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/authorize?sap-client=100&response_type=token&client_id=ODATA_RED&redirect_uri=https://bot.redware.io/auth/callback&scope=ZTESTE_SRV_0001&state=1599`;
  res.redirect(authURL);
});

app.get('/auth/callback', (req, res) => {
  const accessToken = req.query.access_token;
  const state = req.query.state;
  // Check if the state matches the one you sent in the /auth request
  // If the state values match, the request was made by your app
  // If not, the request could be a CSRF attack, do not process it
  // if (state === 'YOUR_STATE_VALUE') {
  if (state = 1599) {
    // The access token is available in the access_token query parameter
    // You can now use this access token to make authenticated requests to the resource server
    res.send(`OAuth2 authentication successful! Access token: ${accessToken}`);
  } else {
    res.send('Invalid state value. Possible CSRF attack, request not processed.');
  }
});

app.listen(3002, () => {
  console.log('Server started on port 3002');
});
