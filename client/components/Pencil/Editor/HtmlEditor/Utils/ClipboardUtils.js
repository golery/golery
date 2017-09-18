export default class ClipboardUtils {
    static getFirstImageBlobUrl(e) {
        let clipboardData = e.clipboardData;
        if (clipboardData === null) {
            console.log('No clipboard data');
            return null;
        }

        let items = clipboardData.items;
        for (let i = 0; i < items.length; ++i) {
            if (items[i].kind == 'file' &&
                items[i].type.indexOf('image/') !== -1) {

                let blob = items[i].getAsFile();
                window.URL = window.URL || window.webkitURL;
                return window.URL.createObjectURL(blob);
            }
        }
    }
}
