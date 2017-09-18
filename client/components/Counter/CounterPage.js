import React from 'react';

import styles from './CounterPage.css';

const KEY = 'Counter.counter';
export default class CounterPage extends React.Component {
    constructor(props) {
        super(props);

        this._onClickCounter = this._onClickCounter.bind(this);
        this._onReset = this._onReset.bind(this);

        this.state = {counter: this._load()};
    }

    componentDidMount() {

    }

    render() {
        return <div className={styles.component}>
            <div>
                <a onClick={this._onReset} className={styles.buttonReset}>Reset</a>
            </div>
            <div onClick={this._onClickCounter} className={styles.buttonCounter}>{this.state.counter}</div>
        </div>;
    }

    _onReset(e) {
        this._store(0);
        this.setState({counter: 0});
    }

    _onClickCounter() {
        let newCounter = this.state.counter + 1;
        this._store(newCounter);
        this.setState({counter: newCounter});
    }

    _store(counter) {
        localStorage.setItem(KEY, counter);
    }

    _load() {
        let load = 0;
        try {
            load = Number(localStorage.getItem(KEY));
        } catch (e) {
            console.log(e);
        }
        return load;
    }
}
