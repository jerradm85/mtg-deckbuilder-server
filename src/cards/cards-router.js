const express = require('express')
const cardsRouter = express.Router()
const jsonParser = express.json()
const CardsService = require('../cards/cards-service')
const { requireAuth } = require('../middleware/jwt-auth')

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