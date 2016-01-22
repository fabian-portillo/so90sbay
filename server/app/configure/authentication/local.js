'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (app) {

    // When passport.authenticate('local') is used, this function will receive
    // the email and password to run the actual authentication logic.
    var strategyFn = function (email, password, done) {
        User.findOne({ email: email })
            .then(function (user) {
                // user.correctPassword is a method from the User schema.
                if (!user || !user.correctPassword(password)) {
                    done(null, false);
                } else {
                    // Properly authenticated.
                    done(null, user);
                }
            }, function (err) {
                done(err);
            });
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

    // A POST /login route is created to handle login.
    app.post('/login', function (req, res, next) {

        var attachCartToUser = function (user) {

            if ( req.session.cart && req.session.cart._id ) {

                return Promise.all([
                    User.findByIdAndUpdate(
                        user._id,
                        { cart: req.session.cart._id },
                        { new: true }
                    ),
                    mongoose.model('Order').findByIdAndUpdate(
                        req.session.cart._id,
                        { user: user._id },
                        { new: true }
                    )
                ])
                .then( function( saveData ) {

                    // have to update the user and cart data
                    req.user = saveData[0];
                    req.session.cart = saveData[1];

                });

            } else {

                return new Promise( function( ok ) { ok(); })

            }

        }

        var authCb = function (err, user) {

            if (err) return next(err);

            if (!user) {
                var error = new Error('Invalid login credentials.');
                error.status = 401;
                return next(error);
            }

            // req.logIn will establish our session.
            req.logIn(user, function (loginErr) {
                if (loginErr) return next(loginErr);

                // check to see if there's a cart on the session, and attach it to the user
                attachCartToUser( user )
                .then( function() {

                    // We respond with a response object that has user with _id and email.
                    res.status(200).send({
                        user: user.sanitize()
                    });

                })
                .then( null, next );
            });

        };

        passport.authenticate('local', authCb)(req, res, next);

    });

};
