import passport from "passport";
// import connectMongo from "connect-mongo";
import session from "express-session";
import localStrategy from "../Api/Auth/Passport/Strategies/local";
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
        store: new HTTPStore('http://localhost:8100')
    }));
}

// Not all user data is stored into session.
// Passport.serializedUser extracts the id
// Passport.deserializedUser reloads full user info from id
function configSerializeUser() {
    // Store only userId to session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function (id, done) {
        // load more info from db if needed (ex: block account)
        done(null, {id});
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
