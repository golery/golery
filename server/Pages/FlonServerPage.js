import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {FlonPage} from "./Generated/Components.generated";

function getPageOptions() {
    return {
        title: 'Flon - DB documentation system',
        metaKeywords: 'Database schema documentation',
        metaDescription: 'Database schema documentation',
        openGraph: {
            'og:image': 'https://i.imgur.com/SZhyyFb.png'
        }
    };
}

function renderPage(req, res, node) {
    let options = getPageOptions();
    options.serverState = {initialNode: node};

    let mainHtml = ReactDOM.renderToString(<div/>);
    page(req, res, mainHtml, 'FlonPage', options);
}

export default function (req, res) {
    renderPage(req, res);
}
