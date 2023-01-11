import express from 'express'
import { signIn } from '../services/user.js'
import { authenticateJWT } from '../services/auth/authentication.js'

const router = express.Router()

/* GET users listing. */
router.get('/signin', signIn)
router.get('/userSample', (req, res) => {
    res.status(200).json({
        user: { username: 'test', email: 'myemail@123.com' },
    })
})

export default router
