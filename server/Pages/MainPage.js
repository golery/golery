import React from "react";

import page from "./PageTemplate";
import {GoGoPage} from "./Generated/Components.generated";

/** The main page for www.golery.com/app. There is no server side rendering */
export default function (req, res) {
    page(req, res, "<div>Loading...</div>", 'AppPage',
        {
            title: 'App'
        });
}
