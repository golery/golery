import React from 'react';
import PropTypes from 'prop-types';

import styles from './NodeView.css';
import HtmlView from './Html/HtmlView';

export default class NodeView extends React.Component{
    constructor(props) {
        super(props);
    }
    render()
    {
        let {node} = this.props;
        return <div className={[styles.component, "pencilTheme"].join(' ')}>
            <HtmlView html={node.title} className="nodeTitle"/>
            <HtmlView html={node.html} className="nodeHtml"/>
        </div>;
    }
}

NodeView.propTypes = {
    node: PropTypes.object
};
