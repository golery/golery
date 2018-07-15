const  postcssPresetEnv=require('postcss-preset-env');

var x = postcssPresetEnv.process('.my {}');
setTimeout(function() {console.log(x);}, 2000 );
//console.log(x);
