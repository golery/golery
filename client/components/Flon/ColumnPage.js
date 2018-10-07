import React from 'react';
import PropTypes from 'prop-types';

import ModalDialog from '../Core/Dialog/ModalDialog';
import EditJiraListView from './EditJiraListView';

import styles from './ColumnPage.scss';
import {store} from './Store';

export default class ColumnPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {column: store.selectedColumn, editDescription: false};
        if (this.state.column == null) {
            let {match} = props;
            let columnId = match.params.columnId;
            fetch("http://localhost:8100/api/flon/column/" + columnId).then(r => r.json())
                .then(column => {
                    this.setState({column: column, editDescription: false});
                    store.selectedColumn = column;
                });
        }
    }

    render() {
        let {column} = this.state;
        if (column == null) {
            return <div>Loading...</div>;
        }
        let jiraTasks = column.jiraTasks ? column.jiraTasks.split(",") : [];
        return <div className={styles.component}>
            <div>{column.name}</div>
            <div>{column.label}</div>
            <div className={styles.description} contentEditable={this.state.editDescription}
                 ref={(r) => this._elmDescription = r}>
                Description: {column.description}
            </div>
            <div>
                <div className={styles.button} onClick={() => this._onEdit()}>
                    {this.state.editDescription ? "Save" : "Edit description"}
                </div>
                {jiraTasks.map(task => <div>{task}</div>)}
                <div>
                    <div className={styles.button} onClick={() => this._onJira()}>Edit jira tasks</div>
                </div>
            </div>
        </div>;
    }

    _onEdit() {
        let editing = this.state.editDescription;
        this.setState({editDescription: !editing});

        if (editing && this._elmDescription) {
            let description = this._elmDescription.innerText;
            fetch("http://localhost:8100/api/flon/column/" + this.state.column.id + "/description", {
                method: "PUT",
                body: description
            });
        }
    }

    _onJira() {
        let dialog = new ModalDialog();
        let elm = <EditJiraListView/>
        dialog.show(elm).then(() => this.forceUpdate()).catch(() => this.forceUpdate());
    }
}

ColumnPage.propTypes = {
    //node: PropTypes.object
};
