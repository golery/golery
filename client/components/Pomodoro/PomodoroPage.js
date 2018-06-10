import React from 'react';
import PropTypes from 'prop-types';

import styles from './PomodoroPage.css';

const _interval = 1000;
const LOCAL_STORAGE_KEY = "STATE";
const STOPPED = 'STOPPED';
const RUNNING = 'RUNNING';

const ICON_DEFAULT = 'DEFAULT';
const ICON_RUNNING = 'RUNNING';
const ICON_STOP = 'STOP';
const ICON_DATA_RUNNING = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHWSURBVDhPY6AZqK+vZ3L3CvF29Qn2BLGhwsQDD48QUVfvkJuu3sG3nQMChKHC+IGfnx8vkGL0DImJ84lOOOcfl/TaLz7pjU9U/Dmv4IgYkJyHRzQfWDE2ALRxqVdI9MOU1oaPHcc2/594cQ8Ytx/d9B8o9gEkB1IDVY4JfMJjVxfOnfRz9tVD/++8ffX/6rXbYHz7zav/ILGC2ZN+AtWsgipHBY4e4cphOTkvJl/c9//t5y//v3///X/HrgNgDGK/AYqB5EKzsl84ewcpQbUhANDfZSWLZ/w98uQOWAMIr1i9EYxhfJBc8aLpfz1Dosqg2hDALzphft3Wpf+vvX4O15CcUfA/LjkbzgfJgdSA1EK1IYBvRFxX5ep5/88+fwTXsG3Hvv9btu2B8888f/i/YtWc/94RsR1QbQjg6hlknVBX/XbBtaP/v377BdcEwyAxkFx8TeVbkFqoNlTgHRl/sWHniv+b7l78//HLd7hmEBskVr99+X+fiNjzUOWYwMMjUMYvKuFh9foF/6Ze2v9/w50LYDwFyK5cM+8fMEE9AqmBKscOXF0DxXyj4jcGJac/TaiveQPCQUmpz3wi4zaA5KDKCANX1xhud59AIxAGsaHC1AYMDAAihkukriSApAAAAABJRU5ErkJggg==";
const ICON_DATA_STOP = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4T2N8Jyj4n4ECwDhqAMNoGDCMhgHDsAgDAOy6IQEZi+WeAAAAAElFTkSuQmCC';

/** This service updates browser tab title */
class DocumentTitle {
    constructor() {
        this.icon = ICON_DEFAULT;
        this.tag = null;
    }

    _createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }


    updateTitle(title, icon) {
        if (typeof (document) === "undefined") {
            // Don't update during server side rendering
            return;
        }

        if (icon !== this.icon) {
            let iconData;
            if (icon === ICON_RUNNING) {
                iconData = ICON_DATA_RUNNING;
            } else if (icon === ICON_STOP) {
                iconData = ICON_DATA_STOP;
            }
            if (this.tag) {
                this.tag.setAttribute("href", iconData);
            } else {
                this.tag = this._createElementFromHTML(`<link id='headLinkIconDone' rel="icon" type="image/png" href=${iconData}>`);
                document.getElementsByTagName('head')[0].appendChild(this.tag);
                console.log('Add icon tag');
            }
            this.icon = icon;
        }
        document.title = title;
    }
}

