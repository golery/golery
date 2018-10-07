import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

import styles from './TablePage.scss';

export default class TablePage extends React.Component {
    constructor(props) {
        super(props);

        let {match} = props;
        let tableId = match.params.tableId;
        console.log(tableId);
        this.state = {table: null};

        fetch("http://localhost:8100/api/flon/table/" + tableId).then(r => r.json()).then(
            (table) => this.setState({table: table})
        );
    }

    render() {
        let {table} = this.state;
        if (table == null) {
            return <div>Loading...</div>;
        }

        return <div className={styles.component}>
            <div className={styles.tableName}>Table {table.table.name}</div>
            <div className={styles.fieldListSection}>
                <table>
                    <tbody>
                    {table.columns.map(column =>
                        <div className={styles.field} key={column.name}>
                            <div className={styles.columnName}>
                                <Link to={"/column/" + column.id}>
                                    {column.name}
                                </Link>
                            </div>
                            <div className={styles.columnDescription}>{column.description}</div>
                        </div>)}
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

TablePage.propTypes = {
    //node: PropTypes.object
};
