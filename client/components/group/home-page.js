import React from 'react';
import {Router, Route, Link, hashHistory} from 'react-router'
import styles from './home-page.css';

export default class GroupView extends React.Component {
    constructor(props) {
        super(props);
        this.onShowAddMember = this.onShowAddMember.bind(this);
        this.onAddMember = this.onAddMember.bind(this);

        let members = [{name: 'Marry', email: 'marry@yahoo.com'},
            {name: 'Louis', email: 'louis@gmail.com'},
            {name: 'Pan', email: 'pan@gmail.com'},];

        this.state = {
            showAddMemberDialog: false,
            members: members,
            showDelete: false
        };
    }

    onShowAddMember(e) {
        this.setState({showAddMemberDialog: !this.state.showAddMemberDialog});
    }

    onAddMember(e) {
        let newMembers = this.state.members.concat([{name: this.state.addingName, email: this.state.addingEmail}]);
        this.setState({members: newMembers});
        console.log(this.state);
    }

    componentDidMount() {

    }

    render() {
        let add = this.state.showAddMemberDialog ?
            <div className={styles.dialogAddMember}>
                <div>Add member</div>
                <div>Name<input type="text" name="name" onChange={(e) => {
                    this.state.addingName = e.target.value
                }}/></div>
                <div>Email<input type="text" name="name" onChange={(e) => {
                    this.state.addingEmail = e.target.value
                }}/></div>
                <button onClick={this.onAddMember}>OK</button>
            </div> :
            <button onClick={this.onShowAddMember}>
                Add
            </button>;
        return <div className={styles.component}>
            <div className={styles.nameHolder}>Dinosaur Park</div>
            <div className={styles.dateHolder}>
                <div>Saturday</div>
                <div>18-Mar</div>
            </div>
            <div className={styles.itemHolder}>Register</div>
            <div className={styles.itemHolder}>Attendees</div>
            <div className={styles.itemHolder}>Expense</div>
            <div className={styles.itemHolder}>Done</div>
        </div>;
    }
}
