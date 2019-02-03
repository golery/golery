import React from 'react';

import SmoothScrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
import ReactSmoothScrollbar from 'react-smooth-scrollbar';

import styles from './Scrollbar.scss';

SmoothScrollbar.use(OverscrollPlugin);

export default class Scrollbar extends React.Component {
    render() {
        const props = Object.assign({}, this.props);
        props.className = [props.className || '', styles.scrollbar].join(' ');
        props.plugins = {
            overscroll: {effect: 'glow'},
        };
        return (
            <ReactSmoothScrollbar {...props}>
                {props.children}
            </ReactSmoothScrollbar>
        );
    }
}