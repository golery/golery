import React from 'react';

import styles from './Scrollbar.scss';
import ReactSmoothScrollbar from 'react-smooth-scrollbar';
import SmoothScrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
export default class Scrollbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactSmoothScrollbar {...this.props}>
                {this.props.children}
            </ReactSmoothScrollbar>
        );
    }
}

Scrollbar.propTypes = {
    //node: PropTypes.object
};
