import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {PencilPage, PencilLandingPage} from "./Generated/Components.generated";
import nodeService from "../Api/Node/NodeService";

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

    let mainHtml = ReactDOM.renderToString(<PencilPage serverState={options.serverState}/>);

    if (node && node.name) {
        options.title = node.name;
        options.metaDescription = " " + node.name;
        options.metaKeywords += " " + node.name;
    }
    // options.afterBodyScripts = ["https://cdn.ckeditor.com/ckeditor5/10.1.0/classic/ckeditor.js"];
    options.afterBodyScripts = ["/libs/ckeditor.js"];
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
            console.log("User in req.user=", req.user._id);
            renderPage(req, res, null);
        } else {
            pencilLandingPage(req, res);
        }
        return;
    }

    console.log(req.user, "#########", req.user && req.user._id);



    nodeService.findById(req.user && req.user._id, nodeId).then(nodes => {
        if (nodes === null || !nodes[0]) {
            res.json("Page was moved");
            return;
        }

        let node = nodes[0];
        renderPage(req, res, node);
    });
}
