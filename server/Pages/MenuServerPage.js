import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {MenuPage} from "./Generated/Components.generated";

function getPageOptions() {
    return {
        title: 'Pencil - Best hierarchical note taking',
        metaKeywords: 'Hierarchical note taking Tree note',
        metaDescription: 'The best notes in tree. Distract free writing tool',
        openGraph: {
            'og:image': 'https://i.imgur.com/SZhyyFb.png'
        }
    };
}

function renderPage(req, res, node) {
    let options = getPageOptions();
    options.serverState = {initialNode: node};

    let mainHtml = ReactDOM.renderToString(<MenuPage serverState={options.serverState}/>);
    page(req, res, mainHtml, 'MenuPage', options);
}

export default function (req, res) {
    renderPage(req, res);
}
