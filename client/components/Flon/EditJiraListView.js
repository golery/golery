import React from 'react';
import PropTypes from 'prop-types';

import styles from './EditJiraListView.scss';
import flon from './Flon.scss';
import {store} from './Store';
import Api from './Api';

export default class EditJiraListView extends React.Component {
    constructor(props) {
        super(props);
        let jiraTasks = store.selectedColumn.jiraTasks;
        let tasks = jiraTasks ? jiraTasks.split(',') : [];
        this.state = {tasks: tasks, input: null};
    }

    render() {
        return <div className={styles.component}>
            <div>
                {this.state.tasks.map((task, index) => <div key={index}>{task}</div>)}
            </div>
            Add jira (input task URL/taskID)
            <input className={styles.taskInput} value={this.state.input}
                   onChange={(e) => this.setState({input: e.target.value})}/>
            <div className={flon.button} onClick={() => this._addTask()}>Add</div>
        </div>;
    }

    _addTask() {
        this.state.tasks.unshift(this.state.input);
        this.setState({tasks: this.state.tasks});
        let column = store.selectedColumn;
        let jiraTasksText = this.state.tasks.join(',');
        store.selectedColumn.jiraTasks = jiraTasksText;
        Api.put("/api/flon/column/" + column.id + "/jiraTasks", jiraTasksText);
    }
}

EditJiraListView.propTypes = {
    //node: PropTypes.object
};
