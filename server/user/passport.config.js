import passport from "passport";
// import connectMongo from "connect-mongo";
import session from "express-session";
import localStrategy from "./strategies/local";
import User from "./user.model";
// import SessionStore from "../Web/Auth/SessionStore";
import RestSessionStore from "../Web/Auth/RestSessionStore";

// https://github.com/jdesboeufs/connect-mongo
//     const MongoStore = connectMongo(session);

const sessionSecret = 'GoLeRy';
const sessionDbCollection = 'sessions';

const HTTPStore = RestSessionStore(session);

function configSession(app, db) {
    // Store session to database
    app.use(session({
        saveUninitialized: false,
        resave: false,
        secret: sessionSecret,
        cookie: {maxAge: 86400 * 1000 * 30 * 3},
        store: new HTTPStore('xxxx')
    }));
}

function configSerializeUser() {
    // Store only userId to session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Retrieve user object from userID in session
    let cache = {};
    passport.deserializeUser(function (id, done) {
        // for simplicity, the cache is never expire
        let userInCache = cache[id];
        if (userInCache) {
            console.log('User (cache): username=', userInCache.username, 'id=', userInCache._id);
            done(null, userInCache);
            return;
        }

        User.findOne({
            _id: id
        }, '-salt -password', function (err, user) {
            if (err) {
                console.log('Fail to deserialize user. Id=', id, err);
            } else {
                console.log('Loaded user ', user._id, user.username);
                cache[id] = user;
            }
            done(err, user);
        });
    });
}
export default function configPassport(app, db) {
    // local strategy store username and password in mongo database
    localStrategy();

    configSerializeUser();

    // Passport store data in session which persists data in mongo table 'session'
    configSession(app, db);
    app.use(passport.initialize());
};
