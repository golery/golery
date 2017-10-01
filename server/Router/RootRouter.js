import {Router} from "express";
import mainPage from "../Pages/MainPage";
import goEventPage from "../Pages/GoEventPage";
import unixTimePage from "../Pages/UnixTimePage";
import jsonFormatterPage from "../Pages/JsonFormatterPage";
import pencilServerPage from "../Pages/PencilServerPage";

/* TO ADD A NEW PAGE
- Add a router in RootRouter.js
- Add a server page in /server/Pages
- Add a map from server ID to components in app.js
- Update sitemap.txt
 */
export default function (router) {
    let index = new Router();
    index.get('/', mainPage);
    index.get('/app', mainPage);
    index.get('/goevent', goEventPage);
    index.get('/unix-timestamp-converter', unixTimePage);
    index.get('/json-formatter', jsonFormatterPage);
    index.get('/pencil', pencilServerPage);
    index.get('/pencil/:rootId', pencilServerPage);
    index.get('/pencil/:rootId/:childId', pencilServerPage);

    router.use('/', index);
}
