import * as React from 'react';

import styles from './AppMenu.css';

interface Props {
    user: any
    onLogout: any
    onShowTerms: any
}

export default class AppMenu extends React.Component<Props, { openMenu: boolean }> {
    constructor(props) {
        super(props);
        this.state = {
            openMenu: false
        };
    }

    private renderMenu() {
        let {onLogout, onShowTerms} = this.props;

        let {openMenu} = this.state;
        let menu;
        if (openMenu) {
            menu = (
                <div className={styles.menu1}>
                    <div className={styles.menuItem} onClick={onLogout}>Logout</div>
                    <div className={styles.menuItem} onClick={onShowTerms}>Terms</div>
                </div>
            );
        } else {
            menu = [];
        }
        return menu;
    }

    private login(): void {
        window.location.href = "/pencil";
    }

    private renderPublic() {
        return (
            <div className={styles.component}>
                <div className={styles.loginButton} onClick={this.login}>Login</div>
            </div>
        );
    }

    private renderProtected() {
        let {openMenu} = this.state;

        let icon = openMenu ? <i className="fas fa-times"/> : <i className="fas fa-bars"/>;
        return (
            <div className={styles.component}>
                <div className={styles.menuButton} onClick={() => this.onToggleMenu()}>{icon}</div>
                {this.renderMenu()}
            </div>
        );
    }

    render() {
        let {user} = this.props;
        return user ? this.renderProtected() : this.renderPublic();
    }

    private onToggleMenu() {
        this.setState({openMenu: !this.state.openMenu});
    }
}
