import React from "react";
import ReactDOM from "react-dom/server";

import page from "./PageTemplate";
import {PomodoroPage} from "./Generated/Components.generated";

export default function (req, res) {
    let mainHtml = ReactDOM.renderToString(<PomodoroPage/>);
    page(req, res, mainHtml, 'PomodoroPage',
        {
            title: 'Pomodoro Timer',
            metaKeywords: 'Pomodoro Timer',
            metaDescription: 'Pomodoro Timer',
            openGraph: {
                'og:image': 'https://i.imgur.com/JJcVFSC.jpg'
            }
        });
}
