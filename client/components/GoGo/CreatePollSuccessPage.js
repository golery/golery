import React from 'react';

import styles from './CreatePollSuccessPage.css';
export default class CreatePollSuccessPage extends React.Component{
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
    }
    componentDidMount()
    {

    }
    render()
    {
        return <div className={styles.component}>CreatePollSuccessPage
        </div>;
    }
}
