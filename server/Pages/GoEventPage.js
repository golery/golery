import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {GoGoPage} from "./Components.generated";

export default function (req, res) {
    let mainHtml = ReactDOM.renderToString(<GoGoPage/>);
    page(req, res, mainHtml, 'GoEventPage',
        {
            title: 'Best way to schedule an event with your friends - GoEvent',
            metaKeywords: 'Doodle Schedule event poll vote opinion choose a date GoEvent',
            metaDescription: 'Best way to schedule an event with your friends - GoEvent',
            openGraph: {
                'og:image': 'http://www.golery.com/images/GoGo/GoGoFacebookOpenGraphImage.jpg'
            }
        });
}
