import passport from "passport";
import GoApi from './GoApi/GoApi';

class ApiAuth {
    setupPublicRoute(route) {
        route.post('/login', this._login);
        route.post('/signup',
            (req, res) => this._createAccount(req, res, req.body.username, req.body.password));
    }


    _login(req, res, next) {
        // 'local': use LocalStrategy
        // Ref. http://www.passportjs.org/docs/authenticate/ (section Custom Callback)
        console.log('Login');
        passport.authenticate('local', function (err, user, info) {
            if (err || !user) {
                console.log('Login fail', err, user, info);
                res.status(400).send(info);
            } else {
                console.log('Login success');
                // req.login() is provided by Passport to store user to session
                req.login(user, function (err) {
                    if (err) {
                        console.log('Fail to store login to session', err);
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
    }

    _createAccount(req, res, email, password) {
        GoApi.signup(email, password)
            .then(({data}) => {
                let user = data;
                if (!user || !user.id) {
                    throw 'Fail to create account. Success reponse with no data';
                }
                // ask passport to add user to session.
                req.login(user, err => {
                    if (err) {
                        console.log('Fail to attach user to session');
                        throw err;
                    }
                    res.cookie('username', user.username);
                    if (user.username === 'hly') {
                        /* With this cookie, the google analytics script is not returned
                         * Ref. PageTemplate.js */
                        res.cookie('disableStats', 'true');
                    }
                    res.json(user);
                });
            }).catch(err => {
            let {status, message} = err.response.data;
            console.log('Fail. Status=', status, '.Msg=', message, err.response);
            res.status(status).json({message: message});
        }).catch(err => {
            console.log('Unknown error', err);
            res.status(400).json(err);
        });
    }

    setupSecureRoute(route) {
        route.post('/logout', (req, res) => this._logout(req, res));
    }


    _logout(req, res) {
        req.logout();
        res.json("Logout");
    }
}

export default new ApiAuth();
