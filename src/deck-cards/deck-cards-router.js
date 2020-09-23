const express = require('express')
const deckCardsRouter = express.Router()
const DeckCardsService = require('./deck-cards-service')
const { requireAuth } = require('../middleware/jwt-auth')


deckCardsRouter
    .route('/:id')
    .get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db')
        console.log(req.deck)
        DeckCardsService.getCardsByDeckId(knexInstance, req.params.id)
            .then(cards => {
                res.json(cards)
            })
            .catch(next)
    })


module.exports = deckCardsRouter