// Import mongoose
const mongoose = require('mongoose');
// Route to the user's model
const Sauce = require('../models/sauce');
// Import the fs module
const fs = require('fs');

const authorization = require('../middleware/auth');
const sauce = require('../models/sauce');

// Function that display all the sauces from the database
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {
            res.status(200).json(sauces);
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

// // Function that display the chosen sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
};

// // Function that create a new sauce then save it in the database
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLikes: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce saved !' }) })
        .catch(() => { res.status(400).json({ error }) })
};

// Function that delete the chosen sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId == authorization.userId) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlinkSync(`images/${filename}`)
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce deleted' }))
                    .catch(error => res.status(400).json({ error }))
            } else {
                res.status(403).json({ message: 'Unauthorized request !' })
            };
        })
        .catch(error => res.status(500).json({ error }));
};

// Module that modify the sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId === authorization.userId) {
                if (!req.file) {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                        .catch(error => res.status(400).json({ error }));
                } else {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                            .catch(error => res.status(400).json({ error }));
                    })
                }
            } else {
                res.status(401).json({ message: 'Unauthorized request !' });
            }
        })
        .catch(error => res.status(500).json({ error }))
};

// Module that add a like, a dislike or cancel it
exports.likeOrDislike = async (req, res, next) => {

    // If the user like the sauce 
    if (req.body.like == 1) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if ((sauce.usersLiked.includes(req.body.userId)) || (sauce.usersDisliked.includes(req.body.userId))) {
                    res.status(401).json({ message: 'Sauce already liked or disliked !' })
                } else {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $push: { usersLiked: req.body.userId },
                            $inc: { likes: +1 }
                        }
                    )
                        .then(() => res.status(200).json({ message: 'Sauce liked !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ message: 'Sauce not found !' }));
    }

    // If the user disliked the sauce
    else if (req.body.like == -1) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if ((sauce.usersDisliked.includes(req.body.userId)) || (sauce.usersLiked.includes(req.body.userId))) {
                    res.status(401).json({ message: 'Sauce already disliked or liked!' })
                } else {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $push: { usersDisliked: req.body.userId },
                            $inc: { dislikes: +1 }
                        }
                    )
                        .then(() => res.status(200).json({ message: 'Sauce disliked !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ message: 'Sauce not found !' }));
    }

    // If the user cancel his like or his dislike
    else if (req.body.like == 0) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $pull: { usersLiked: req.body.userId },
                            $inc: { likes: -1 }
                        }
                    )
                        .then(() => res.status(200).json({ message: 'You dont like this sauce anymore !' }))
                        .catch(error => res.status(400).json({ error }));
                }
                else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1 }
                        }
                    )
                        .then(() => res.status(200).json({ message: 'You dont like this sauce anymore !' }))
                        .catch(error => res.status(400).json({ error }));
                } else {
                    res.status(500).json({ message: 'eereureee' })
                }
            })
            .catch(error => res.status(400).json({ error }));
    } else {
        res.status(401).json({ message: 'Unauthorized request !' });
    }
};


