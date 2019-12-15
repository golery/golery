import express, {Router} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import https from 'https';
import fs from 'fs';

import localStrategy from "./Api/Passport/Strategies/local";
import apiRouter from "./Router/ApiRouter";
import pageRouter from "./Router/PageRouter";

import {MAX_UPLOAD_FILE_SIZE} from "./Api/ApiFile";
import Config from "./config";
import session from "express-session";
import RestSessionStore from "./Api/RestSessionStore";
import passport from "passport/lib";

const WEBAPP_PATH = '/';

/**
 * Middle ware allows to attach and retrieve data from sessionId.
 * Passport middleware use session to store user info
 **/
function sessionMiddleware() {
    const sessionSecret = 'GoLeRy@2019#Ny!';
    const HTTPStore = RestSessionStore(session);
    return session({
        saveUninitialized: false,
        resave: false,
        secret: sessionSecret,
        cookie: {maxAge: 86400 * 1000 * 30 * 3},
        store: new HTTPStore()
    });
}

function passportMiddleware() {
    // local strategy store username and password in mongo database
    localStrategy();

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        // load more info from db if needed (ex: block account)
        done(null, {id});
    });


    return passport.initialize();
}


function configExpressRouter(app) {
    let router = Router();

    pageRouter(router);
    apiRouter(router);

    router.use('/', express.static(path.join(__dirname, 'Static')));
    router.use('/', express.static(path.join(__dirname, '..', 'client')));

    // all route are relative to /www2
    app.use(WEBAPP_PATH, router);
}

function configExpressMiddleware(app) {
    //app.use(require('morgan')('combined'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    // support upload image max 1mb
    app.use(bodyParser.raw({limit: MAX_UPLOAD_FILE_SIZE}));

    app.use(sessionMiddleware());
    app.use(passportMiddleware());
}


function startServer() {
    console.log('Init express...');
    let app = express();

    configExpressMiddleware(app);
    configExpressRouter(app);

    app.listen(Config.httpPort, function () {
        console.log('Access at http://localhost:', Config.httpPort);
    });

    try {
        let sslOptions = {
            key: fs.readFileSync('/data/app-configs/www/ssl-certs/live/www.golery.com/privkey.pem'),
            cert: fs.readFileSync('/data/app-configs/www/ssl-certs/live/www.golery.com/fullchain.pem')
        };

        https.createServer(sslOptions, app).listen(Config.httpsPort, function () {
            console.log('Access at http://localhost:', Config.httpsPort);
        });
    } catch (e) {
        console.error('Fail to load ssl certs in /data/ssl-certs', e);
    }
}

startServer();
