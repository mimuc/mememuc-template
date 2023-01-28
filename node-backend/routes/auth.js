var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const {User} = require('../db/models');
const {authenticate} = require('../db/authentication');

router.post('/login', authenticate, (req, res) => {
    const token = jwt.sign({ username: req.username }, 'secret_key');
    res.send({ token });
});

router.delete('/logout', authenticate, (req, res) => {
    req.session.destroy();
    res.json({message: 'You have been logged out.'});
});

router.post('/register', async (req, res) => {
    try {
        const { username, displayName, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ error: 'Username already exists' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            displayName,
            password: hashedPassword,
        });

        await user.save();

        return res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Error creating user' });
    }
});

router.delete('/register', authenticate, async (req, res) => {
    try {
        const user = await User.findOneAndDelete({username: req.username});
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.status(200).send('User successfully deleted');
    } catch (error) {
        return res.status(500).send({ message: 'Error deleting user' });
    }
});

module.exports = router;