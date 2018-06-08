import React from "react";
import ReactDOM from "react-dom";
import './css/fonts/font.montserrat.css';
import './css/reset.css';
import MainRouter from './Router';
import GoGoPage from './components/GoGo/GoGoPage';
import UnixTimePage from './components/Tools/UnixTime/UnixTimePage';
import JsonFormatterPage from './components/Tools/JsonFormatter/JsonFormatterPage';
import PencilPage from './components/Pencil/PencilPage';
import PencilLandingPage from './components/Pencil/PencilLandingPage';
import MenuPage from './components/Menu/MenuPage';
import PomodoroPage from './components/Pomodoro/PomodoroPage';
import Polyfill from './services/Polyfill';

const MAIN_COMPONENTS = {
    PencilPage: <PencilPage/>,
    GoEventPage: <GoGoPage/>,
    MainRouter: MainRouter,
    UnixTimePage: <UnixTimePage/>,
    JsonFormatterPage: <JsonFormatterPage/>,
    PencilLandingPage: <PencilLandingPage/>,
    MenuPage: <MenuPage/>,
    PomodoroPage: <PomodoroPage/>
};

// This global method is called to populate correct react component to page
window.bootstrapPage = function (page, serverState) {
    Polyfill();

    function getMainComponent() {
        if (page === "PencilPage") {
            return <PencilPage serverState={serverState}/>;
        }
        return MAIN_COMPONENTS[page];
    }

    let component = getMainComponent();
    if (!component) {
        component = <div>Component {page} is not defined in app.js</div>
    }
    console.log('Server state', serverState);
    ReactDOM.render(component, document.getElementById('REACT_ROOT'));
};
