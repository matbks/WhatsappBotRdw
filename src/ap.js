const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const session = require('express-session'); // Add this line
const app = express();

app.use(session({ secret: 'your secret here', resave: false, saveUninitialized: false })); // Add this line

const oauth2Strategy = new OAuth2Strategy({
  authorizationURL: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/authorize?sap-client=100',
  tokenURL: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100',
  clientID: 'ODATA_RED', // Replace with your client ID
  // clientSecret: 'YOUR_CLIENT_SECRET', // Replace with your client secret
  scope: 'ZTESTE_SRV_0001',
  callbackURL: 'https://bot.redware.io/auth/callback',
  state: true
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);
  // ... Logic to process the user profile ...
  return cb(null, profile);
});

// Use the OAuth2 strategy with the Passport middleware
passport.use(oauth2Strategy);

// Configure the /auth/callback route to authenticate using Passport
app.get('/auth/callback',
  passport.authenticate('oauth2', { session: false }),
  function(req, res) {
    // Authentication was successful and the user profile is available in req.user
    // Do whatever is necessary with the user data and redirect to the appropriate page
    res.send('OAuth2 authentication successful!');
  }
);

// /auth route that starts the OAuth2 authentication process
app.get('/auth',
  passport.authenticate('oauth2', { session: false })
);

// Initialize the Passport middleware and start the server
app.use(passport.initialize());
app.listen(3002, () => {
  console.log('Server started on port 3002');
});


// const express = require('express');
// const passport = require('passport');
// const OAuth2Strategy = require('passport-oauth2');
// const app = express();

// const oauth2Strategy = new OAuth2Strategy({
//   authorizationURL: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/authorize?sap-client=100',
//   tokenURL: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100',
//   clientID: 'ODATA_RED', // Replace with your client ID
//   // clientSecret: 'YOUR_CLIENT_SECRET', // Replace with your client secret
//   scope: 'ZTESTE_SRV_0001',
//   callbackURL: 'https://bot.redware.io/auth/callback',
//   state: true
// },
// function(accessToken, refreshToken, profile, cb) {
//   console.log(profile);
//   // ... Logic to process the user profile ...
//   return cb(null, profile);
// });

// // Use the OAuth2 strategy with the Passport middleware
// passport.use(oauth2Strategy);

// // Configure the /auth/callback route to authenticate using Passport
// app.get('/auth/callback',
//   passport.authenticate('oauth2', { session: false }),
//   function(req, res) {
//     // Authentication was successful and the user profile is available in req.user
//     // Do whatever is necessary with the user data and redirect to the appropriate page
//     res.send('OAuth2 authentication successful!');
//   }
// );

// // /auth route that starts the OAuth2 authentication process
// app.get('/auth',
//   passport.authenticate('oauth2', { session: false })
// );

// // Initialize the Passport middleware and start the server
// app.use(passport.initialize());
// app.listen(3002, () => {
//   console.log('Server started on port 3002');
// });
 
