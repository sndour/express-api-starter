const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require ('body-parser');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const apiKey= "ba714b3c665fbfc166e868a7d4bea066";
const secretKey="68094b438ee38b1c0164123237bcc7e8";
const mailjet = require ('node-mailjet')
    .connect(apiKey, secretKey);

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, enctype');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(bodyParser.json());

app.use((req, res) =>{
  if (req.method == "OPTIONS")
    {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end();
    }
});

app.post('/signupmail', (req, res) => {
  console.log('on regarde le contenu du body qui est: ',req.body);
  var nom = req.body.email.split('@');
  const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages":[
                {
                    "From": {
                        "Email": "ymozeus@gmail.com",
                        "Name": "Rose Belle"
                    },
                    "To": [
                        {
                            "Email": req.body.email,
                            "Name": nom[0]
                        },
                    ],
                    "Bcc": [
                        {
                            "Email": "ndouradefemi@gmail.com",
                            "Name": "Rose Belle"
                        }
                    ],
                    "Subject": "Confirmation Email",
                    // "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                     "HTMLPart": `Bonjour `+req.body.email +` S\'il vous plaît, cliquez sur ce lien pour confirmer votre adresse email: <br/><a href="${req.body.urlConfirm}"> ${req.body.urlConfirm} </a>`
                    // "TemplateID": 698906,
                    // "TemplateLanguage": true,
                    // "Subject": "Confirmation Email",
                    // "Variables": {   "link": url}
                }
            ]
        })
    request
        .then((result) => {
            console.log(result.body);
            res.json({
              message: 'email sent'
            });
        })
        .catch((err) => {
            console.log(err.statusCode)
            res.json({
              message: err
            });
        });
  
});

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

// app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


// app.use(express.static(path.join(__dirname, '/public')));


module.exports = app;
