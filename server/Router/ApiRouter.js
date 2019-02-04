import {Router} from "express";
import passport from "passport";

import ApiGoEvent from "../Api/ApiGoEvent";
import ApiFile from "../Api/ApiFile";
import ApiAuth from "../Api/ApiAuth";
import GoApiProxy from "../Api/GoApiProxy";

function buildApiRouter() {
    let apiRouter = new Router();

    // /api/secure/ require authentication and needs req.user object
    apiRouter.use('/secure', _buildApiSecureRouter(apiRouter));
    apiRouter.use('/public', _buildApiPublicRouter(apiRouter));

    // /api/session
    // Get current userId or 401 if not login
    apiRouter.use('/session', passport.session());
    apiRouter.get('/session', function (req, res) {
        if (req.user) {
            res.json({username: req.user.username});
        } else {
            res.status(401).send('401 - No login');
        }
    });

    return apiRouter;
}

function configGetUser(apiSecure) {
    apiSecure.use(passport.session());
    // enforce user
    apiSecure.use(function (req, res, next) {
        if (!req.user) {
            res.status(401).send('401 - User not found. /www2/api/secure is protected');
        } else {
            next();
        }
    });
}

// All requess are accesible via /api/public/... are secured (required authentication)
function _buildApiPublicRouter() {
    let route = new Router();
    ApiGoEvent.setupRoute(route);
    ApiAuth.setupPublicRoute(route);
    GoApiProxy.setupPublicRoute(route);
    return route;
}

// All requess are accesible via /api/secure/... are secured (required authentication)
function _buildApiSecureRouter() {
    let route = new Router();
    configGetUser(route);

    ApiFile.setupRoute(route);
    ApiAuth.setupSecureRoute(route);
    GoApiProxy.setupSecureRoute(route);

    return route;
}

export default function (router) {
    // http://localhost:3001/www2/api/node
    router.use('/api', buildApiRouter());
}
