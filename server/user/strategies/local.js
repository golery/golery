'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

import User from "../user.model";

module.exports = function () {
    // Use local strategy
    console.log('Passport use Local Strategy');
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function (username, password, done) {
            console.log('Passport local strategy: load ' + username);
            User.findOne({
                username: username
            }, function (err, user) {
                if (err) {
                    console.log('Passport local strategy: Fail ', err);
                    return done(err);
                }
                if (!user) {
                    console.log('Passport local strategy: User not found ', err);
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }

                return done(null, user);
            });
        }
    ));
};
