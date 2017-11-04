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
            fullUrl = 'http://' + url;
        }
        let elm = document.createElement('a');
        elm.setAttribute('target', '_blank');
        elm.setAttribute('href', fullUrl);
        elm.innerText = url;
        return elm;
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

    /*_cleanDom(elm) {
        let textContent = elm.textContent;

        if (elm.tagName === 'BR') {
            // br is exceptional case when text content is empty
            return document.createElement('br');
        }

        if (!textContent || !textContent.trim()) {
            // don't clone empty elements
            return null;
        }

        let clone = this._cloneElement(elm);
        let childNodes = elm.childNodes;
        if (childNodes && childNodes.length > 0) {
            for (let child of childNodes) {
                if (child.nodeType === 3) {
                    // text node
                    clone.appendChild(document.createTextNode(child.nodeValue));
                } else if (child.nodeType === 1) {
                    // element
                    let cloneChild = this._cleanDom(child);
                    if (cloneChild) {
                        clone.appendChild(cloneChild);
                    }
                }
                // don't clone comment node
            }
        }

        if (!clone.childNodes || clone.childNodes.length === 0) return null;
        return clone;
    }

    _cloneElement(elm) {
        let tagName = this._mapTagName(elm.tagName);
        let clone = document.createElement(tagName);
        if (tagName === 'A') {
            // copy the href for <a>
            let href = elm.getAttribute('href');
            if (href) {
                clone.setAttribute('href', href);
            }
        }
        return clone;
    }

    _mapTagName(tagName) {
        let tag = tagName;

        for (let key in ELEMENT_MAP) {
            let value = ELEMENT_MAP[key];
            if (value.indexOf(tag) >= 0) {
                tag = key;
            }
        }

        if (SUPPORTED_TAGS.indexOf(tag) >= 0) {
            return tagName;
        }

        console.log('Unrecognized tag', tag);
        return null;
    }*/
}

export default new PasteHtmlProcessor();
