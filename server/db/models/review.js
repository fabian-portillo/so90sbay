'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    title: {
        type: String
    },
    body: {
        type: String,
        validate: {
          validator: function(v) {
            return /^[a-zA-Z]{,150}$/.test(v);
          },
          message: 'You have exceeded the maximum number of characters!'
        },
        required: true
    },
    rating: {
        type: Number
    }
});


mongoose.model('Review', schema);