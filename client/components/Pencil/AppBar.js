import React from 'react';

import styles from './AppBar.scss';
import AppMenu from './AppMenu';

export default class AppBar extends React.Component {
    render() {
        const {onLogout, onShowTerms} = this.props;
        return (
            <div className={styles.component}>
                <div className={styles.left}>P E N C I L</div>
                <div className={styles.right}>
                    <AppMenu onLogout={() => onLogout()} onShowTerms={() => onShowTerms()} />
                </div>
            </div>
        );
    }
}
