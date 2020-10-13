# <b>MTG Deckbuilder Capstone - Server</b>

## `Method: GET`
### <b>All Cards</b>
- URL: /api/cards
- Required Params:   
    `none`
- On Success:   
`Code: 200`   
`Content-type: json`   

- Content:
```
    {
        "id": 1,
        "name": "Alpine Watchdog",
        "image": "url"
    },
    {
        "id": 2,
        "name": "Angelic Ascension",
        "image": "url"
    },
    {
        "id": 3,
        "name": "Anointed Chorister",
        "image": "url"
    }
```

### <b>Deck by user ID</b>

- URL: `/api/decks`
- Required Params:   
    `req.user.id (supplied from auth token)`
- On Success:   
    `Code: 200`   
    `Content-type: json`      
- Content:
```
   {
       "id": 30,
        "user_id": 1,
        "name": "New Deck",
        "text": "Big Deck"
   }
```
### <b>Cards by Deck ID</b>

- URL: `/api/deckcards/:id`
- Required Params:   
    `req.user.id (supplied from auth token)`
- On Success:   
    `Code: 200`   
    `Content-type: json`     
- Content:
```
    {
        "id": 1,
        "deck_id": 30,
        "card_id": 1,
        "name": "Alpine Watchdog",
        "image": "https://media.wizards.com/2020/m21/en_kS7LiunFPF.png"
    },
    {
        "id": 1,
        "deck_id": 30,
        "card_id": 1,
        "name": "Alpine Watchdog",
        "image": "https://media.wizards.com/2020/m21/en_kS7LiunFPF.png"
    }
``` 

## `Method: POST`

### <b>Create User</b>
- URL: `/api/users`
- URL Params:   
    `none`
- Required Params:   
    `full_name - full name of user`   
    `user_name - new user name`   
    `password: - password for new user`
- Optional Params:
    `nickname: - optional nickname if desired`
- On Success:   
    `Code: 201: Created`   
    `Content-type: json`
- On Failure:   
    `Code: 400: Bad Request`   
    `Code: 400: Missing field in request body.`     
- Content: 
```
    {
        "id": "5",
        "user_name": "TestUser1",
        "full_name": "TestUser1",
        "nickname": "",
        "date_created": "2020-10-13T22:04:28.869Z"
    }
```

## `Method: DELETE`

### <b>Deck by ID</b>
- URL: `/api/decks`
- Required Params:   
    `deck_id = integer (number of deck to delete)`    
- Optional Params:   
    `none`
- On Success:   
    `Code: 204: No Content`   
- On Failure:   
    `Error: 'Deck does not exist.'`
- Content:    
   `no content`
