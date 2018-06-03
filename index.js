const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('worldcup.db')

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
  .get('/', (req, res) => {
    res.status(200).send('Hello world')
  })
  .get('/predictions', (req, res) => {
    db.serialize(function () {
      db.all(sql,params, (err, rows) => {
        if (err) res.status(500)
        res.status(200).send(rows)
      })
    })

    db.close()
    
  })
  .get('/my-prediction/:user_id/:match_id', (req, res) => {
    const user_id = req.params.user_id
    const match_id = req.params.match_id

    if (user_id && match_id) {
      db.serialize(function () {
        const query = 'SELECT * FROM prediction WHERE user_id = "' + user_id + '" AND match_id = ' + match_id
        db.get(query, (err, row) => {
          if (err) res.status(500)
          res.status(200).send(row);
        })
      })

      db.close()
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
