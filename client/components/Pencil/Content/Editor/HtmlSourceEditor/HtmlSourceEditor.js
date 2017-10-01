import React from 'react';

import Toolbar from '../../../Toolbar';

import styles from './HtmlSourceEditor.css';

export default class HtmlSourceEditor extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);

        let commands = this.toolbarCommands = [];
        Toolbar.addCommand(commands, this, 'Clean', this._onCleanUp, 'fa fa-bold');

        let html = this.props.html == null ? '' : this.props.html;
        this.state = {html: html};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({html: nextProps.html == null ? '' : nextProps.html});
    }

    render() {
        return <div className={styles.component}>
            <textarea className={styles.textArea} value={this.state.html} onChange={this._onChange}/>
        </div>;
    }

    _onChange(event) {
        this.setState({html: event.target.value});
        this.props.updateListener(this.props.editingContext, this.state.html);
    }

    _onCleanUp() {
        this.props.html = html;
    }
}

