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
    let options = getPageOptions();
    options.serverState = {initialNode: node};

    let mainHtml = ReactDOM.renderToString(<PencilPage serverState={options.serverState}/>);

    if (node && node.name) {
        options.title = node.name;
        options.metaDescription = " " + node.name;
        options.metaKeywords += " " + node.name;
    }
    page(req, res, mainHtml, 'PencilPage', options);
}

export function pencilLandingPage(req, res) {
    let mainHtml = ReactDOM.renderToString(<PencilLandingPage/>);
    page(req, res, mainHtml, 'PencilLandingPage', getPageOptions());
}

export default function (req, res) {
    let {rootId, nodeId} = req.params;

    if (!nodeId) {
        if (req.user) {
            renderPage(req, res, null);
        } else {
            pencilLandingPage(req, res);
        }
        return;
    }

    nodeService.findById(nodeId).then(node => {
        if (node === null) {
            res.json("Page was moved");
            return;
        }

        // 0: private, 1: public
        const userId = req.user ? req.user.id : null;
        if (node.access === 1 || (node.access === 0 && req.user && node.user.equals(userId))) {
            console.log("Render pencil page with node ", nodeId);
            renderPage(req, res, node);
        } else {
            console.log("Block access to node ", nodeId, '. Node.access=', node.access, ', node.user=', node.user, ', req user=', userId);
            res.json("This page was set to private access");
        }
    });
}
