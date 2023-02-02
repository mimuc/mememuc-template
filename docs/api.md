## Endpoints

### Fully implemented

- /templates                # GET/POST
    - [templateName]        # GET
- /memes                    # POST/GET (+ numComments, numLikes)
    - [memeID]              # GET (+ numComments, numLikes)
        - /like             # PUT/DELETE/GET (only one per user)
        - /comments         # POST/GET
            - [commentID]   # DELETE/GET
- /users
    - /             # GET Shows all users
    - /[username]   # GET Shows specific user (+ likeCount, commentCount, memesCount)
        - /memes    # GET
- /my
    - /             # GET (user profile)
    - /templates    # GET
    - /memes        # GET

### Not fully implemented


- /my
    - /templates    # POST
    - /memes        # POST
    - /feed         # user personalized memes, friends, etc.
- /auth
    - /login        # POST/DELETE (login/logout)
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
