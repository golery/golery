import React from "react";
import ReactDOM from "react-dom";
import './css/fonts/font.montserrat.css';
import './css/reset.css';
import MainRouter from './Router';
import GoGoPage from './components/GoGo/GoGoPage';
import UnixTimePage from './components/Tools/UnixTime/UnixTimePage';
import JsonFormatterPage from './components/Tools/JsonFormatter/JsonFormatterPage';
import PencilPage from './components/Pencil/PencilPage';
import Polyfill from './services/Polyfill';

const MAIN_COMPONENTS = {
    TestPage: <TestPage/>,
    PencilPage: <PencilPage/>,
    GoEventPage: <GoGoPage/>,
    MainRouter: MainRouter,
    UnixTimePage: <UnixTimePage/>,
    JsonFormatterPage: <JsonFormatterPage/>
};

// This global method is called to populate correct react component to page
window.bootstrapPage = function (page) {
    Polyfill();
    const component = MAIN_COMPONENTS[page];
    if (!component) {
        console.error('Cannot find component for ', page);
        return;
    }
    ReactDOM.render(component, document.getElementById('REACT_ROOT'));
};
