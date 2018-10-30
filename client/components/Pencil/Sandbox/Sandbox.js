import React from 'react';
import PropTypes from 'prop-types';

import styles from './Sandbox.scss';
import SandboxEditor from './SandboxEditor';

export default class Sandbox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles.component}>Sandbox
            <SandboxEditor/>
        </div>;
    }
}

Sandbox.propTypes = {
    //node: PropTypes.object
};

Sandbox = undefined;