// Import express
const express = require('express');
const app = express();
// Import mongoose
const mongoose = require('mongoose');
// Import the helmet's middlewares 
const helmet = require('helmet');
// Route to the route's user
const userRoutes = require('./routes/user');
// Route to the route's sauces
const saucesRoutes = require('./routes/sauces');
// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const cors = require('cors');
// importation to access to the path
const path = require('path');
// Import env file
const dotenv = require('dotenv');

// Connection to the mongoose database
mongoose.connect('mongodb+srv://'+process.env.MONGO_ID+':'+process.env.MONGO_PASS+'@cluster0.udr7c.mongodb.net/'+process.env.MONGO_NAME+'?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors());

app.use(express.json());

// Middlewares who connect the api to the database
app.use(helmet({crossOriginResourcePolicy: false}));
app.use('/api', userRoutes);
app.use('/api', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;