import React from 'react';

import styles from './LoadingPage.css';

export default class LoadingPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.component}>
                <div className={styles.loadingText}>Loading...</div>
                <div className={styles.loader}/>
            </div>
        );
    }
}
