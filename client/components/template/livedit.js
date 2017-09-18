/* Intellij live edit template */
import React from 'react';

import styles from './$component$.css';

export default class $component$ extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
    }

    componentDidMount() {

    }

    render() {
        return <div className={styles.component}>$component$
        </div>;
    }
}

$component$.propTypes = {
    //options: PropTypes.array
};
