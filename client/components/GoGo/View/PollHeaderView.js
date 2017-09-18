import React from 'react';

import styles from './PollHeaderView.css';
export default class PollHeaderView extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
    }

    componentDidMount() {

    }

    render() {
        return <div className={styles.component}>
            <div className={styles.titlesHolder}>
                <div className={styles.title}>
                    <div className={styles.titleTextBackground}>{this.props.title}</div>
                </div>
                <div className={styles.subtitle}>
                    <div className={styles.titleTextBackground}>{this.props.subtitle}</div>
                </div>
            </div>
        </div>;
    }
}
