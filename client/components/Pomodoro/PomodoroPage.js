import React from 'react';
import PropTypes from 'prop-types';

import styles from './PomodoroPage.css';

// Set not null to force a specific short duration for development
const DEBUG_FORCE_SECONDS = null;

const _interval = 1000;
const LOCAL_STORAGE_KEY = "STATE";
const MODE_READY_TO_START = 'STOPPED';
const MODE_RUNNING = 'RUNNING';
const MODE_PAUSE = 'PAUSE';
const MODE_DONE = 'DONE';

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
        this.documentTitle = new DocumentTitle();

        this.state = {
            mode: MODE_READY_TO_START,
            startTime: null,
            pomoDurationSec: 25 * 60,
            inputMinutes: 25,
            lastResume: null,
            msFromLastPause: null,
            elapsedMsBeforeLastPause: null};
        this.state = this._loadState(this.state);
        // user comes back at running state
        if (this.state.mode === MODE_RUNNING) {
            this._startTimer();
        }
    }

    _loadState(currentState) {
        let settings = null;
        if (typeof(window) !== "undefined") {
            let json = window.localStorage.getItem(LOCAL_STORAGE_KEY);
            console.log('Loaded state:', json);
            if (json !== null) {
                settings = JSON.parse(json);
            }
            console.log('Loaded settings:', settings);
        }
        if (!settings || !settings.pomoDurationSec || (settings.mode === MODE_RUNNING && !settings.startTime)) {
            settings = currentState;
        }
        return settings;
    }

    _saveState() {
        // don't save at server side
        if (typeof(window) === "undefined") return;
        let json = JSON.stringify(this.state);
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


    _startTimer() {
        this.timer = setInterval(() => this.tick(), _interval);
    }

    /** Method is called each seconds to update the counter*/
    tick() {
        if (this.state.mode !== MODE_RUNNING) {
            console.error("Timer is running when not in mode running.Mode=",this.state.mode);
            this._stopTimer();
            return;
        }

        let elapsedMs = this._getElapseMs();
        if (elapsedMs >= this.state.pomoDurationSec*1000) {
            this._stopTimer();
            this._playMusic();
            this.setState({mode: MODE_DONE});
        } else {
            // elapseSec is not used, it just a variable to avoid update if elapse sec is not changed
            // Method render() recomputes the elapse time for more precision
            this.setState({elapseSec: elapsedMs/1000});
        }
    }

    /** @return number in text with 2 digits (for seconds and minutes) */
    _twoDigits(v) {
        return ("0" + v).slice(-2);
    }

    _getElapseText(elapseMs) {
        if (!this.state.startTime) {
            return "--:--";
        }
        let diff = this.state.pomoDurationSec - Math.trunc(elapseMs/1000);
        let diffAbs = Math.abs(diff);

        let min = this._twoDigits(Math.trunc(diffAbs / 60));
        let sec = this._twoDigits(diffAbs % 60);
        let sign = diff < 0 ? '-' : '';
        return `${sign}${min}:${sec}`;
    }

    _getElapseMs() {
        if (!this.state.startTime) {
            return 0;
        }
        let elapsedMsBeforeLastPause = this.state.elapsedMsBeforeLastPause || 0;
        let elapsedMs = Date.now() - this.state.lastResume + elapsedMsBeforeLastPause;
        if (elapsedMs > this.state.pomoDurationSec*1000) {
            elapsedMs = this.state.pomoDurationSec*1000;
        }
        return elapsedMs;
    }

    _renderCircle({percentage, text1, text2}) {
        let backgroundImage = this._getCircleBackgroundImage(percentage);
        return (
            <div className={styles.circleContainer} style={{'backgroundImage': backgroundImage}}>
                <div className={styles.circleSpace}>
                    <div className={styles.circleInner}>
                        {text1}
                    </div>
                    <div className={styles.maxMinutes}>
                        {text2}
                    </div>
                </div>
            </div>
        );
    }

    _renderReadyToStart() {
        let circle = this._renderCircle({percentage: this.state.msFromLastPause/this.state.pomoDurationSec,
            text1: "00:00",
            text2: null});
        return <div className={styles.component}>
            {this._renderStartButton()}
            {circle}
        </div>;
    }

    _renderRunning() {
        let elapseMs = this._getElapseMs();
        let elapseText = this._getElapseText(elapseMs);

        this._updateDocumentTitle(elapseMs, elapseText);

        let circle = this._renderCircle({percentage: elapseMs/1000/this.state.pomoDurationSec,
            text1: elapseText,
            text2: this._getCircleText2()});
        return <div className={styles.component}>
            <div className={styles.inputAndStartButtonHolder}>
                <div className={[styles.button, styles.grey].join(' ')} onClick={() => this._onPause()}>PAUSE</div>
            </div>
            {circle}
        </div>;
    }

    _getCircleText2() {
        return `${this.state.pomoDurationSec / 60}m`;
    }

    _renderOnPause() {
        let elapseMs = this.state.elapsedMsBeforeLastPause;
        let elapseText = this._getElapseText(elapseMs);

        let buttons = (
            (<div className={styles.inputAndStartButtonHolder}>
                <div className={[styles.button, styles.green].join(' ')} onClick={() => this._onSuccess()}>DONE</div>
                <div className={[styles.button, styles.grey].join(' ')} onClick={() => this._onResume()}>RESUME</div>
                <div className={styles.button} onClick={() => this._onIFail()}>ABORT</div>
            </div>)
        );
        let circle = this._renderCircle({percentage: elapseMs/1000/this.state.pomoDurationSec,
            text1: elapseText,
            text2: this._getCircleText2()});

        return <div className={styles.component}>
            {buttons}
            {circle}
        </div>;
    }

    _renderOnDone() {
        this.documentTitle.updateTitle("DONE", ICON_STOP);

        let buttons = (
            <div className={styles.inputAndStartButtonHolder}>
                <div className={[styles.button, styles.green].join(' ')} onClick={() => this._onSuccess()}>SUCCESS</div>
                <div className={styles.button} onClick={() => this._onIFail()}>FAIL</div>
            </div>);
        let circle = this._renderCircle({percentage: this.state.msFromLastPause/this.state.pomoDurationSec,
            text1: <div className={styles.doneText}>DONE</div>,
            text2: this._getCircleText2()});
        return <div className={styles.component}>
            {buttons}
            {circle}
        </div>;
    }

    _playMusic() {
        let audio = new Audio('/audio/ukulele.mp3');
        audio.play();
    }

    _getCircleBackgroundImage(percentage) {
        const progressColor = '#ff4136';
        let deg = percentage * 360;
        let degMask, maskColor;
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
        return backgroundImage;
    }

    _updateDocumentTitle(elapsedMs, elapseText) {
        if (typeof (document) === "undefined") return;

        let title, icon;
        if (elapsedMs >= this.state.pomoDurationSec*1000) {
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

    _onStart() {
        this._stopTimer();

        let maxMinutes = parseInt(this.state.inputMinutes);
        let pomoDurationSec = maxMinutes * 60;

        if (DEBUG_FORCE_SECONDS) {
            pomoDurationSec = DEBUG_FORCE_SECONDS;
        }

        let now = Date.now();
        this.setState({startTime: now, pomoDurationSec: pomoDurationSec, mode: MODE_RUNNING,
            lastResume: now,
            msFromLastPause: 0,
            elapsedMsBeforeLastPause: 0});
        this._saveState();
        this._startTimer();
    }

    _onPause() {
        this._stopTimer();
        this.setState({mode : MODE_PAUSE,
            lastResume: null,
            msFromLastPause: null,
            elapsedMsBeforeLastPause: this._getElapseMs()});
        this._saveState();
    }

    _onResume() {
        this.setState({mode : MODE_RUNNING,
            lastResume: Date.now(),
            msFromLastPause: 0});
        this._saveState();
        this._startTimer();
    }

    _onIFail() {
        this._stopTimer();
        this.setState({mode : MODE_READY_TO_START});
        this._saveState();
    }

    _onSuccess() {
        this._stopTimer();
        this.setState({mode : MODE_READY_TO_START});
        this._saveState();
    }

    _renderBody() {
        let {mode} = this.state;
        console.log("Render with mode ", mode);
        if (mode === MODE_READY_TO_START) {
            return this._renderReadyToStart();
        } else if (mode === MODE_RUNNING) {
            return this._renderRunning();
        } else if (mode === MODE_DONE) {
            return this._renderOnDone();
        } else if (mode === MODE_PAUSE) {
            return this._renderOnPause();
        } else {
            return <div>Something is wrong please contact golery.team@gmail.com (State {mode})</div>
        }
    }
    render() {
        if (typeof(window) === "undefined") {
            return <div>Loading Goloery Pomodoro...</div>
        }
        return <div className={styles.component}>
            {this._renderBody()}
        </div>;
    }
}

PomodoroPage.propTypes = {
    //node: PropTypes.object
};
