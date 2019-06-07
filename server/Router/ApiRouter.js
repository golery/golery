import {Router} from "express";
import passport from "passport";

import ApiGoEvent from "../Api/ApiGoEvent";
import ApiFile from "../Api/ApiFile";
import ApiAuth from "../Api/ApiAuth";
import {proxyToGoApi} from "../Api/GoApiProxy";

function sessionMiddleware(req, res) {
    if (req.user) {
        console.log('Username:', req.user.username);
        res.json({username: req.user.username});
    } else {
        console.log('401 No login');
        res.status(401).send('401 - No login');
    }
}

/** Get router for /api/* */
function buildApiRouter() {
    let apiRouter = new Router();
    apiRouter.use(passport.session());

    apiRouter.get('/session', sessionMiddleware);
    apiRouter.use('/secure', _buildApiSecureRouter());
    apiRouter.use('/public', _buildApiPublicRouter());

    apiRouter.all('/pencil/*', proxyToGoApi);
    return apiRouter;
}


// All requess are accesible via /api/public/... are secured (required authentication)
function _buildApiPublicRouter() {
    let route = new Router();
    ApiGoEvent.setupRoute(route);
    ApiAuth.setupPublicRoute(route);
    return route;
}

// All requess are accesible via /api/secure/... are secured (required authentication)
function _buildApiSecureRouter() {
    let route = new Router();
    route.use((req, res, next) => {
        if (!req.user) {
            res.status(401).send('401 - User not found. /www2/api/secure is protected');
        } else {
            next();
        }
    });

    ApiFile.setupRoute(route);
    ApiAuth.setupSecureRoute(route);

    return route;
}

export default function (router) {
    router.use('/api', buildApiRouter());
}
