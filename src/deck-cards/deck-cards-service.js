const xss = require('xss')

const DeckCardsService = {

    getCardsByDeckId(db, deck_id) {
        return db('mtg_decks_cards')
            .select('*')
            .join("mtg_cards", "mtg_decks_cards.card_id", "mtg_cards.id")
            .where({ deck_id });
    },

}

module.exports = DeckCardsService