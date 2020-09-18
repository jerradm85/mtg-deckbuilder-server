const express = require('express')
const decksRouter = express.Router()
const jsonParser = express.json()
const DecksService = require('./decks-service')


decksRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        DecksService.getAllDecks(knexInstance)
            .then(decks => {
                res.json(decks)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, cards, text } = req.body // placeholders destructured: update with appropriate data names

        //validation goes here

        DecksService.createDeck(
            req.app.get('db'),
            { name, cards, text }  // placeholders; update with destructured data
        )
        .then(deck => {
            res.status(201)
                .location(`location goes here`)
                .json(deck)
        })
        .catch(next)
    })


    decksRouter
        .route('/:id')
        