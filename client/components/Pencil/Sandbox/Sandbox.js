/** Usage : add parameter sandbox https://localhost/pencil?sandbox to get only sandbox page */
import React from 'react';

import styles from './Sandbox.scss';
import SandboxEditor from './SandboxEditor';

let enableSandbox = null;

export default class Sandbox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(SandboxEditor);
        return <div className={styles.component}>
            <div>SANDBOX</div>
            <SandboxEditor/>
        </div>;
    }

    static isEnabled() {
        if (enableSandbox == null) {
            if (typeof window === "undefined") {
                enableSandbox = false;
            } else {
                const urlParams = new URLSearchParams(window.location.search);
                enableSandbox = urlParams.get('sandbox') !== null;
            }
        }
        return enableSandbox !== false;
    }
}
