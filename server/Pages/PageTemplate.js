/** This modules generates boilerplat for a page (ex: google analytics, open graphs tags...) */
import React from "react";
import ReactDOM from "react-dom/server";
import hashes from "./Generated/webpack.manifest.json"

function getGoogleAnalytics(req) {
    /** When run at local, do not use google analytics */
    if (req.hostname === 'localhost' || req.hostname === '127.0.0.1') return `/*Disable google analytics due to hostname: ${req.hostname}*/`;
    /** When run with non-user account, do not use google analytics */
    if (req.cookies.disableStats === 'true') return '/** Disable google analytics due to cookie disableStats */';

    let googleAnalytics = `
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject'] = r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-29120464-3', 'auto');
        ga('send', 'pageview');`;
    return googleAnalytics;
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
export default function (req, res, mainHtml, bootStrap, {title, metaKeywords, metaDescription, openGraph, serverState, afterBodyScripts}) {
    let vendor = "/" + hashes["vendors~app.js"];
    let app = "/" + hashes["app.js"];
    let css = "/" + hashes["app.css"];

    // Fb open graph tags https://developers.facebook.com/docs/sharing/webmasters#markup
    let openGraphElm = generateOpenGraphTags(openGraph);
    let stateJson = JSON.stringify(serverState);
    let htmlScripts = [];
    if (afterBodyScripts) {
        htmlScripts = afterBodyScripts.map((script, index) =>
            <script key={index} src={script}/>);
    }

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
            <script src={vendor}></script>
            <script src={app}></script>
        </head>
        <body>
        <div id="REACT_ROOT" dangerouslySetInnerHTML={{__html: mainHtml}}/>
        </body>
        <head>
            <script dangerouslySetInnerHTML={{
                __html:
                    `var __INITIAL_STATE__=${stateJson}; bootstrapPage('${bootStrap}', __INITIAL_STATE__);`
            }}/>
            <script dangerouslySetInnerHTML={{__html: getGoogleAnalytics(req)}}/>
            {htmlScripts}
        </head>
        </html>
    );
    res.send(html);
}
