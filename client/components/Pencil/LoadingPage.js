import React from 'react';

import styles from './LoadingPage.css';

export default class LoadingPage extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
    }

    componentDidMount() {

    }

    render() {
        return <div className={styles.component}>
            <div className={styles.loader}>Loading...</div>
        </div>;
    }
}

LoadingPage.propTypes = {
    //options: PropTypes.array
};
