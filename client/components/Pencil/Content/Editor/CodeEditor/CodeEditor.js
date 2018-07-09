import React from 'react';
import PropTypes from 'prop-types';

import styles from './CodeEditor.scss';

export default class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles.component}>CodeEditor
        </div>;
    }
}

CodeEditor.propTypes = {
    //node: PropTypes.object
};
