var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const {User} = require('../db/models');
const {authenticate} = require('../db/authentication');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).send('Username and password are required');
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send('Invalid username or password');
    }
    // Use the database id to sign the user, as it is unique, and should be kept secret anyway
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '6h' });
    const expiryTime = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours from now

    res.json({ token, displayName: user.displayName, expiryTime});
});

/* router.delete('/logout', authenticate, (req, res) => {
    req.session.destroy();
    res.json({message: 'You have been logged out'});
}); */

router.post('/register', async (req, res) => {
    try {
        const { username, displayName, password } = req.body;
        if(username == undefined || displayName == undefined || password == undefined) {
            return res.status(400).send("Please provide username, display name, and password")
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send('Username already exists');
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            displayName,
            password: hashedPassword,
        });

        await user.save();

        return res.status(201).send('User created successfully');
    } catch (error) {
        console.error(error)
        return res.status(500).send('Error creating user');
    }
});

router.delete('/register', authenticate(), async (req, res) => {
    // TODO: Remove memes and templates + update API description
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