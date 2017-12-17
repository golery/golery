import React from 'react';
import PropTypes from 'prop-types';

import styles from './ContextMenuView.css';

export default class ContextMenuView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {x: 0, y: 0, menus: [], show: false};
    }

    render() {
        let {x, y, menus, show} = this.state;
        if (!show) return <div id='contextMenu' style={{display: 'none'}}/>;

        let style = this._getPositionStyle(x, y, menus);
        let items = menus.map((item, index) =>
            <div key={index} className={styles.item} onClick={e => this._onClickMenuItem(e, item)}>{item.name}</div>
        );
        return <div>
            <div className={styles.backgroundMask} onMouseDown={e => this._onCloseMenu(e)}/>
            <div className={styles.component} style={style}>
                {items}
            </div>
        </div>;
    }

    _getPositionStyle(x, y, menus) {
        // when menu is open at very bottom screen, align with bottom so that full menu is always visible
        let win = window, d = document, e = d.documentElement,
            h = win.innerHeight || e.clientHeight || d.getElementsByTagName('body')[0].clientHeight;
        let menuHeight = menus.length * 20;
        if (y + menuHeight < h)
            return {left: x - 8 + "px", top: y - 8 + "px", bottom: "auto"};
        else
            return {left: x - 8 + "px", bottom: 0, top: "auto"};
    }

    show(x, y, menus) {
        this.setState({x, y, menus, show: true});
    }

    _onCloseMenu(e) {
        this._hide();
        e.stopPropagation();
    }

    _hide() {
        this.setState({show: false});
    }

    _onClickMenuItem(e, item) {
        e.stopPropagation();
        this._hide();
        item.action();
    }
}

ContextMenuView.propTypes = {};
