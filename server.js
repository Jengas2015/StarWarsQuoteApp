const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

let dbConnectionStr = process.env.DB_STRING



MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log("Connected to Database")
        const db = client.db("star-wars-quotes")
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())

        app.listen(3000, function () {
            console.log("listening on 3000")
        })

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html')
        })

        app.post('/quotes', (req, res) => {
            console.log(req.body)
        })
    })
    .catch(console.error)
    