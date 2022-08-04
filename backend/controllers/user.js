// Import mongoose
const mongoose = require('mongoose');
// Import the package for the password's crypting
const bcrypt = require('bcrypt');
// Route to the user's model
const User = require('../models/user');
// Import the package of creation and verification of the tokens
const jwt = require('jsonwebtoken');
// Import env file
require("dotenv").config();
//  Module signup, it verify the email, password ans crypt it then send it to the database
exports.signup = (req, res, next) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;
    if (passwordRegex.test(req.body.password)) {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message : 'User created !'}))
                .catch(error => res.status(400).json({ message : 'Email adresse already used' }));
        })
        .catch(error => res.status(500).json({ error }));
    } else {
        res.status(400).json({ message : 'Your password must contain at least 8 characters including a lowercase, an uppercase and a number' });
    }
};
// Module login, it compare the email and password to the database then give access or not, depends on the database answer
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: "User not found !"});
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: "Incorrect password !"});
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId:user._id },
                        process.env.TOKEN,
                        { expiresIn: '24h'}
                    )
                });
            })
            .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};