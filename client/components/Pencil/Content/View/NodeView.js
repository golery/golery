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
        return <div className={[styles.component, "theme article"].join(' ')}>
            <HtmlView html={node.title} className="title"/>
            <HtmlView html={node.html}/>
        </div>;
    }
}

NodeView.propTypes = {
    node: PropTypes.object
};
