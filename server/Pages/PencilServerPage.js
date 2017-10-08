import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {PencilPage, PencilLandingPage} from "./Generated/Components.generated";
import nodeService from "../Api/Node/NodeService";

function getPageOptions() {
    return {
        title: 'Pencil - Best tree note',
        metaKeywords: 'Pencil Take note in tree',
        metaDescription: 'The best notes in tree. Distract free writing tool',
        openGraph: {
            'og:image': 'https://i.imgur.com/SZhyyFb.png'
        }
    };
}

function renderPage(req, res, node) {
    let mainHtml = ReactDOM.renderToString(<PencilPage/>);
    let options = getPageOptions();
    options.serverState = {initialNode: node};
    page(req, res, mainHtml, 'PencilPage', options);
}

export function pencilLandingPage (req, res) {
    let mainHtml = ReactDOM.renderToString(<PencilLandingPage/>);
    page(req, res, mainHtml, 'PencilLandingPage', getPageOptions());
}

export default function (req, res) {
    if (!req.user) {
        pencilLandingPage(req, res);
    }

    let {rootId, childId} = req.params;
    let loadId = childId ? childId : rootId;
    if (loadId) {
        nodeService.findOneNode(null, loadId).then(nodes => {
            renderPage(req, res, nodes[0]);
        });
    } else {
        renderPage(req, res, null);
    }
}
