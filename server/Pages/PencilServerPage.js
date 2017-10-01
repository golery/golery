import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {PencilPage} from "./Generated/Components.generated";
import nodeService from "../Api/Node/NodeService";

function renderPage(req, res, node) {
    let serverState = {initialNode: node};
    let mainHtml = ReactDOM.renderToString(<PencilPage/>);
    page(req, res, mainHtml, 'PencilPage', {
            title: 'Pencil - Best tree note tool',
            metaKeywords: 'Pencil Note in tree',
            metaDescription: 'The best notes in tree',
            openGraph: {
                'og:image': 'https://i.imgur.com/SZhyyFb.png'
            },
            serverState: serverState
        });
}

export default function (req, res) {
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
