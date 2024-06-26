const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const config = require('jconf');
const fs = require('fs');
const ejs = require('ejs');
const app = express();
const database = require('./models');
const fireBaseAdmin = require('firebase-admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '5mb'}));

app.use(expressValidator());

app.use((req, res, next) => {
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  next();
});


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/files'));
app.use(express.static(__dirname + '/data/articles/images'));
app.use(require('./routes/index'));

database
  .then(() => console.log('database connected'))
  .then(() => new Promise((resolve, reject) => {
    app.listen(process.env.PORT || config.port, config.address, resolve);
    app.on('error', reject);
  }))
  .then(() => console.log(`server ${config.address}:${process.env.PORT || config.port} listening...`))
  .catch(err => console.error('Internal server error: ', err));
