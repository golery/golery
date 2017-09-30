import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {PencilPage} from "./Generated/Components.generated";
import nodeService from "../Api/Node/NodeService";

export default function (req, res) {
    let mainHtml = ReactDOM.renderToString(<PencilPage/>);
    nodeService.findOneNode(null, req.params.rootId).then(node => {
        let serverState = {initialNode: node[0]};
        page(req, res, mainHtml, 'PencilPage',
            {
                title: 'Pencil - Best tree note tool',
                metaKeywords: 'Pencil Note in tree',
                metaDescription: 'The best notes in tree',
                openGraph: {
                    'og:image': 'https://i.imgur.com/SZhyyFb.png'
                },
                serverState: serverState
            });
    });
}
