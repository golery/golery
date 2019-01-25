import GoApi from '../../GoApi/GoApi';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';


module.exports = function () {
    // Use local strategy
    console.log('Passport use Local Strategy');
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function (username, password, done) {
            console.log('Passport local strategy: load ' + username);
            GoApi.login(username, password).then(({data}) => {
                console.log(data);
                done(null, data);
            }).catch(err => {
                done(err);
            });

        }
    ));
};
