import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {JsonFormatterPage} from "./Generated/Components.generated";

export default function (req, res) {
    let mainHtml = ReactDOM.renderToString(<JsonFormatterPage/>);
    page(req, res, mainHtml, 'JsonFormatterPage',
        {
            title: 'JSON Viewer Formatter',
            metaKeywords: 'JSON viewer formatter',
            metaDescription: 'JSON viewer formatter',
            openGraph: {
                'og:image': 'https://i.imgur.com/Xf5VzwI.png'
            }
        });
}
