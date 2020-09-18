const xss = require('xss')

const DecksService = {

    createDeck(db, deck) {
        return db.insert(deck)
            .into('mtg_decks')
            .returning('*')
            .then(([deck]) => deck)
    }

    getAllDecks(db, user_id) {
        return db('mtg_decks')
            .where('user_id', user_id)
    }

    getDeckById(db, deck_id) {
        return db('mtg_decks')
            .select('*')
            .where({ deck_id })
            .first();
    }

    deleteDeck(db, deck_id) {
        return db('mtg_decks')
            .where({ deck_id })
            .delete();
    }

    updateDeck(db, deck_id, data) {
        return db('mtg_decks')
            .where({ deck_id })
            .update(data);
    }

    serializeDeck(deck) {
        
    }

}

module.exports = DecksService