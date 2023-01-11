import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

let refreshTokens = []
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

export const generateJWT = (email) => {
    try {
        const token = jwt.sign({ username: email }, accessTokenSecret)

        return token
    } catch (err) {
        console.log(err)
        return null
    }
}

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(' ')[1]

        jwt.verify(token, accessTokenSecret, (err) => {
            if (err) {
                return res.sendStatus(403)
            }
            next()
        })
    } else {
        res.sendStatus(401)
    }
}

export const getToken = (req, res) => {
    const token = req.body.token
    if (!token) {
        return res.sendStatus(401)
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403)
    }

    jwt.verify(token, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        } else {
            const accessToken = jwt.sign(
                { username: user.username },
                accessTokenSecret,
                { expiresIn: '15m' }
            )

            res.status(200).json({
                accessToken,
            })
        }
    })
}
