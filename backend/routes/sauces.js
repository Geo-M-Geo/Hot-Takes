// Import express
const express = require('express');
// Creation of the sauce's router
const router = express.Router();
// Route to the controller's sauces
const saucesController = require('../controllers/sauces');
// Route to the authentification middleware
const authorization = require('../middleware/auth');
// Route to the multer middleware
const multer = require('../middleware/multer-config');

// Router that check the authorization then get all the sauces
router.get('/sauces',authorization , saucesController.getAllSauces);
// Router that check the authorization, save the picture and create a new sauce
router.post('/sauces', authorization, multer, saucesController.createSauce);
// Router that check the authorization then get the choosen sauce
router.get('/sauces/:id', authorization, saucesController.getOneSauce);
// Router that check the authorization and delete a sauce if youre the creator of it
router.delete('/sauces/:id', authorization, saucesController.deleteSauce);
// Router that check the authorization and find the sauce and modify it
router.put('/sauces/:id', authorization, saucesController.modifySauce);
// Router that check the authorization and add a like or a dislike
router.post('/sauces/:id/like', authorization, saucesController.likeOrDislike);

module.exports = router;
