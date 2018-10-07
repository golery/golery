import React from 'react';
import {HashRouter as Router, Route} from "react-router-dom";

import SearchPage from './SearchPage';
import TablePage from './TablePage';
import ColumnPage from './ColumnPage';

export default class FlonPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Router>
            <div>
                <Route exact path="/" component={SearchPage}/>
                <Route path="/table/:tableId" component={TablePage}/>
                <Route path="/column/:columnId" component={ColumnPage}/>
            </div>
        </Router>
    }

}

FlonPage.propTypes = {
    //node: PropTypes.object
};
