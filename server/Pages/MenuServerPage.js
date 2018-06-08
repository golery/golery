import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {MenuPage} from "./Generated/Components.generated";

function getPageOptions() {
    return {
        title: 'eMenu - Quick menu',
        metaKeywords: 'Quick menu eMenu Digital menu',
        metaDescription: 'Best eMenu for restaurant',
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
