
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'RdwMessage') {
    console.log('Webhook validated');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);          
  }  
});

app.post('/webhook', async (req, res) => {
  const message = req.body.messages[0];

  if (message.fromMe) {
    // Ignore messages sent by the bot
    return res.status(200).send('Message received!');
  }

  // Your logic here
  // For example, if the message body is '1', send a response
  if (message.body === '1') {
    const response = await axios.post('https://your-whatsapp-business-api-client-instance/v1/messages', {
      recipient_type: 'individual',
      to: message.from,
      type: 'text',
      text: {
        body: 'You selected option 1.',
      },
    });
  }

  res.status(200).send('Message received!');
});

app.listen(3002, () => {
  console.log('WhatsApp Bot is listening to port 3002');
});


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
