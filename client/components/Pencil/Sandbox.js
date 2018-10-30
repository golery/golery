import React from 'react';
import PropTypes from 'prop-types';

import styles from './Sandbox.scss';

export default class Sandbox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles.component}>Sandbox
        </div>;
    }
}

Sandbox.propTypes = {
    //node: PropTypes.object
};
