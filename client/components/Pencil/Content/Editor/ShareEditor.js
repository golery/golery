import React from 'react';
import PropTypes from 'prop-types';

import styles from './ShareEditor.css';
import NodeRepo from '../../../../services/NodeRepo';

export default class ShareEditor extends React.Component {
    constructor(props) {
        super(props);

        const {node} = this.props;
        const access = node.access || 0;
        this.state = {expand: false, access: access};
        this.shareUrl = this._buildShareUrl(props.node._id);
    }

    render() {
        if (!this.state.expand) {
            return <button onClick={() => this._toggleShareEditor()}>Visibility</button>;
        }

        const {node} = this.props;
        const {access} = this.state;

        let elmLink = access > 0 ?
            <a href={this.shareUrl} target="_blank">{this.shareUrl}</a> : [];

        let elmSaveButtons = access === node.access || (access === 0 && !node.access) ? [] :
            <div>
                <button onClick={() => this._onSave()}>Save</button>
                <button onClick={() => this._toggleShareEditor()}>Cancel</button>
            </div>;
        return <div className={styles.component}>
            <div>
                <select value={this.state.access} onChange={(e) => this.setState({access: parseInt(e.target.value)})}>
                    <option value="0">Private</option>
                    <option value="1">Public</option>
                </select>
                <span className={styles.linkHolder}>{elmLink}</span>
            </div>
            {elmSaveButtons}
        </div>;
    }

    _onSave() {
        const node = this.props.node;
        const access = this.state.access;
        NodeRepo.setAccess(node._id, access).then((o)=> {
            console.log(o);
            node.access = access;
            this.forceUpdate();
        });
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
