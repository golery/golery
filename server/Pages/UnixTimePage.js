import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {UnixTimePage} from "./Generated/Components.generated";

export default function (req, res) {
    let mainHtml = ReactDOM.renderToString(<UnixTimePage/>);
    page(req, res, mainHtml, 'UnixTimePage',
        {
            title: 'Unix Timestamp converter',
            metaKeywords: 'Unix timestamp converter',
            metaDescription: 'Unix timestamp converter',
            openGraph: {
                'og:image': 'https://i.imgur.com/JJcVFSC.jpg'
            }
        });
}
