import React from 'react';
import {withRouter} from 'react-router-dom';

import styles from './CreatePollPage.css';
class CreatePollPage extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
        this.state = {pollName: '', email: '', validForm: false};

        this._onClickCreatePoll = this._onClickCreatePoll.bind(this);
    }

    componentDidMount() {

    }

    render() {
        let buttonDisabledClassName = this._isValidForm() ? '' : styles.disabled;
        return <div className={[styles.component, styles.center].join(' ')}>
            <form className={[styles.middleHolder].join(' ')}>
                <fieldset>
                    <label>Name of poll</label>
                    <input type="text" required placeholder="ex: Suspension Bridge day"
                           value={this.state.pollName}
                           onChange={(e) => {
                               this.setState({pollName: e.target.value});
                           }}/>

                    <label>Your email</label>
                    <input type="email" placeholder="youremail@golery.com"
                           value={this.state.email}
                           onChange={(e) => {
                               this.setState({email: e.target.value});
                           }}/>

                </fieldset>

                <div className={styles.buttonHolder}>
                    <div className={[styles.button, buttonDisabledClassName].join(' ')}
                         onClick={this._onClickCreatePoll}>
                        Create Poll
                    </div>
                </div>
            </form>
        </div>;
    }

    _isValidForm() {
        let validEmail = this.state.email.length > 0;
        let validPollName = this.state.pollName.length > 0;
        return validEmail && validPollName;
    }

    _onClickCreatePoll() {
        this.props.history.push('/gogo/createPollSuccess');
    }
}

export default withRouter(CreatePollPage);
