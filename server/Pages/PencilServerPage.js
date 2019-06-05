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

function renderPage(req, res, rootId, node, space) {
    let options = getPageOptions();
    options.serverState = {initialNode: node, rootId, space};

    let mainHtml = ReactDOM.renderToString(<PencilPage serverState={options.serverState}/>);

    if (node && node.name) {
        options.title = node.name;
        options.metaDescription = ` ${node.name}`;
        options.metaKeywords += ` ${node.name}`;
    }
    page(req, res, mainHtml, 'PencilPage', options);
}

export function pencilLandingPage(req, res) {
    let mainHtml = ReactDOM.renderToString(<PencilLandingPage/>);
    page(req, res, mainHtml, 'PencilLandingPage', getPageOptions());
}

export default async function (req, res) {
    // Ref. PageRouter for url patterns
    let {rootId, nodeId} = req.params;

    try {
        if (nodeId === 'pub') {
            let {node} = await nodeService.querySpace(req.user && req.user.id, nodeId);
            if (!node) {
                res.json(`Space not found or moved ${nodeId}`);
                return;
            }

            console.log("Render page %s in space %s", node.id, nodeId);
            renderPage(req, res, null, node, 'pub');
        } else if (nodeId) {
            nodeService.findById(req.user && req.user.id, nodeId).then((nodes) => {
                if (nodes === null || !nodes[0]) {
                    res.json("Page was moved");
                    return;
                }

                console.log("Render page ", nodeId);
                renderPage(req, res, rootId, nodes[0]);
            });
        } else if (req.user) {
            console.log("User in req.user=", req.user._id);
            renderPage(req, res, null, null);
        } else {
            pencilLandingPage(req, res);
        }
    } catch (e) {
        console.log('PencilServerPage.Fail to load page. Return 500', e);
        res.status(500).send('Error');
    }
}
