import React from "react";

import page from "./PageTemplate";
import {TestHtmlContentView} from "./Generated/Components.generated";

export default function (req, res) {
    console.log("Start");
    // let mainHtml = ReactDOM.renderToString(<TestHtmlContentView html={"hello"}/>);
    let mainHtml = "heee";
    page(req, res, mainHtml, 'PencilPage',
        {
            title: 'Pencil - Best tree note tool',
            metaKeywords: 'Pencil Note in tree',
            metaDescription: 'The best notes in tree',
            openGraph: {
                'og:image': 'https://i.imgur.com/SZhyyFb.png'
            }
        });
}
