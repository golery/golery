import React from 'react';
import PropTypes from 'prop-types';

import styles from './Scrollbar.scss';
import SmoothScrollbar from 'react-smooth-scrollbar';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

export default class Scrollbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <SimpleBar {...this.props}>
            {this.props.children}
        </SimpleBar>;
    }
}

Scrollbar.propTypes = {
    //node: PropTypes.object
};
