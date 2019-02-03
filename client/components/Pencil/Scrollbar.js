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
        let props = Object.assign({}, this.props);
        props.className = [props.className || '', styles.scrollbar].join(' ');
        props.plugins = {overscroll: {effect: 'glow'}};
        return (
            <ReactSmoothScrollbar {...props}>
                {this.props.children}
            </ReactSmoothScrollbar>
        );
    }
}