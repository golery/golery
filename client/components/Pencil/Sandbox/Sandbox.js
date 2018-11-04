/** Usage : add parameter sandbox https://localhost/pencil?sandbox to get only sandbox page */
import React from 'react';
import PropTypes from 'prop-types';

import styles from './Sandbox.scss';
// import SandboxEditor from "./SandboxEditor";

 // import SandboxEditor from './SandboxEditor';
let SandboxEditor = null;
let isBrowser = (typeof window !== 'undefined');
if (isBrowser) {
    SandboxEditor = require('./SandboxEditor').default;
}

export default class Sandbox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(SandboxEditor);
        return <div className={styles.component}>Sandbox
            {isBrowser ? <SandboxEditor/> : null}
        </div>;
    }

    static isEnabled() {
        if (typeof window === "undefined") return false;
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('sandbox') != null;
    }
}

Sandbox.propTypes = {
    //node: PropTypes.object
};
