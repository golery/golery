import React from 'react';
import styles from './SandboxPage.css';
import LoadingPage from '../Pencil/LoadingPage';
import SandboxUploadImage from './SandboxUploadImage';

export default class SandboxPage extends React.Component {
    constructor(props) {
        super(props);
    }

    _getSandbox() {
        console.log(SandboxUploadImage);
        return <SandboxUploadImage/>;
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
