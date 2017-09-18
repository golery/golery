import React from 'react';
import InsertPlugin from './InsertPlugin';

import styles from './MediumEditor.css';

export default class MediumEditor extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
    }

    componentDidMount() {
        const elmContent = this.elmContent;
        var editor = new MediumEditorLib('.' + styles.content, {
            toolbar: {
                buttons: ['bold', 'italic', 'underline'],
            }
        });

        new InsertPlugin(this.elmHolder, elmContent);
    }

    render() {
        return <div className={styles.component} ref={ref => this.elmHolder = ref}/>;
    }
}

MediumEditor.propTypes = {
    //options: PropTypes.array
};
