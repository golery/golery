import sanitizeHtml from 'sanitize-html';

/*const ELEMENT_MAP = {
    DIV: ['H1', 'H2', 'H3', 'PRE', 'CODE', 'IMG', 'SECTION'],
    B: ['EM', 'STRONG']
};

const SUPPORTED_TAGS = ['DIV', 'SPAN', 'B', 'P', 'BR', 'A', 'OL', 'UL', 'LI'];*/

const LINK_REGEX = /^((((https?|ftp|file):\/\/)|(www\.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])$/i;

const HTML_ENTITY_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    "\r": '<br/>',
    "\n": '<br/>'
};

/**
 * Clean up html when pasting from clipboard
 * - Remove tag with no text (except <br/>
 * - Map tags to supported tags, remove all unsupported tag (ex: script, table)
 * - Copy tag <a> with href
 * - Remove image tags
 * - If the clipboard contains only hyperlink, then insert hyperlink
 * - If the clipboard contains only text (user pressed ctrl-shift-v), <br> are inserted
 * */
class PasteHtmlProcessor {
    process(event) {
        let text = event.clipboardData.getData('text/plain');
        if (!text) {
            return;
        }

        if (LINK_REGEX.test(text)) {
            return this._createAnchorTag(text);
        }

        let html = event.clipboardData.getData('text/html');
        if (html) {
            html = sanitizeHtml(html);
            return this._htmlToNode(html);
        } else {
            return this._textToNode(text);
        }
    }

    /** When user press ctrl-shift-v, replace line break by <br> and encode html entities */
    _textToNode(text) {
        const escapeRegex = /([&<>"'\/\r\n])/g;
        let html = text.replace(escapeRegex, function (match) {
            return HTML_ENTITY_ESCAPE_MAP[match];
        });
        let elm = document.createElement('span');
        elm.innerHTML = html;
        if (elm.children.length === 0) {
            // if text only, we don't need to insert tag <span> wrapper
            return elm.childNodes[0];
        }
        return elm;
    }

    _createAnchorTag(url) {
        let fullUrl = url;
        if (url.indexOf('www') === 0) {
            fullUrl = 'https://' + url;
        }

        let youtubeId = this._detectYoutubeLink(url);
        if (youtubeId) {
            let elm = document.createElement('div');
            elm.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allowfullscreen/>`;
            return elm.firstChild;
        }

        let elm = document.createElement('a');
        elm.setAttribute('target', '_blank');
        elm.setAttribute('href', fullUrl);
        elm.innerText = url;
        return elm;
    }

    _detectYoutubeLink(url) {
        let match = /https:\/\/www.youtube.com\/watch\?v=([a-zA-Z0-9]*)/.exec(url);
        if (match && match[1]) return match[1];
        return null;
    }

    /** Clean up the paste html and convert it to DOM node */
    _htmlToNode(html) {
        if (!html) return null;

        let elm = document.createElement('span');
        elm.innerHTML = html;
        /*console.log('Clean up', elm);
        elm = this._cleanDom(elm);*/

        if (!elm) return;

        if (elm.children.length === 0) {
            // if text only, we don't need to insert tag <span> wrapper
            return elm.childNodes[0];
        }
        return elm;
    }
}

export default new PasteHtmlProcessor();
