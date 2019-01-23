    // https://github.com/jankal/restsession/blob/master/index.js
import axios from 'axios';
import util from 'util';

function    SessionStore(session) {
    var Store = session.Store;

    function RestStore (endpoint) {
        var self = this;

        endpoint = endpoint || '127.0.0.1';
        Store.call(self);

        self.endpoint = endpoint;
    }

    RestStore.prototype.__proto__ = Store.prototype;

    RestStore.prototype.get = function (sid, callback) {
        let url = this.endpoint + '/api/secure/session/' + sid;
        console.log('Session.Get', url);
        axios.get(url).then(function ({data}) {
            console.log(data);
            if (!data) {
                callback();
            } else {
                console.log('Sesion data: ', data);
                callback(null, data);
            }
        }).catch(function (e) {
            if (typeof e.response !== 'undefined' && e.response.status === 404) {
                callback(null, null);
                return;
            }
            callback(e);
        });
    };

    RestStore.prototype.set = function (sid, data, callback) {
        let url = this.endpoint + '/api/secure/session/' + sid;
        console.log('Session.Set ', sid, data);
        axios.put(url, data).then(function () {
            callback();
        }).catch(function (e) {
            callback(e);
        });
    };

    RestStore.prototype.destroy = function (sid, callback) {
        console.log('Session.Destroy');
        axios.delete(this.endpoint + '/' + sid).then(function () {
            callback();
        }).catch(function (e) {
            callback(e);
        });
    };

    RestStore.prototype.clear = function (callback) {
        console.log('Session.Clear');
        axios.delete(this.endpoint).then(function () {
            callback();
        }).catch(function (e) {
            callback(e);
        });
    };

    RestStore.prototype.all = function (callback) {
        axios.get(this.endpoint).then(function ({data}) {
            callback(null, data);
        }).catch(function (e) {
            callback(e);
        });
    };

    RestStore.prototype.touch = function (sid, data, callback) {
        axios.post(this.endpoint + '/' + sid + '?ping', data).then(function () {
            callback();
        }).catch(function (e) {
            callback(e);
        });
    };
    return RestStore;
}

export default SessionStore;
