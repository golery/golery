import React from 'react';
import PropTypes from 'prop-types';

import styles from './Scrollbar.scss';
import SmoothScrollbar from 'react-smooth-scrollbar';

export default class Scrollbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <SmoothScrollbar >
            {this.props.children}
        </SmoothScrollbar>;
    }
}

Scrollbar.propTypes = {
    //node: PropTypes.object
};
