import React from 'react';
import PropTypes from 'prop-types';

import styles from './AppMenu.css';

export default class AppMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openMenu: false
        };
    }

    render() {
        let {openMenu} = this.state;
        let {onLogout, onShowTerms} = this.props;

        let menu;
        if (openMenu) {
            menu = <div className={styles.menu1}>
                <div className={styles.menuItem} onClick={onLogout}>Logout</div>
                <div className={styles.menuItem} onClick={onShowTerms}>Terms</div>
            </div>;
        } else {
            menu = [];
        }
        return <div className={styles.component}>
            <div className={styles.menuButton} onClick={() => this._onToogleMenu()}>=</div>
            {menu}
        </div>;
    }

    _onToogleMenu() {
        this.setState({openMenu: !this.state.openMenu});
    }
}

AppMenu.propTypes = {
    onLogout: PropTypes.func
};
