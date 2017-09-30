import React from 'react';
import PropTypes from 'prop-types';

import styles from './PencilViewPage.css';
import TestHtmlContentView from './Content/View/Html/TestHtmlContentView';
export default class PencilViewPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = this.props.state;
        console.log(this.props);
    }
    componentDidMount()
    {

    }
    render()
    {
        return <div className={styles.component}>
            <div className={styles.body}>
                <TestHtmlContentView html={this.state.html} rootId="a" childId="b"/>
            </div>
        </div>;
    }
}

PencilViewPage.propTypes = {
    //options: PropTypes.array
};
