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