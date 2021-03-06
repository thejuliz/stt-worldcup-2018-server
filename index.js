const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()
const bodyParser = require('body-parser');
// const sqlite3 = require('sqlite3').verbose()
// const db = new sqlite3.Database('worldcup.db')
// const pgp = require('pg-promise')(/*options*/)
// const db = pgp('postgres://gxqvybbufxriks:677d29ca2039c13cb3b971ee3785d85b4a7193eb62bf7a503c53b3f6badc127b@ec2-107-20-249-68.compute-1.amazonaws.com:5432/d3fkcigkaqpmbp')

const MongoClient = require('mongodb').MongoClient
var db;

//const db_url = 'mongodb://stt:Settrade99@ds247670.mlab.com:47670/stt-worldcup-2018'
const db_url = 'mongodb+srv://stt:Settrade99@cluster0.k2bgz.mongodb.net/euro-2021?retryWrites=true&w=majority';

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

// Initialize connection once
MongoClient.connect(db_url, function (err, database) {
  if (err) throw err;

  db = database.db('euro-2021');

  // Start the application after the database connection is ready
  app.listen(PORT);
  console.log("Listening on port " + PORT);
});

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(allowCrossDomain)
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .get('/', (req, res) => {
    res.status(200).send('Hello world')
  })
  .get('/predictions', (req, res) => {
    db.collection('predictions').find().toArray(function (err, result) {
      if (err) res.type('json').status(500).send(err)

      res.type('json').status(200).send(result)
    });
  })
  .get(['/prediction/:user_id', '/prediction/:user_id/:match_id'], (req, res) => {
    const user_id = req.params.user_id
    const match_id = req.params.match_id

    if (user_id) {
      const query = { user_id }
      if (match_id) query.match_id = parseInt(match_id)
      db.collection('predictions').find(query).toArray(function (err, result) {
        if (err) res.type('json').status(500).send(err)

        res.type('json').status(200).send(result)
      })
    }
  })
  .post('/predict', (req, res) => {
    const { match_id, prediction, user_id } = req.body;
    db.collection('predictions').replaceOne(
      {
        match_id: parseInt(match_id),
        user_id: user_id
      },
      {
        match_id: parseInt(match_id),
        prediction,
        user_id
      },
      {
        upsert: true
      }
    ).then(() => {
      res.type('json').status(200).send({ match_id: match_id, prediction: prediction })
    })
  })
  .get('/users', (req, res) => {
    db.collection('users').find().toArray(function (err, result) {
      if (err) res.type('json').status(500).send(err)

      res.type('json').status(200).send(result)
    })
  })
  .post('/add-user', (req, res) => {
    db.collection('users').replaceOne(
      {
        id: req.body.id
      },
      req.body,
      {
        upsert: true
      }
    ).then(() => {
      res.type('json').status(200).send({ message: 'User added' })
    })
  })
  // .listen(PORT, () => console.log(`Listening on ${ PORT }`))
