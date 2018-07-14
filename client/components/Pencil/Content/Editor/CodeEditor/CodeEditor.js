import React from 'react';
import PropTypes from 'prop-types';

import styles from './CodeEditor.scss';

export default class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {code} = this.props;
        return <div className={styles.component}>
            <p className={styles.threeDots}>CodeEditor</p>
            <pre className={styles.pre} contentEditable={true}>
                {code}
            </pre>
        </div>;
    }
}

CodeEditor.propTypes = {
    code: PropTypes.string
};
