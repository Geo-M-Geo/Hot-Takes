// Import the package jsonweboken that creat and verify passwords
const jwt = require('jsonwebtoken');
// Import env file
const dotenv = require('dotenv');
// Module that verify the Token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Unauthorized request !';
        } else {
            next();
        }
        } catch (error) {
            res.status(403).json({ error: error | 'Unauthorized request !'});
        }
};