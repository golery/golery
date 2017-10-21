import React from 'react';
import PropTypes from 'prop-types';

import styles from './ShareEditor.css';

export default class ShareEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {expand: false, shareMode: 0};
        this.shareUrl = this._buildShareUrl(props.node._id);
    }

    render() {
        if (!this.state.expand) {
            return <button onClick={() => this._toggleShareEditor()}>Share Mode</button>;
        }

        let elmLink = parseInt(this.state.shareMode) > 0 ?
            <a href={this.shareUrl} target="_blank">{this.shareUrl}</a> : [];
        return <div className={styles.component}>
            <div>
                <select value={this.state.shareMode} onChange={(e) => this.setState({shareMode: e.target.value})}>
                    <option value="0">Only me</option>
                    <option value="1">With shared people (coming soon)</option>
                    <option value="2">Public but only those who knows the link</option>
                    <option value="3">Public and publish link</option>
                </select>
                <span className={styles.linkHolder}>{elmLink}</span>
            </div>
            <div>
                <button>Save</button>
                <button onClick={() => this._toggleShareEditor()}>Cancel</button>
            </div>
        </div>;
    }

    _toggleShareEditor() {
        this.setState({expand: !this.state.expand});
    }

    _buildShareUrl(nodeId) {
        let location = window.location;
        return location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : '') + "/pencil/" + nodeId;
    }
}

ShareEditor.propTypes = {
    //node: PropTypes.object
};
