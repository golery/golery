import React from 'react';
import styles from './ForgePage.css';
import MediumEditor from '../MediumEditor/MediumEditor';

export default class ForgePage extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';

    }

    componentDidMount() {

    }


    render() {

        var options = [
            {value: 'one', label: 'One'},
            {value: 'two', label: 'Two'}
        ];

        function logChange(val) {
            console.log("Selected: " + val);
        }


        return <div className={styles.component}>
            <div style={{border: '1px solid gray'}}>
                <MediumEditor/>
            </div>
        </div>;
    }
}
