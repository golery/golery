import React from 'react';

import styles from './HtmlContentView.css';
import htmlContentStyles from '../../HtmlContent.css';

export default class HtmlContentView extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
    }

    componentDidMount() {

    }

    render() {
        let {html} = this.props;
        return <div className={[styles.component, htmlContentStyles.html].join(' ')}>
            <div dangerouslySetInnerHTML={{__html: html}}/>
        </div>;
    }
}

HtmlContentView.propTypes = {
    //options: PropTypes.array
};
