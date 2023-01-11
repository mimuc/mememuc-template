export const signIn = async (req, res, next) => {
    const db = req.db
    const users = db.get('users')
    console.log('WERE HERE')
    try {
        const oneUser = users.find(
            { username: req.username },
            { projection: { basicauthtoken: 0 } }
        ) // return all user properties, except the basic auth token
        if (oneUser) {
            res.status(200).json({ user: oneUser })
        } else {
            throw new Error('User not found')
        }
    } catch (e) {
        res.status(500).send()
    }
}
