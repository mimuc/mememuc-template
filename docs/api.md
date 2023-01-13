## Endpoints

- /templates
- /memes            # POST
    - <memeID>      # GET (comments, likes)
        - /likes    # POST/DELETE (only one per user)
        - /comments # POST/DELETE
- /users
    - /             # Shows all users
    - /<username>     # Shows specific user
        - /         # Show profile
        - /memes    # GET
- /my
    - /
    - /templates    # GET/POST
    - /memes        # GET/POST
    - /feed         # user personalized memes, friends, etc.
- /auth
    - /             # POST/DELETE (login/logout)
    - /register     # POST/DELETE (create/delete account)


## Schema
Refer to node-backend/db/models.js
- meme
    - visibility: String ("private" - only visible to creator, "unlisted" - accessible via URL, "public")
    - image: String (base64)
    - username: String 
- template
    - name: String
    - visibility: String ("private" - only visible to creator, "unlisted" - accessible via URL, "public")
    - images: Array
        - position: Object
            - x: Number
            - y: Number
        - size: Object
            - x: Number
            - y: Number
        - image: String (base64)
    - size: Object
        - x: Number
        - y: Number
    - creator: String
    - textboxes: Array
        - position: Object
            - x: Number
            - y: Number
- user
    - username: String        # Used to authenticate the user; each id is unique.
    - displayName: String
    - password: String
