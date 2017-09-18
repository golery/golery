import React from 'react';

import styles from './TextSectionView.css';
export default class TextSectionView extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
    }

    componentDidMount() {

    }

    render() {
        let data = this.props.data;
        return <div className={styles.component}>
            <div className={styles.header}>{data.name}</div>
            <div className={styles.body}>{data.body}</div>
        </div>;
    }
}
