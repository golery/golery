import React from 'react';
import PropTypes from 'prop-types';

export default class HtmlView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {html, className} = this.props;
        return <div className={className} dangerouslySetInnerHTML={{__html: html}}/>
    }
}

HtmlView.propTypes = {
    html: PropTypes.string,
    className: PropTypes.string
};
