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
const db_url = 'mongodb://stt:Settrade99@ds247670.mlab.com:47670/stt-worldcup-2018'

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  //.get('/', (req, res) => res.render('pages/index'))
  .get('/', (req, res) => {
    res.status(200).send('Hello world')
  })
  .get('/predictions', (req, res) => {
    const sql = 'SELECT * FROM PREDICTION'
    db.any(sql).then((data) => {
      res.type('json').status(200).send(data)
    })
    .catch((error) => {
      res.type('json').status(500).send(error)
    })
  })
  .get(['/prediction/:user_id', '/prediction/:user_id/:match_id'], (req, res) => {
    const user_id = req.params.user_id
    const match_id = req.params.match_id

    if (user_id) {
      let sql = 'SELECT * FROM PREDICTION WHERE user_id = \'' + user_id + '\''
      if (match_id) sql = sql + ' AND match_id = ' + match_id
      db.any(sql).then((data) => {
        res.type('json').status(200).send(data)
      })
      .catch((error) => {
        res.type('json').status(500).send(error)
      })
    }
  })
  .post('/predict', (req, res) => {
    db.none('INSERT INTO PREDICTION(MATCH_ID, HOME_RESULT, AWAY_RESULT, USER_ID) VALUES($/match_id/, $/home_result/, $/away_result/, ${user_id})', req.body).then((data) => {
      res.type('json').status(200).send({
        message: 'Prediction completed'
      })
    })
    .catch((error) => {
      res.type('json').status(500).send(error)
    })
  })
  .get('/users', (req, res) => {
    MongoClient.connect(db_url, function (err, db) {
      if (err) res.type('json').status(500).send(err)
    
      db.collection('users').find().toArray(function (err, result) {
        if (err) res.type('json').status(500).send(err)
    
        res.type('json').status(200).send(result)
      })
    })

    // const sql = 'SELECT * FROM EMPLOYEE'
    // db.any(sql).then((data) => {
    //   res.type('json').status(200).send(data)
    // })
    // .catch((error) => {
    //   res.type('json').status(500).send(error)
    // })
  })
  .post('/add-user', (req, res) => {
    db.none('INSERT INTO EMPLOYEE(ID, NAME, POSITION) VALUES(${id}, ${name}, ${position}) ON CONFLICT(ID) DO UPDATE SET NAME=${name}, POSITION=${position}', req.body).then((data) => {
      res.type('json').status(200).send({
        message: 'User added'
      })
    })
    .catch((error) => {
      res.type('json').status(500).send(error)
    })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