export default class PomodoroPage extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = this._loadState();
        this.documentTitle = new DocumentTitle();

        if (this.state.mode === RUNNING) {
            this._startTimer();
        }
    }

    _loadState() {
        let settings = null;
        if (typeof(window) !== "undefined") {
            let json = window.localStorage.getItem(LOCAL_STORAGE_KEY);
            console.log('Loaded state:', json);
            if (json != null) {
                settings = JSON.parse(json);
            }
        }
        if (!settings) {
            settings = {startTime: null, maxSeconds: 25 * 60, mode: STOPPED, inputMinutes: 25};
        }
        console.log('Loaded settings:', settings);
        return settings;
    }

    _saveState() {
        // don't save at server side
        if (typeof(window) === "undefined") return;
        let {startTime, maxSeconds, mode, inputMinutes} = this.state;
        let store = {startTime, maxSeconds, mode, inputMinutes};
        let json = JSON.stringify(store);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, json);
    }

    componentWillUnmount() {
        this._stopTimer();
        this.documentTitle.tag = null;
    }

    _stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    _onStart() {
        this._stopTimer();

        let maxMinutes = parseInt(this.state.inputMinutes);

        this.setState({startTime: Date.now(), maxSeconds: maxMinutes * 60, mode: RUNNING});
        this._startTimer();
    }

    _startTimer() {
        this.timer = setInterval(() => this.tick(), _interval);
    }

    /** Method is called each seconds to update the counter*/
    tick() {
        this.setState({});
    }

    /** @return number in text with 2 digits (for seconds and minutes) */
    _twoDigits(v) {
        return ("0" + v).slice(-2);
    }

    _getElapseText() {
        if (!this.state.startTime) {
            return "--:--";
        }
        let diff = this.state.maxSeconds - Math.trunc((Date.now() - this.state.startTime) / 1000.0);
        let diffAbs = Math.abs(diff);

        let min = this._twoDigits(Math.trunc(diffAbs / 60));
        let sec = this._twoDigits(diffAbs % 60);
        let sign = diff < 0 ? '-' : '';
        return `${sign}${min}:${sec}`;
    }

    _getElapsedSeconds() {
        if (!this.state.startTime) {
            return 0;
        }
        let elapsedSeconds = (Date.now() - this.state.startTime) / 1000;
        if (elapsedSeconds > this.state.maxSeconds) {
            elapsedSeconds = this.state.maxSeconds;
        }
        return elapsedSeconds;
    }

    _renderRunning() {
        let counter = this._getElapsedSeconds();

        const progressColor = '#ff4136';
        let {maxSeconds} = this.state;
        let deg = counter * 360 / maxSeconds;
        var degMask, maskColor;
        if (deg > 180) {
            degMask = 270;
            maskColor = progressColor;
        } else {
            degMask = 90;
            maskColor = "#ccc";
        }
        let maskGradient = `linear-gradient(${degMask}deg, ${maskColor}, ${maskColor} 50%, transparent 50%, transparent)`;


        let degProcess = 90 + deg;
        let processGradient = `linear-gradient(${degProcess}deg, ${progressColor}, ${progressColor} 49%, orangered 49.5%, #ccc 50%)`;
        let backgroundImage = `${maskGradient}, ${processGradient}`;

        let elapseText = this._getElapseText();
        this._updateDocumentTitle(counter, elapseText);

        return <div className={styles.component}>
            {this._renderStartButton()}
            <div className={styles.circleContainer} style={{'backgroundImage': backgroundImage}}>
                <div className={styles.circleSpace}>
                    <div className={styles.circleInner}>
                        {elapseText}
                    </div>
                    <div className={styles.maxMinutes}>
                        {this.state.maxSeconds / 60}m
                    </div>
                </div>
            </div>
        </div>;
    }

    _updateDocumentTitle(elapsedSecond, elapseText) {
        if (typeof (document) === "undefined") return;

        let title, icon;
        if (elapsedSecond >= this.state.maxSeconds) {
            title = "DONE";
            icon = ICON_STOP;
        } else {
            title = elapseText;
            icon = ICON_RUNNING;
        }
        document.title = title;
        this.documentTitle.updateTitle(title, icon);
    }

    _renderStartButton() {
        this._saveState();
        return <div className={styles.inputAndStartButtonHolder}>
            <div className={styles.inputHolder}>
                <input type='text' className={styles.minuteInput} maxLength={2} value={this.state.inputMinutes}
                       placeholder='min'
                       onChange={(e) => this.setState({inputMinutes: e.target.value})}
                />
            </div>
            <div className={styles.buttonStart} onClick={() => this._onStart()}>START</div>
        </div>
    }

    render() {
        return this._renderRunning();
    }
}

PomodoroPage.propTypes = {
    //node: PropTypes.object
};
