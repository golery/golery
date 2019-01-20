export default class Ga {
    send(category, action, label, value) {
        console.log('Send ga', {category, action, label, value});

        if (typeof(window) === "undefined") return;
        if (typeof(window.ga) === "undefined") return;
        window.ga('send', 'event', category, action, label, value);
    }
}