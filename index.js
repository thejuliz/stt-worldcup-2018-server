const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()
// const sqlite3 = require('sqlite3').verbose()
// const db = new sqlite3.Database('worldcup.db')
const pgp = require('pg-promise')(/*options*/)
const db = pgp('postgres://inshmbgqlpkolv:630b068260e8cbf573bec00670e0c4344933b5c0bafcfef34cbde9f24a43ae23@ec2-54-83-1-94.compute-1.amazonaws.com:5432/derjie4l4ghpm')

app
  .use(express.static(path.join(__dirname, 'public')))
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
      res.status(500).send(error);
    })
  })
  .get('/prediction/:user_id/:match_id', (req, res) => {
    const user_id = req.params.user_id
    const match_id = req.params.match_id

    if (user_id && match_id) {
      const sql = 'SELECT * FROM PREDICTION WHERE user_id = \'' + user_id + '\' AND match_id = ' + match_id
      db.any(sql).then((data) => {
        res.type('json').status(200).send(data)
      })
      .catch((error) => {
        res.status(500).send(error);
      })
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
