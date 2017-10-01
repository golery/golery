import React from 'react';
import PropTypes from 'prop-types';

import styles from './HtmlView.css';
import htmlContentStyles from '../../HtmlContent.css';

export default class HtmlView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {html, className} = this.props;
        return <div className={[styles.component, htmlContentStyles.html].join(' ')}>
            <div className={className} dangerouslySetInnerHTML={{__html: html}}/>
        </div>;
    }
}

HtmlView.propTypes = {
    html: PropTypes.string,
    className: PropTypes.string
};
