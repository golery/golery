import {Router} from "express";
import mainPage from "../Pages/MainPage";
import goEventPage from "../Pages/GoEventPage";
import unixTimePage from "../Pages/UnixTimePage";
import jsonFormatterPage from "../Pages/JsonFormatterPage";
import siteMapPage from "../Pages/SiteMapPage";
import pencilServerPage, {pencilLandingPage} from "../Pages/PencilServerPage";
import menuServerPage from "../Pages/MenuServerPage";
import flonServerPage from "../Pages/FlonServerPage";
import pomodoroPage from "../Pages/PomodoroPage";
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
    pencil.get('/landing', pencilLandingPage);
    pencil.get('/:nodeId', pencilServerPage);
    pencil.get('/:rootId/:nodeId', pencilServerPage);

    let menu = new Router();
    menu.get('/', menuServerPage);

    let index = new Router();
    index.get('/', mainPage);
    index.get('/landing', mainPage);
    index.get('/sitemap.txt', siteMapPage);
    index.get('/goevent', goEventPage);
    index.get('/unix-timestamp-converter', unixTimePage);
    index.get('/json-formatter', jsonFormatterPage);

    // install sub routers
    router.use('/pencil', pencil);
    router.use('/menu', menu);
    router.get('/app', mainPage);
    router.get('/pomodoro', pomodoroPage);
    router.get('/flon', flonServerPage);
    router.use('/', index);
}
