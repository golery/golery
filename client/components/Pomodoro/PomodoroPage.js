import React from 'react';
import PropTypes from 'prop-types';

import styles from './PomodoroPage.css';

const _interval = 1000;
const LOCAL_STORAGE_KEY = "STATE";
const STOPPED = 'STOPPED';
const RUNNING = 'RUNNING';

export default class PomodoroPage extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = this._loadState();

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
        let diff = Math.trunc((Date.now() - this.state.startTime) / 1000.0);
        let min = this._twoDigits(Math.round(diff / 60));
        let sec = this._twoDigits(diff % 60);
        return `${min}:${sec}`;
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
        const progressColor = '#ff4136';
        let counter = this._getElapsedSeconds();
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
        this._updateDocumentTitle(elapseText);
        return <div className={styles.component}>
            <div className={styles.container} style={{'backgroundImage': backgroundImage}}>
                <div className={styles.space}>
                    <div className={styles.inner}>
                        {elapseText}
                    </div>
                    <div className={styles.maxMinutes}>
                        {this.state.maxSeconds / 60}m
                    </div>
                </div>
            </div>
            {this._renderStartButton()}
        </div>;
    }

    _updateDocumentTitle(elapseText) {
        if (typeof (document) !== "undefined") {
            document.title = elapseText;
        }
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
