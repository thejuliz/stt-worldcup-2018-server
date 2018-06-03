const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()
const bodyParser = require('body-parser');
// const sqlite3 = require('sqlite3').verbose()
// const db = new sqlite3.Database('worldcup.db')
const pgp = require('pg-promise')(/*options*/)
const db = pgp('postgres://inshmbgqlpkolv:630b068260e8cbf573bec00670e0c4344933b5c0bafcfef34cbde9f24a43ae23@ec2-54-83-1-94.compute-1.amazonaws.com:5432/derjie4l4ghpm')

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
  .get('/prediction/:user_id', '/prediction/:user_id/:match_id', (req, res) => {
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
    const sql = 'SELECT * FROM EMPLOYEE'
    db.any(sql).then((data) => {
      res.type('json').status(200).send(data)
    })
    .catch((error) => {
      res.type('json').status(500).send(error)
    })
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
