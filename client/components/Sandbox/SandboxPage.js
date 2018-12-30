import React from 'react';
import styles from './SandboxPage.css';
import LoadingPage from '../Pencil/LoadingPage';

export default class SandboxPage extends React.Component {
    constructor(props) {
        super(props);
    }

    _getSandbox() {
        return <LoadingPage/>;
    }
    render() {
        let sandbox = typeof (window) === "undefined" ? null : this._getSandbox();
        return (
            <div className={styles.component}>
                {sandbox}
            </div>
        );
    }
}
