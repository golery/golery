import styles from './edit-card.css';

import React from 'react';
import DOMPurify from 'dompurify';

import NodeRepo from '../../services/NodeRepo';
import HeadLineParser from '../Pencil/HeadLineParser';

/** After last edit and DELAY_SAVE_MS, the editor content is saved */
const DELAY_SAVE_MS = 1000;
export default class EditCardView extends React.Component {
    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
        this.onInput = this.onInput.bind(this);

        this.elmEdit = null;
        this.state = {node: null};

        // Time out wait for next save.
        // If there are multiple edit, only the last one (after DELAY_SAVE_MS) is saved
        this.saveTimeOut = null;

        let nodeId = this.props.params.nodeId;
        NodeRepo.find(nodeId).then((node) => {
            this.setState({node: node});
        });
    }

    onClose(e) {
        e.preventDefault();
        this.props.router.replace(`/view/${this.props.location.query.rootId}/${this.props.params.nodeId}`);
    }

    onInput(e) {
        // TODO: delay update, but force when close
        var node = this.state.node;
        let html = this.elmEdit.innerHTML;
        node.html = html;
        node.name = HeadLineParser.parseTitle(html);

        this._scheduleSave(node);
    }

    _scheduleSave(node) {
        if (this.saveTimeOut) {
            clearTimeout(this.saveTimeOut);
        }
        this.saveTimeOut = setTimeout(() => {
            this._save(node);
        }, DELAY_SAVE_MS);
    }

    _save(node) {
        NodeRepo.save(node);
    }

    render() {
        if (this.state.node == null) {
            return <div>Loading...</div>;
        }

        let html = DOMPurify.sanitize(this.state.node.html);
        return <div className={styles.editCardView}>
            <div className={styles.toolbar}><a href="#" onClick={this.onClose}>CLOSE</a> | HTML | BOLD | UNDERLINE</div>
            <div className={styles.editContent} dangerouslySetInnerHTML={{__html: html}} contentEditable
                 onInput={this.onInput}
                 ref={(elmEdit) => this.elmEdit = elmEdit}/>
        </div>;
    }
}
