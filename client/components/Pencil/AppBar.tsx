import * as React from 'react';

import styles from './AppBar.scss';
import AppMenu from './AppMenu';

interface Props {
    user: any
    onLogout: any
    onShowTerms: any
}

export default class AppBar extends React.Component<Props, {}> {
    render() {
        return (
            <div className={styles.component}>
                <div className={styles.left}>P E N C I L</div>
                <div className={styles.right}>
                    <AppMenu {...this.props} />
                </div>
            </div>
        );
    }
}
