const express = require('express')
const cardsRouter = express.Router()
const CardsService = require('../cards/cards-service')

cardsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        CardsService.getAllCards(knexInstance)
            .then(cards => {
                res.json(cards)
            })
            .catch(next)
    })

module.exports = cardsRouter