import express, {Router} from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import https from 'https';
import fs from 'fs';

import configPassport from "./user/passport.config";
import apiRouter from "./Router/ApiRouter";
import pageRouter from "./Router/PageRouter";

import {MAX_UPLOAD_FILE_SIZE} from "./Api/ApiFile";
import Config from "./config";

const WEBAPP_PATH = '/';

function configExpressMiddleware(app, db) {
    // log request
    //app.use(require('morgan')('combined'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    // support upload image max 1mb
    app.use(bodyParser.raw({limit: MAX_UPLOAD_FILE_SIZE}));
    configPassport(app, db);
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

function startServer() {
    console.log('Init express...');
    let app = express();

    configExpressMiddleware(app, mongoose.connection.db);
    configExpressRouter(app);

    app.listen(Config.httpPort, function () {
        console.log('Access at http://localhost:', Config.httpPort);
    });

    try {
        let sslOptions = {
            key: fs.readFileSync('/data/ssl-certs/key.pem'),
            cert: fs.readFileSync('/data/ssl-certs/fullchain.cert.pem')
        };

        https.createServer(sslOptions, app).listen(Config.httpsPort, function () {
            console.log('Access at http://localhost:', Config.httpsPort);
        });
    } catch (e) {
        console.error('Fail to load ssl certs in /data/ssl-certs', e);
    }
}

startServer();
