function _polyFillConsole() {
    if (!console || !console.log) {
        window.console = {
            log: () => {
            },
            error: () => {
            }
        };
    }
}
export default function () {
    _polyFillConsole();
}
