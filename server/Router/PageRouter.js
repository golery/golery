import {Router} from "express";
import mainPage from "../Pages/MainPage";
import goEventPage from "../Pages/GoEventPage";
import unixTimePage from "../Pages/UnixTimePage";
import jsonFormatterPage from "../Pages/JsonFormatterPage";
import pencilServerPage from "../Pages/PencilServerPage";
import passport from "passport";

/* TO ADD A NEW PAGE
- Add a router in RootRouter.js
- Add a server page in /server/Pages
- Add a map from server ID to components in app.js
- Update sitemap.txt
 */

export default function (router) {
    let pencil = new Router();
    pencil.use(passport.session());
    pencil.get('/', pencilServerPage);
    pencil.get('/:rootId', pencilServerPage);
    pencil.get('/:rootId/:childId', pencilServerPage);
    router.use('/pencil', pencil);

    let index = new Router();
    index.get('/', mainPage);
    index.get('/app', mainPage);
    index.get('/goevent', goEventPage);
    index.get('/unix-timestamp-converter', unixTimePage);
    index.get('/json-formatter', jsonFormatterPage);
    router.use('/', index);
}
