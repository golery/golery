/** Usage : add parameter sandbox https://localhost/pencil?sandbox to get only sandbox page */
import React from 'react';

import styles from './Sandbox.scss';
import SandboxEditor from './SandboxEditor';

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
        /*if (typeof window === "undefined") return false;
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('sandbox') != null;*/
        return true;
    }
}
