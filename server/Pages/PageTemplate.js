import React from "react";
import ReactDOM from "react-dom/server";
import hashes from "./Generated/webpack.manifest.json"

function getGoogleAnalytics() {
    return `
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject'] = r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-29120464-3', 'auto');
        ga('send', 'pageview');`;
}

function generateOpenGraphTags(openGraph) {
    if (!openGraph) return null;
    for (let key of Object.keys(openGraph)) {
        return <meta property={key} content={openGraph[key]}/>;
    }
}

/**
 * @param bootStrap: ID of variable in MAIN_COMPONENTS in client/app.js
 * */
export default function (req, res, mainHtml, bootStrap, {title, metaKeywords, metaDescription, openGraph, state}) {
    let manifest = "/" + hashes["manifest.js"];
    let vendor = "/" + hashes["vendor.js"];
    let app = "/" + hashes["app.js"];
    let css = "/" + hashes["app.css"];

    // Fb open graph tags https://developers.facebook.com/docs/sharing/webmasters#markup
    let openGraphElm = generateOpenGraphTags(openGraph);
    let stateJson = JSON.stringify(state);
    let html = ReactDOM.renderToString(
        <html>
        <head>
            <title>{title}</title>
            <meta name="viewport" content=" width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
            <meta name="keywords" content={metaKeywords}/>
            <meta name="description" content={metaDescription}/>
            {openGraphElm}
            <link rel="stylesheet" href={css}/>
            <link href="/font/font-awesome/css/font-awesome.min.css" rel="stylesheet"/>
            <link href="https://fonts.googleapis.com/css?family=Anton" rel="stylesheet"/>
            <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,400i,500,700,900" rel="stylesheet"/>
            <script src={manifest}></script>
            <script src={vendor}></script>
            <script src={app}></script>
        </head>
        <body>
        <div id="REACT_ROOT" dangerouslySetInnerHTML={{__html: mainHtml}}/>
        </body>
        <head>
            <script dangerouslySetInnerHTML={{__html:
                `var __INITIAL_STATE__=${stateJson}; bootstrapPage('${bootStrap}', __INITIAL_STATE__);`}}/>
            <script dangerouslySetInnerHTML={{__html: getGoogleAnalytics()}}/>
        </head>
        </html>
    );
    res.send(html);
}
