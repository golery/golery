import React from 'react';
import PropTypes from 'prop-types';

import Axios from "axios";

import styles from './AdminPage.css';

export default class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {totalNode: null}
    }

    componentDidMount() {
        this._refresh();
    }

    render() {
        return <div className={styles.component}>
            <div className={styles.body}>
                <span className={styles.statName}>Total pencil pages:</span> <span className={styles.statNumber}>{this.state.totalNode}</span>
            </div>
        </div>;
    }

    _refresh() {
        return Axios.get('/api/secure/node/stats').then(response => {
            let {totalNode} = response.data;
            this.setState({totalNode});
        });
    }
}

AdminPage.propTypes = {
    //node: PropTypes.object
};
