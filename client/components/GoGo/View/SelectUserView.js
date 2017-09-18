import React from 'react';
import Select from 'react-select';

import coreStyles from '../Core.css';
import styles from './ViewPollPage.css';

export default class SelectUserView extends React.Component {
    constructor(props) {
        super(props);

        this._onSave = this._onSave.bind(this);

        this.formNewUser = {name: '', email: ''};
        this.formExistingUser = {name: '', email: ''};
        this.state = {selectedUserIndex: 0, form: this.formNewUser};
        this._onChangeUser = this._onChangeUser.bind(this);

        this.props.users[this.props.userIndex].email = "";
    }

    render() {
        let {users, userIndex, editing} = this.props;

        let user = users[userIndex];

        let input = [<input className={coreStyles.input} placeholder="Name"
                            value={this.state.form.name}
                            onChange={(e) => {
                                this.state.form.name = e.target.value;
                                this.forceUpdate();
                            }}
                            key={1}/>,
            <input className={coreStyles.input} placeholder="Email" value={this.state.form.email}
                   onChange={(e) => {
                       this.state.form.email = e.target.value;
                       this.forceUpdate();
                   }}
                   key={2}/>];

        let elmEditingButtons =
            <div>
                <fieldset>
                    <button onClick={this.props.cancelEditListener}>Cancel</button>
                    <button onClick={this._onSave}>Save</button>
                    <button onClick={this.props.deleteListener}>Delete</button>
                </fieldset>
            </div>;


        let index = this.props.userIndex;
        let isCreateNew = this.props.userIndex === 0;

        let options = this.props.users.map((v, i) => {
            let name = i === 0 ? 'Create new user' : v.name;
            return {value: i, label: name};
        });
        let elmSelect = (editing && index !== 0) ? [] :
            <Select value={index} options={options} onChange={this._onChangeUser}/>;

        let elmInput = editing || isCreateNew ? input : [];

        let elmButtons;
        if (isCreateNew) {
            elmButtons =
                <button onClick={this._onSave}>Create</button>;
        } else {
            elmButtons = editing ? elmEditingButtons : <button onClick={this.props.editListener}>Edit</button>;
        }
        return <div>
            <fieldset>
                {elmSelect}
                {elmInput}
            </fieldset>
            <fieldset className={styles.buttonHolder}>
                {elmButtons}
            </fieldset>
        </div>;
    }

    componentWillReceiveProps(props) {
        let userIndex = props.userIndex;
        let users = props.users;
        let user = users[userIndex];

        if (userIndex === 0) {
            this.state.form = this.formNewUser;
        } else {
            this.state.form = this.formExistingUser;
            this.state.form.name = user.name || '';
            this.state.form.email = user.email || '';
        }
    }

    _onChangeUser(option) {
        let index = option.value;
        this.setState({selectedUserIndex: index});
        this.props.changeListener(index);
    }

    _onSave() {
        let user = this._getUser();
        this.props.saveListener(user._id, this.state.form.name, this.state.form.email);
    }

    _getUser() {
        return this.props.users[this.props.userIndex];
    }
}
