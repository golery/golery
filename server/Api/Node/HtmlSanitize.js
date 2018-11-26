import sanitizeHtml from "sanitize-html";

const allowedAttributes = Object.assign({
    'code': [
        'class'
    ]
}, sanitizeHtml.defaults.allowedAttributes);

const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['u', 'img']);

function getSanitizedHtml(html) {
    if (!html) return null;

    // keep some special class name (ex: x-pencil-code)
    // I don't know why the wild card '*' on tag does not work as in specs of library
    let clean = sanitizeHtml(html, {
        allowedAttributes: allowedAttributes,
        allowedTags: allowedTags,
        selfClosing: sanitizeHtml.defaults.selfClosing
    });

    console.log("Before Sanitized Html: ", html);
    console.log("Sanitized Html: ", clean);
    return clean;
}

export default getSanitizedHtml;