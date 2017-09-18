import React from 'react';

import styles from './UnixTimePage.css';

export default class UnixTimePage extends React.Component {
    constructor(props) {
        super(props);
        let now = new Date().getTime();
        this.state = {input: now, now}
    }

    componentDidMount() {
        // update now time
        setInterval(() => {
            let now = new Date().getTime();
            this.setState({now})
        }, 213);
    }

    render() {
        let v = this.state.input;
        if (v < 1000000000000) {
            v = v * 1000;
        }
        let date = new Date(v);
        return <div className={styles.component}>
            <div className={styles.body}>
                <p className={styles.title}>UNIX TIMESTAMP CONVERTER</p>
                <p className={styles.now}><span className={styles.bold}>Now is </span>
                    <span className={styles.nowMs}>{this.state.now}</span> ms from epoch.
                </p>
                <p><span className={styles.bold}>Unix timestamp</span> (ms or sec):</p>
                <p><input className={styles.input} value={this.state.input}
                          onChange={e => this._onChange(e.target.value)}/></p>
                <p><span className={styles.bold}>Locale Time:</span> <span>{date.toString()}</span></p>
                <p><span className={styles.bold}>UTC time:</span> <span>{date.toUTCString()}</span></p>
            </div>
        </div>;
    }

    _onChange(newValue) {
        let v = Number(newValue);
        this.setState({input: v});
    }
}

UnixTimePage.propTypes = {
    //options: PropTypes.array
};
