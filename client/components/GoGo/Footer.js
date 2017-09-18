import React from 'react';

import styles from './Footer.css';
export default class Footer extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
    }

    componentDidMount() {

    }

    render() {
        return <div className={styles.component}>Copyright © 2017 - 2017 Golery™ — All rights reserved</div>;
    }
}
