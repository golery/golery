import React from 'react';
import PropTypes from 'prop-types';

import styles from './SandboxEditor.scss';

export default class SandboxEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles.component}>SandboxEditor
        </div>;
    }
}

SandboxEditor.propTypes = {
    //node: PropTypes.object
};
