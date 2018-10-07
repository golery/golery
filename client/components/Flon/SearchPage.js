import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import Api from "./Api";

import styles from './SearchPage.scss';
import {store} from './Store';

export default class SearchPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {query: "", queryResult: []};
    }

    render() {
        return <div className={styles.component}>
            <div className={styles.header1}>
                FLON
            </div>
            <div className={styles.header2}>
                DB schema documentation system
            </div>
            <form className={styles.form}>
                <input type="text" className={styles.searchInput} autoFocus={true} onChange={(e) => this._onChange(e)}
                       value={this.state.query}/>
            </form>
            <div className={styles.result}>
                {this.state.queryResult.map((result, index) =>
                    <div className={styles.resultEntry} key={index}>
                        <div className={styles.table}>
                            <Link
                                to={"/table/" + result.column.tableId}>{result.tableName}</Link>
                            ::
                            <Link to={"/column/" + result.column.id}
                                  onClick={() => this._setColumn(result.column)}>{result.column.name}</Link>
                        </div>
                        <div className={styles.description}>
                            {result.column.description}
                        </div>
                    </div>
                )}
            </div>
        </div>;
    }

    _setColumn(column) {
        store.selectedColumn = column;
    }

    _onChange(e) {
        let query = e.target.value;
        this.setState({query: query});

        console.log(query);
        fetch(Api.path + "/api/flon/query?q=" + encodeURIComponent(query)).then(r => r.json()).then(
            (list) => this.setState({queryResult: list})
        );
    }
}

SearchPage.propTypes = {
    //node: PropTypes.object
};
