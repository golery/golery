import React from 'react';

import styles from './EditPay.css';
export default class EditPay extends React.Component {
    constructor(props) {
        super(props);
        this.onSaveClicked = this.onSaveClicked.bind(this);
        this.state = {from: '', to: '', amount: ''};
        this.onSave = this.props.onSave;
    }
    componentDidMount() {

    }

    onSaveClicked() {
        this.onSave(this.state.from, this.state.to, this.state.amount);
    }

    render() {
        return <div className={styles.component}>
            <div className={styles.title}> ADD PAYMENT</div>
            <div className={styles.fieldSet}>
                <div>
                    From (comma-separated list of names):
                    <input type="input" value={this.state.from}
                           placeholder="Peter, Janny"
                           onChange={(e) => {
                               this.setState({from: e.target.value});
                           }}/>
                </div>
                <div>To:
                    <input type="input" value={this.state.to}
                           placeholder="Tom"
                           onChange={(e) => {
                               this.setState({to: e.target.value});
                           }}/></div>
                <div>Amount:
                    <input type="input"
                           value={this.state.amount}
                           placeholder="10"
                           onChange={(e) => {
                               this.setState({amount: e.target.value});
                           }}/></div>
            </div>
            <div className={styles.button} onClick={this.onSaveClicked}>ADD</div>
        </div>;
    }
}
