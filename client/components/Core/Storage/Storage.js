export default class Storage {
    constructor(prefix) {
        this.prefix = prefix + ".";
    }

    put(key, text) {
        if (typeof(window) === "undefined") {
            return;
        }
        window.localStorage.setItem(this._getKey(key), text);
    }

    get(key) {
        if (typeof(window) === "undefined") {
            return;
        }

        return window.localStorage.getItem(this._getKey(key));
    }

    putJson(key, value) {
        if (typeof(window) === "undefined") {
            return;
        }

        let json = JSON.stringify(value);
        window.localStorage.setItem(this._getKey(key), json);
    }

    getJson(key) {
        if (typeof(window) === "undefined") {
            return;
        }

        let json = window.localStorage.getItem(this._getKey(key));
        return JSON.parse(json);
    }

    _getKey(key) {
        return this.prefix + key;
    }
}