import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {PencilPage} from "./Components.generated";

export default function (req, res) {
    //let mainHtml = ReactDOM.renderToString(<PencilPage/>);
    page(req, res, "a", 'PencilPage',
        {
            title: 'Pencil',
            metaKeywords: 'Pencil Note in tree',
            metaDescription: 'The best notes in tree',
            openGraph: {
                'og:image': 'https://i.imgur.com/SZhyyFb.png'
            }
        });
}
