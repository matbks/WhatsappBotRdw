
const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const app = express();

const oauth2Strategy = new OAuth2Strategy({
  authorizationURL: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/authorize?sap-client=100',
  tokenURL: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100',
  clientID: 'ODATA_RED', // Replace with your client ID
  // clientSecret: 'YOUR_CLIENT_SECRET', // Replace with your client secret
  scope: 'ZTESTE_SRV_0001',
  callbackURL: 'http://localhost:3002/auth/callback'
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
// const saml = require('passport-saml');
// const app = express();

// // Configuração da estratégia SAML
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
//   issuer: 'RdwServiceProvider',
//   cert: primaryCert,
//   authnContext: ['urn:oasis:names:tc:SAML:2.0:ac:classes:Password'],
//   protocol: 'https://', // Specify the protocol
//   callbackUrl: 'http://localhost:3000/login/callback', // Full callbackUrl
//   acceptedClockSkewMs: -1, // Accept any clock skew
//   validateInResponseTo: true, // Validate InResponseTo
//   requestIdExpirationPeriodMs: 60000, // Set expiration period to 1 minute
//   passReqToCallback: true // Pass req to the callback
// },
// function(req, profile, done) { // Now req is the first argument to the callback
//   console.log(profile);
//   return done(null, profile);
// });

// const samlStrategy = new saml.Strategy({
//   path: '/login/callback',
//   entryPoint: 'https://vsapdev.tipler.com.br:8043/sap/bc/sec/oauth2/token?sap-client=100&sap-language=PT',
//   issuer: 'RdwServiceProvider',
//   cert: primaryCert, // Use the primary certificate here
//   authnContext: ['urn:oasis:names:tc:SAML:2.0:ac:classes:Password'] // Specify the requested authentication context as an array
// },
// function(profile, done) {
//   console.log(profile);
//   // ... Lógica para processar o perfil do usuário ...
//   return done(null, profile);
// });

// Use a estratégia SAML com o middleware do Passport
// passport.use(samlStrategy);

// // Configure a rota /login/callback para autenticar usando o Passport
// app.post('/login/callback', // Use POST method here
//   passport.authenticate('saml', { session: false }),
//   function(req, res) {
//     // A autenticação foi bem-sucedida e o perfil do usuário está disponível em req.user
//     // Faça o que for necessário com os dados do usuário e redirecione para a página adequada
//     res.send('Autenticação SAML bem-sucedida!');
//   }
// );

// // Rota /login que inicia o processo de autenticação SAML
// app.post('/login', // Use POST method here
//   passport.authenticate('saml', { session: false })
// );

// // Inicialize o middleware do Passport e inicie o servidor
// app.use(passport.initialize());
// app.listen(3000, () => {
//   console.log('Servidor iniciado na porta 3000');
// });
