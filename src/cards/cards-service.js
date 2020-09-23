const xss = require('xss')

const CardsService = {

    getAllCards(db) {
        return db('mtg_cards')
    },

    getCardById(db, card_id) {
        return db('mtg_cards')
            .select('*')
            .where({ card_id })
            .first();
    },
    
    createDeckCards(db, deck_id, cards) {
        return cards.map(card => {
            const deckCards = { deck_id, card_id: card.id }
            return db.insert(deckCards)
                .into('mtg_decks_cards')
                .returning('*')
                .then(([card]) => card)
        })
    }
}

module.exports = CardsService