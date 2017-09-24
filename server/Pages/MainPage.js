import React from "react";

import page from "./PageTemplate";
import {GoGoPage} from "./Generated/Components.generated";

export default function (req, res) {
    let mainHtml = "";
    page(req, res, mainHtml, 'MainRouter',
        {
            title: 'Golery',
            metaKeywords: 'Doodle Schedule event poll vote opinion choose a date GoEvent',
            metaDescription: 'Best way to schedule an event with your friends - GoEvent',
            openGraph: {
                'og:image': 'http://www.golery.com/images/GoGo/GoGoFacebookOpenGraphImage.jpg'
            }
        });
}
