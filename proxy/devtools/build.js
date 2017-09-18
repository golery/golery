const fs = require('fs-extra');
const BUILD = "build/release";

//clean();
copy();

function clean() {
    fs.removeSync('build');
}
function copy() {
    fs.removeSync('build');
    fs.copySync('server', BUILD + '/server');
    fs.copySync('package.json', BUILD + '/package.json');
}
