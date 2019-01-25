const ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENV === 'production';

const Config = {
    goApiHost: "http://host.docker.internal:8100",
    // goApiHost: 'http://localhost:8100',
    mongoUrl: process.env.MONGOLAB_URI || 'mongodb://localhost/mean-dev',
    httpsPort: 443,
    httpPort: 80
};

console.log('Config:', Config);

export default Config;