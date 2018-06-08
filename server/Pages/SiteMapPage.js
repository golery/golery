/** Generate sitemap.txt for crawler. It has static pages + public pencil pages */
import React from "react";
import nodeService from "../Api/Node/NodeService";

function getStatic() {
    let s = "";
    s += "http://www.golery.com" + "\n";
    s += "http://www.golery.com/landing" + "\n";
    s += "http://www.golery.com/pencil" + "\n";
    s += "http://www.golery.com/goevent" + "\n";
    s += "http://www.golery.com/unix-timestamp-converter" + "\n";
    s += "http://www.golery.com/json-formatter" + "\n";
    s += "http://www.golery.com/pomodoro" + "\n";
    return s;
}

function getLinksToNodes(nodeIds) {
    let s = "";
    for (let node of nodeIds) {
        s += "http://www.golery.com/pencil/" + node._id + "\n";
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
