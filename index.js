const express = require('express')
require('dotenv').config()
const cors = require("cors");
const app = express()
const port = process.env.port

// email
const compression = require('compression');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const config = require('./config/email');
const { error } = require('console');
const ejs = require('ejs'); // Add this line
var ImageKit = require("imagekit");
// Enable Gzip compression
app.use(compression());
app.use(express.static(path.join(__dirname, '/dist/360-angular-web')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//qr code
const axios = require('axios');
app.use(express.json());

app.use(cors());
// for receive data from json raw postman
const bodyparser = require('body-parser')
app.use(bodyparser.json())

// call middleware
const MiddleAuth = require("./config/middleware")


app.post('/create-qr-code', MiddleAuth , async (req, res) => {
  try {
    const url = 'https://api.xendit.co/qr_codes';
    // console.log(process.env.pamulang)
    const username = "xnd_development_P4qDfOss0OCpl8RtKrROHjaQYNCk9dN5lSfk+R1l9Wbe+rSiCwZ3jw==:"
    // const username = process.env.pamulang
    const base64Credentials = Buffer.from(username + ':').toString('base64');
    const headers = {
      'Content-Type': 'application/json',
      'api-version': '2022-07-31',
      'Authorization': 'Basic ' + base64Credentials
    };
    
    const { reference_id, type, currency,amount } = req.body

    const payload = {
      "reference_id": reference_id,
      "type": type,
      "currency": currency,
      "amount": amount
    };
    
    const response = await axios.post(url, payload, { headers });

    res.json(response.data);
  } catch (error) {
    console.error('Error creating QR code:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: 'An error occurred' });
  }
});

app.post('/submit', (req, res) => {
  const { name, email, type, qty, id_pesanan, qr_code, whatsapp } = req.body;
  const transporter = nodemailer.createTransport(config.smtp);

  // Configure the email details
  const mailOptions = {
    from: 'noreply@pasarkol.condfe.com',
    to: 'alfagolfgolfindia@gmail.com',
    subject: 'Ticket',
    text: `
      Please Followup this data:
      Name: ${name}
    `,
  };
  var imagekit = new ImageKit({
    publicKey: "public_zdmbAPYFZzOI11JdoQAqYrIYpLY=",
    privateKey: "private_x8YinPhgqzQFnXWlu+I2IbYxcAM=",
    urlEndpoint: "https://ik.imagekit.io/g7mnggmbl"
  });

  const base64Data = qr_code

  imagekit.upload({
    file: base64Data, //required
    fileName: `${id_pesanan}.jpg`,   //required
    tags: ["tag1", "tag2"]
  }, function (error, result) {
    if (error) console.log(error);
    else {
      // console.log(result);
      const finalQr = result.url
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
        // res.status(200).send({ message: "Mail send", data: finalQr })
      });

      const templatePath = './email-template.ejs'
      fs.readFile(templatePath, 'utf8', (err, template) => {
        if (err) {
          console.error(err)
          res.status(500).json({ error: 'Failed to read template' })
        }

        const htmlContent = ejs.render(template, { name, qr_code:finalQr, qty, id_pesanan, type })
          .replace('{{name}}', name)
          .replace('{{id_pesanan}}', id_pesanan)
          .replace('{{qty}}', qty)
          .replace('{{type}}', type)
        // Compose email for client
        const clientMailOptions = {
          from: 'noreply@pasarkol.condfe.com',
          to: email, // Use the client's email address as the recipient
          subject: `TICKET PASARKOL - ${name} - ${type} - ${qty} Ticket`,
          html: htmlContent,
        };

        // Send email to client
        transporter.sendMail(clientMailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to send email to client' });
          } else {
            console.log('Email sent to client:', info.response);
            res.json(
              {
                message:'Success',
                data: {
                  result: result
                }
              }
            );
            // res.json({ message: 'Email sent successfully' });
          }
        });
      })
    }
  });


});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/dist/360-angular-web/index.html'));
// });




// call router
const participanRoute = require("./routes/participan")
const eventRoute = require("./routes/event")
const userRouter = require('./routes/user')
const callbackRouter = require('./routes/callback')
// const ticketRoute = require("./routes/ticket")


// endpoint for route
app.use('/pasarkol/participan', MiddleAuth, participanRoute)
app.use('/pasarkol/event', MiddleAuth, eventRoute)
app.use('/pasarkol/login', MiddleAuth, userRouter)
app.use('/xendit-payment-callback', callbackRouter)
// app.use('/pasarkol/ticket', MiddleAuth, ticketRoute)



// Sample in-memory database for demonstration purposes
const events = "welcome Dude!";

// GET all events (protected route)
app.get('/', (req, res) => {
    res.json(events);
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})