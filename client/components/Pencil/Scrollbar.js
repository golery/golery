import React from 'react';

import styles from './Scrollbar.scss';
import SmoothScrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
import ReactSmoothScrollbar from 'react-smooth-scrollbar';

SmoothScrollbar.use(OverscrollPlugin);

export default class Scrollbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let className = this.props.className || '';
        className = [className, styles.scrollbar].join(' ');
        return (
            <ReactSmoothScrollbar {...this.props} className={className} plugins={{overscroll: { effect: 'glow'}}}>
                {this.props.children}
            </ReactSmoothScrollbar>
        );
    }
}