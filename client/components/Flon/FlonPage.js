import React from 'react';
import PropTypes from 'prop-types';

import styles from './FlonPage.scss';

export default class FlonPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles.component}>FlonPage
        </div>;
    }
}

FlonPage.propTypes = {
    //node: PropTypes.object
};
