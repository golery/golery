let fs = require('fs');
let Handlebars = require('handlebars');
let prompt = require('prompt-sync')();
let folder = prompt('Folder: ');
let component = prompt('Component: ');

let data = {component: component};
let input = fs.readFileSync('./component.js.hbs', 'utf8');
let template = Handlebars.compile(input);
fs.writeFileSync('../' + folder + '/' + component + '.js', template(data));

input = fs.readFileSync('./component.css.hbs', 'utf8');
template = Handlebars.compile(input);
fs.writeFileSync('../' + folder + '/' + component + '.css', template(data));

