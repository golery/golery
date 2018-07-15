import React from 'react';
import PropTypes from 'prop-types';

import styles from './Scrollbar.scss';
import {Scrollbars} from 'react-custom-scrollbars';

export default class Scrollbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Scrollbars autoHide={false} autoHideTimeout={500} autoHideDuration={100}
                           universal
                           renderThumbVertical={this._renderThumbVertical}
                           renderThumbHorizontal={this._renderThumbHorizontal}>
            {this.props.children}
        </Scrollbars>;
    }

    _renderThumbVertical() {
        return <div className={styles.scrollbarVerticalThumb}/>;
    }

    _renderThumbHorizontal() {
        return <div className={styles.scrollbarHorizontalThumb}/>;
    }
}

Scrollbar.propTypes = {
    //node: PropTypes.object
};
