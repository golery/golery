import passport from "passport";

export default function loginController(req, res, next) {
    // 'local': use LocalStrategy
    passport.authenticate('local', function (err, user, info) {
        if (err || !user) {
            console.log('Login fail', err, user, info);
            res.status(400).send(info);
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    })(req, res, next);
};
