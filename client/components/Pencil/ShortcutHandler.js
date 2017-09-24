export default class ShortcutHandler {
    constructor() {
        if (typeof document !== 'undefined') {
            // when render at server side, there is no document
            document.addEventListener('keydown', e => {
                let key = event.key;
                //console.log(key);
                let listener = this.map[key];
                if (listener) {
                    listener(e);
                }
            });
        }

        this.map = {};
    }

    register(scope, key, listener) {
        this.map[key] = listener;
    }
}
