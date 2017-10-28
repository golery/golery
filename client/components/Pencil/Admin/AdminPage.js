import React from 'react';
import PropTypes from 'prop-types';

import Axios from "axios";

import styles from './AdminPage.css';

export default class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {nodeCount: null, publicNodes: []}
    }

    componentDidMount() {
        this._refresh();
    }

    render() {

        return <div className={styles.component}>
            <div className={styles.body}>
                <span className={styles.statName}>Total pencil pages:</span> <span
                className={styles.statNumber}>{this.state.nodeCount}</span>
                <div className={styles.publicNodeHolder}>
                    {this._getPublicNodeElm(this.state.publicNodes)}
                </div>
            </div>
        </div>;
    }

    _getPublicNodeElm(nodes) {
        let list = [];
        for (let node of nodes) {
            list.push(<div key={node._id}><a href={"https://www.golery.com/pencil/" + node._id}
                                             target="_blank">{node._id}</a> {node.name}</div>)
        }
        return list;
    }

    _refresh() {
        return Axios.get('/api/secure/node/stats').then(response => {
            let {nodeCount, publicNodes} = response.data;
            this.setState({nodeCount, publicNodes});
        });
    }
}

AdminPage.propTypes = {
    //node: PropTypes.object
};
