const express = require('express')
const decksRouter = express.Router()
const jsonParser = express.json()
const DecksService = require('./decks-service')
const { requireAuth } = require('../middleware/jwt-auth')
const CardsService = require('../cards/cards-service')


decksRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db')
        DecksService.getAllDecks(knexInstance, req.user.id)
            .then(decks => {
                res.json(decks)
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { name, cards, text } = req.body;

        if(!name) {
            return res.status(400).json({error: 'Deck must have a name.'})
        }

        DecksService.createDeck(
            req.app.get('db'),
            { name, text, user_id: req.user.id }
        )
            .then(deck => {
                return CardsService.createDeckCards(
                    req.app.get('db'),
                    deck.id,
                    cards
                )
            })
            .then((deck) => {
                return res.status(201)
                    .json(deck)
            })
            .catch(next)
    })


decksRouter
    .route('/:id')
    .delete((req, res, next) => {
        const { id } = req.params
        DecksService.deleteDeck(
            req.app.get('db'),
            id
        )
            .then(rowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = decksRouter
