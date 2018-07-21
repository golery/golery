import React from 'react';
import PropTypes from 'prop-types';
import Axios from "axios";

import styles from './AdminPage.scss';

export default class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {stats: []};
    }

    componentDidMount() {
        this._loadStats();
    }

    render() {
        let $userList = this.state.stats.map((stats, index) => {
            let {user, detail} = stats;
            return <div className={styles.row} key={user._id}>
                <div className={styles.cell}>{index}</div>
                <div className={styles.cell}>{user.username}</div>
                <div className={styles.cell}>{user.created}</div>
                <div className={styles.cell}>{detail.nodeCount}</div>
                <div className={styles.cell}>
                    <div className={styles.button} onClick={() => this._load(user._id)}>Load</div>
                </div>
            </div>
        });
        return <div className={styles.component}>
            <h1>Users</h1>
            <div className={styles.row + ' ' + styles.tableHeader}>
                <div className={styles.cell}>#</div>
                <div className={styles.cell}>Username</div>
                <div className={styles.cell}>Date created</div>
                <div className={styles.cell}>Node count</div>
                <div className={styles.cell}/>
            </div>
            {$userList}
        </div>;
    }

    _load(_id) {
        return Axios.get('/api/secure/stats/user/' + _id).then(response => {
            this.setState({userDetail: response.data});
        });
    }

    _loadStats() {
        return Axios.get('/api/secure/stats/user').then(response => {
            this.setState({stats: response.data});
        });
    }
}

AdminPage.propTypes = {
    //node: PropTypes.object
};
