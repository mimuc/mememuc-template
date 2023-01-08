## Endpoints

- /templates
- /memes
    - <memeID>      # GET (comments, likes)
        - /likes    # POST/DELETE (only one per user)
        - /comments # POST/DELETE
- /users
    - /             # Shows all users
    - /<userID>     # Shows specific user
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
- meme
    - visibility: String ("private" - only visible to creator, "unlisted" - accessible via URL, "public")
    - image: String (base64)
    - creator: String 
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
    - userId: String
    - displayName: String
    - password: String
