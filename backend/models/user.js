// Import mongoose
const mongoose = require('mongoose');
// Import uniquevalidator package 
const uniqueValidator = require('mongoose-unique-validator');
// Model of a user's schema
const userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
});
// Function that check if the user doesn't already exist
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);

