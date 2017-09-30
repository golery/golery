import React from "react";
import ReactDOM from "react-dom";
import './css/fonts/font.montserrat.css';
import './css/reset.css';
import MainRouter from './Router';
import GoGoPage from './components/GoGo/GoGoPage';
import UnixTimePage from './components/Tools/UnixTime/UnixTimePage';
import JsonFormatterPage from './components/Tools/JsonFormatter/JsonFormatterPage';
import PencilPage from './components/Pencil/PencilPage';
import PencilViewPage from './components/Pencil/PencilViewPage';
import Polyfill from './services/Polyfill';

const StateHolder = {state: {html: 'x2'}};

const MAIN_COMPONENTS = {
    PencilPage: <PencilPage/>,
    GoEventPage: <GoGoPage/>,
    MainRouter: MainRouter,
    UnixTimePage: <UnixTimePage/>,
    JsonFormatterPage: <JsonFormatterPage/>
};

// This global method is called to populate correct react component to page
window.bootstrapPage = function (page, state) {
    Polyfill();

    function getMainComponent() {
        if (page === "PencilViewPage")
            return <PencilViewPage state={state}/>;
        return MAIN_COMPONENTS[page];
    };

    let component = getMainComponent();
    if (!component) {
        component = <div>Component {page} is not defined in app.js</div>
    }
    console.log(state);
    StateHolder.state = state;
    ReactDOM.render(component, document.getElementById('REACT_ROOT'));
};
