const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

let dbConnectionStr = process.env.DB_STRING



MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log("Connected to Database")
        const db = client.db("star-wars-quotes")
        const quotesCollection = db.collection("quotes")

        app.set("view engine", "ejs")

        app.use(bodyParser.urlencoded({extended:true}))
        app.use(bodyParser.json())



        app.use(express.static("public"))

        app.listen(3000, function () {
            console.log("listening on 3000")
        })

        app.get('/', (req, res) => {
            const cursor = db.collection('quotes')
            .find()
            .toArray()
            .then(results => {
                res.render("index.ejs", {quotes: results})
            })
            .catch(error => console.error(error))

        })


        app.post('/quotes', (req, res) => {
            quotesCollection
            .insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.error(error))
        })

        app.put("/quotes", (req, res)=> {
            quotesCollection
            .findOneAndUpdate(
                {name: "Yoda"}, {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote,
                    },
                }, {
                    upsert: true,
                })
            .then(result=> {
                res.json("Success")
            })
            .catch(error=>console.error(error))
        })
        
    })

