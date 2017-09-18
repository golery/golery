/** USAGE: A proxy listen on port 8080 and forward request to www or react project */
const PROXY_PORT = 8080;
const proxy = require('redbird')({port: PROXY_PORT});

proxy.register("www.gresw.com", "http://127.0.0.1:3000");


proxy.register("www.golery.com", "http://127.0.0.1:3001");
proxy.register("golery.com", "http://127.0.0.1:3001");

/* For developing at local */
proxy.register("gresw.localhost", "http://127.0.0.1:3000");
proxy.register("golery.localhost", "http://127.0.0.1:3001");

