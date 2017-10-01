export default class TextSelection {
    static saveSelection() {
        if (window.getSelection) {
            let sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    }

    static restoreSelection(range) {
        if (range) {
            if (window.getSelection) {
                let sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && range.select) {
                range.select();
            }
        }
    }

    /* https://stackoverflow.com/questions/12603397/calculate-width-height-of-the-selected-text-javascript */
    /** *@return object with top, left, right, bottom attributes */
    static getSelectionBounds() {
        if (window.getSelection) {
            let sel = window.getSelection();
            if (sel.rangeCount) {
                let range = sel.getRangeAt(0).cloneRange();
                if (range.getBoundingClientRect) {
                    return range.getBoundingClientRect();
                }
            }
        } else if (document.selection) {
            // for IE < 11
            let sel = document.selection
            if (sel.type !== "Control") {
                return sel.createRange();
            }
        }

        return null;
    }

    /** @return string - if there is no selection, return empty string */
    static getSelectionText() {
        if (window.getSelection) {
            // even if there is no selection, chrome returns empty string
            return window.getSelection().toString();
        } else if (document.selection) {
            // IE <= 10
            return document.selection.createRange().text;
        }
        return '';
    }

    static hasSelection() {
        if (window.getSelection) {
            let selection = window.getSelection();
            return selection && selection.anchorNode === selection.focusNode
                    && selection.anchorOffset === selection.focusOffset;
        } else if (document.selection) {
            return TextSelection.getSelectionText() === '';
        }
        return fales;
    }
}
