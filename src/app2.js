const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const session = require('express-session');
const app = express();

app.use(session({ secret: 'your secret here', resave: false, saveUninitialized: false }));

const oauth2Strategy = new OAuth2Strategy({
  authorizationURL: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/authorize?sap-client=100',
  tokenURL: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100',
  clientID: 'ODATA_RED',
  scope: 'ZTESTE_SRV_0001',
  callbackURL: 'https://bot.redware.io/auth/callback',
  state: true
},
function(accessToken, refreshToken, profile, cb) {
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  console.log('Profile:', profile);
  return cb(null, profile);
});

passport.use(oauth2Strategy);

app.get('/auth/callback',
  passport.authenticate('oauth2', { session: false }),
  function(req, res) {
    res.send('OAuth2 authentication successful!');
  }
);

app.get('/auth',
  passport.authenticate('oauth2', { session: false })
);

app.use(passport.initialize());
app.listen(3002, () => {
  console.log('Server started on port 3002');
});
