'use strict';
var mongoose = require('mongoose');

function arrayLengthValidator (value) {
    return value.length >= 1
}

var schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: [String],
        validate: {
            validator: arrayLengthValidator,
            message: 'Need at least one category!'
        }
    },
    photo: {
        type: [String]
    }
});

schema.pre('save', function(next) {
    var defaultPhoto = "https://media.giphy.com/media/WW00AYYAyb2YE/giphy.gif"
    if (this.photo.length === 0) {
        this.photo.push(defaultPhoto)
    }
    next();

});


mongoose.model('Product', schema);
