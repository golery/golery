import User from '../user/user.model';
import Rest from './Rest';
import passport from "passport";

// only special user is allowed to have short name
const SPECIAL_USER = "hly";

class ApiAuth {
    setupPublicRoute(route) {
        route.post('/login', this._login);
        route.post('/signup',
            (req, res) => this._createAccount(req, res, req.body.email, req.body.password, req.body.confirmPassword));
    }
    setupSecureRoute(route) {
        route.post('/logout',
            (req, res) => this._logout(req, res));
    }

    _login(req, res, next) {
        // 'local': use LocalStrategy
        // Ref. http://www.passportjs.org/docs/authenticate/ (section Custom Callback)
        passport.authenticate('local', function (err, user, info) {
            if (err || !user) {
                console.log('Login fail', err, user, info);
                res.status(400).send(info);
            } else {
                // Remove sensitive data before login
                user.password = undefined;
                user.salt = undefined;

                // req.login() is provided by Passport to store user to session
                req.login(user, function (err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.cookie('username', user.username);
                        if (user.username === 'hly') {
                            /* With this cookie, the google analytics script is not returned
                             * Ref. PageTemplate.js */
                            res.cookie('disableStats', 'true');
                        }
                        res.json(user);
                    }
                });
            }
        })(req, res, next);
    };

    _createAccount(req, res, email, password, confirmPassword) {
        if (!this._isValidEmail(email)) {
            console.log("Invalid email ", email);
            res.status(450).json({message: 'Invalid email address'});
            return;
        }
        if (!this._isValidPassword(password)) {
            console.log("Invalid password ", password);
            res.status(451).json({message: 'Password is too short'});
            return;
        }
        if (password !== confirmPassword) {
            console.log("Password and confirm password do not match", password);
            // this should be checked at client side before submiting
            res.status(452).json({message: 'Confirm password does not match'});
            return;
        }
        let promise = new User({username: email, email: email, password: password, provider: 'local'}).save().then(user => {
            // req.login() is provided by Passport to store user to session
            req.login(user, function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        });
        Rest.json(req, res, promise);
    }

    _isValidPassword(password) {
        return password.length >= 8;
    }

    _isValidEmail(email) {
        if (!email) return false;
        if (email === SPECIAL_USER) return true;

        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    _logout(req, res) {
        req.logout();
        res.json("Logout");
    }
}
export default new ApiAuth();
