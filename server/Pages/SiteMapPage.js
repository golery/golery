/** Generate sitemap.txt for crawler. It has static pages + public pencil pages */
import React from "react";
import nodeService from "../Api/Node/NodeService";

const host = "https://www.golery.com";

function getStatic() {
    let s = "";
    s += host + "\n";
    s += host + "/landing" + "\n";
    s += host + "/pencil" + "\n";
    s += host + "/goevent" + "\n";
    s += host + "/unix-timestamp-converter" + "\n";
    s += host + "/json-formatter" + "\n";
    s += host + "/pomodoro" + "\n";
    return s;
}

function getLinksToNodes(nodeIds) {
    let s = "";
    for (let node of nodeIds) {
        s += host + "/pencil/" + node + "\n";
    }
    return s;
}

export default function (req, res) {
    let s = getStatic();
    nodeService.findAllPublicNodeId().then(nodeIds => {
        console.log(nodeIds);
        s += getLinksToNodes(nodeIds);
        res.type("text/plain; charset=UTF-8").send(s);
    }).catch(e => {
        console.error("Fail to query all public node", e);
        res.type("text/plain; charset=UTF-8").send(s);
    });
}
