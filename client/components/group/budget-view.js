import React from 'react';
import {Router, Route, Link, hashHistory} from 'react-router'

import styles from './budget.css';

class Expense {
    constructor(user, name, amount) {
        this.user = user;
        this.name = name;
        this.amount = amount;
    }
}

export default class GroupView extends React.Component {
    constructor(props) {
        super(props);
        this.onShowAddMember = this.onShowAddMember.bind(this);
        this.onAddMember = this.onAddMember.bind(this);

        let members = [{name: 'Marry', email: 'marry@yahoo.com'},
            {name: 'Louis', email: 'louis@gmail.com'},
            {name: 'Pan', email: 'pan@gmail.com'},];

        let expenses = [new Expense('Marry', 'Pizza', 10), new Expense('Marry', 'Icecream', 10)];

        this.state = {
            showAddMemberDialog: true,
            members: members,
            showDelete: false,
            expenses: expenses
        };
    }

    onShowAddMember(e) {
        this.setState({showAddMemberDialog: !this.state.showAddMemberDialog});
    }

    onAddMember(e) {
        let newMembers = this.state.members.concat([{name: this.state.addingName, email: this.state.addingEmail}]);
        this.setState({members: newMembers});
    }

    componentDidMount() {

    }

    render() {
        let add = this.state.showAddMemberDialog ?
            <div className={styles.dialogAddMember}>
                <div>Add expense</div>
                <div>User<input type="text" name="name" onChange={(e) => {
                    this.state.addingName = e.target.value
                }}/></div>
                <div>Expense<input type="text" name="name" onChange={(e) => {
                    this.state.addingEmail = e.target.value
                }}/></div>
                <div>Amount<input type="text" name="name" onChange={(e) => {
                    this.state.addingEmail = e.target.value
                }}/></div>
                <button onClick={this.onAddMember}>OK</button>
            </div> :
            <button onClick={this.onShowAddMember}>
                Add
            </button>
        return <div className={styles.component}>
            <Link to={{pathname: `/group/main`}}>Members</Link>
            <div className={styles.groupHolder}>Join: XAB123</div>
            {add}
            <div>Expense</div>
            {this.state.expenses.map((expense, index) =>
                <div className={styles.memberHolder} key={index}>
                    <div className={styles.cell}>{expense.user}</div>
                    <div className={styles.cell}>{expense.name}</div>
                    <div className={styles.cell}>{expense.amount}</div>
                </div>)}
        </div>;
    }
}
