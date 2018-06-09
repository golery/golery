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


const ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENV === 'production';
const EXPRESS_PORT = 443;
const MONGO_URL = process.env.MONGOLAB_URI || 'mongodb://mongo/mean-dev';
const WEBAPP_PATH = '/';

function connectMongo() {
    // use ES6 promise
    mongoose.Promise = global.Promise;
    let mongoUrl = MONGO_URL;
    console.log('Connecting to database...', mongoUrl);
    return mongoose.connect(mongoUrl);
}

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
    connectMongo().then(() => {
        console.log('Init express...');
        let app = express();

        configExpressMiddleware(app, mongoose.connection.db);
        configExpressRouter(app);

        app.listen(8080, function () {
            console.log('Access at http://localhost:8080');
        });

        try {
            let sslOptions = {
                key: fs.readFileSync('/data/ssl-certs/key.pem'),
                cert: fs.readFileSync('/data/ssl-certs/fullchain.cert.pem')
            };

            https.createServer(sslOptions, app).listen(8443, function () {
                console.log('Access at http://localhost:8443');
            });
        } catch (e) {
            console.error('Fail to load ssl certs in /data/ssl-certs', e);
        }
    });
}


startServer();
