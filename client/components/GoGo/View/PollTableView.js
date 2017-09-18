/** View poll as table */
import React from "react";
import PropTypes from "prop-types";

import styles from "./PollTableView.css";

import {Participant} from "../Domain";
import store from "../Store";

export default class PollTableView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            participants: props.pollParticipants,
            options: props.pollOptions,
            inputOptions: [],
            inputUsername: '',
            edit: false
        }
    }

    componentDidMount() {

    }

    render() {
        if (this.state.edit) {
            return this._renderEditMode();
        } else {
            return this._renderViewMode();
        }
    }

    _renderEditMode() {
        const {participants, options, edit} = this.state;
        const elmHead = this._renderTableHead(options);
        const elmOtherUsers = this._renderOtherUsers(participants, options, edit);
        return <div className={styles.component}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th></th>
                    {elmHead}
                </tr>
                </thead>
                <tbody>
                {elmOtherUsers}
                </tbody>
            </table>
            <div>
                <button className={styles.deleteButton} onClick={() => this._onSaveEdit()}>Save</button>
            </div>
        </div>;
    }

    _renderViewMode() {
        const {participants, options} = this.state;
        const elmHead = this._renderTableHead(options);
        const elmOtherUsers = this._renderOtherUsers(participants, options);
        const elmNewUser = this._renderNewUser(options);
        return <div className={styles.component}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th></th>
                    {elmHead}
                </tr>
                </thead>
                <tbody>
                {elmOtherUsers}
                {elmNewUser}
                </tbody>
            </table>
            <div>
                <button className={styles.addButton} onClick={() => this._onAdd()}>Add</button>
                <button className={styles.deleteButton} onClick={() => this._onEdit()}>Edit</button>
            </div>
        </div>;
    }

    _onAdd() {
        let {addListener} = this.props;
        let {inputOptions, participants} = this.state;
        let participant = new Participant(store.objectId(), this.state.inputUsername);
        participant.pollOptions = inputOptions;

        participants.push(participant);
        this.setState({inputOptions: [], participants});
        if (addListener) addListener();

        store.saveEvent();
    }

    _onSaveEdit() {
        this.setState({edit: false});
        store.saveEvent();
    }

    _onEdit() {
        this.setState({edit: true});
    }

    _renderTableHead(options) {
        return options.map((o, i) => {
            return <th key={i}>{o.name}</th>
        });
    }

    _renderSelectedOptions(selections, options) {
        return options.map((o, i) => {
            let selected = selections && selections.indexOf(o._id) >= 0;
            let elmCheck = selected ? <span>x</span> : null;
            return <td key={i}>{elmCheck}</td>
        });
    }

    _renderOtherUsers(participants, options, edit) {
        return participants.map((participant, i) => {
            let elmDelete = edit ?
                <a href="#" onClick={(e) => this._onDeleteParticipant(e, participant._id)}>Delete</a> : null;
            return <tr key={i}>
                <td>{participant.name} {elmDelete}</td>
                {this._renderSelectedOptions(participant.pollOptions, options, edit)}
            </tr>
        });
    }

    _onDeleteParticipant(e, _id) {
        let {participants} = this.state;
        let index = participants.findIndex(o => o._id === _id);
        participants.splice(index, 1);
        this.setState({participants});
        e.stopPropagation();
        e.preventDefault();
    }

    _onCheck(optionId, checked) {
        let inputOptions = this.state.inputOptions;
        if (checked) {
            inputOptions.push(optionId);
        } else {
            const index = inputOptions.indexOf(optionId);
            inputOptions.splice(index, 1);
        }
        this.setState({inputOptions});
    }

    _renderNewUser(options) {
        const elmOptions = options.map((o, i) => {
            const checked = this.state.inputOptions.indexOf(o._id) >= 0;
            return <td key={i}><input type="checkbox" checked={checked}
                                      onChange={(e) => this._onCheck(o._id, e.target.checked)}/></td>
        });
        return <tr>
            <td><input type="text" value={this.state.inputUserName}
                       onChange={(e) => this.setState({inputUsername: e.target.value})}/></td>
            {elmOptions}</tr>
    }
}

PollTableView.propTypes = {
    pollOptions: PropTypes.array,
    pollParticipants: PropTypes.array
};
