import React from 'react';
import DOMPurify from 'dompurify';

import styles from './HtmlEditor.css';

import Toolbar from '../../Toolbar';
import ModalDialog from '../../../Core/Dialog/ModalDialog';
import UploadImageDialog from './UploadImageDialog';
import TextSelection from './Utils/TextSelection';
import pastHtmlProcessor from './PasteHtmlProcessor';
import ClipboardUtils from './Utils/ClipboardUtils';

/**
 * Pure Html editor. It does not know about the node data
 * The editor receives an editingContext which is passed back to listener
 * @param props.updateListener - update listener is called for every change of editor
 * @param props.editingContext - a "blackbox" context which is passed back to updateListener
 * */
export default class HtmlEditor extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onPaste = this._onPaste.bind(this);

        this.updateListener = this.props.updateListener;
        let commands = this.treeCommands = [];
        Toolbar.addCommand(commands, this, 'Header', this._onHeader, 'fa fa-header');
        Toolbar.addCommand(commands, this, 'Bold', this._onBold, 'fa fa-bold');
        Toolbar.addCommand(commands, this, 'Italic', this._onItalic, 'fa fa-italic');
        Toolbar.addCommand(commands, this, 'Underline', this._onUnderline, 'fa fa-underline');
        Toolbar.addCommand(commands, this, 'Clear Format', this._onClearFormat, 'fa fa-eraser');

        Toolbar.addCommand(commands, this, 'Number', this._onList, 'fa fa-list-ol');
        Toolbar.addCommand(commands, this, 'Bullet', this._onBullet, 'fa fa-list-ul');
        Toolbar.addCommand(commands, this, 'Indent', this._onIndent, 'fa fa-indent');
        Toolbar.addCommand(commands, this, 'Outdent', this._onOutdent, 'fa fa-outdent');
        Toolbar.addCommand(commands, this, 'Image', this._onInsertImage, 'fa fa-image');
    }

    componentDidUpdate() {
        if (this.props.html !== this.elmEdit.innerHTML) {
            // after user edit, if the props is called with the same previous value (ex: empty)
            // the content is not updated automatically. We have to force update
            this.elmEdit.innerHTML = this.props.html;
            console.log("Force update html", this.props.html, this.elmEdit.innerHTML);
        }

    }

    render() {
        let html = this.props.html ? DOMPurify.sanitize(this.props.html) : '';

        // the div.editor contains default style for text. We cannot set directly to div.contentEditable, becaseu
        // it will generate custom attribute for innerHtml
        return <div className={styles.component}>
            <Toolbar commands={this.treeCommands}/>
            <div className={styles.editor}>
                <div contentEditable
                     className={styles.contentEditable}
                     dangerouslySetInnerHTML={{__html: html}}
                     onInput={this._onChange}
                     onPaste={this._onPaste}
                     onKeyDown={(e) => this._onKeyDown(e)}
                     ref={(elmEdit) => this.elmEdit = elmEdit}/>
            </div>
        </div>;
    }

    focusEditor() {
        this.elmEdit.focus();
    }

    _onKeyDown(e) {
        if (e.keyCode === 9) {
            if (e.shiftKey) {
                this._onOutdent();
            } else {
                this._onIndent();
            }
            e.preventDefault();
        }

    }

    _onClearFormat() {
        this._execCommand('removeFormat');
    }

    _onHeader() {
        let selection = window.getSelection();
        if (!(selection.getRangeAt && selection.rangeCount)) {
            console.log("No selection");
            return;
        }

        let range = selection.getRangeAt(0);
        let content = range.extractContents();
        let node = content.cloneNode(true);
        let e = document.createElement("div");
        let h1 = document.createElement("h1");
        e.appendChild(h1);
        h1.appendChild(node);


        console.log(e.innerHTML);
        this._execCommand('delete');
        this._execCommand('insertHTML', e.innerHTML);
    }

    _onChange() {
        this.updateListener(this.props.editingContext, this.elmEdit.innerHTML);
    }

    _execCommand(command, cmdArguments) {
        document.execCommand(command, true, cmdArguments);
        this._onChange();
    }

    _onBold() {
        this._execCommand('bold');
    }

    _onItalic() {
        this._execCommand('italic');
    }

    _onUnderline() {
        this._execCommand('underline');
    }

    _onList() {
        this._execCommand('insertOrderedList');
    }

    _onBullet() {
        this._execCommand('insertUnorderedList');
    }

    _onIndent() {
        this._execCommand('indent');
    }

    _onOutdent() {
        this._execCommand('outdent');
    }

    _onPaste(e) {
        e.preventDefault();
        e.stopPropagation();

        // if there is image in the clipboard, insert it immediately
        let blobUrl = ClipboardUtils.getFirstImageBlobUrl(e);
        if (blobUrl) {
            this._onInsertImage(blobUrl);
            return;
        }

        // otherwise, insert text
        let node = pastHtmlProcessor.process(e.originalEvent || e);
        if (node) {
            console.log('Insert', node);
            this._insertDomNodeAtCursor(node);
        }
    }

    _insertDomNodeAtCursor(htmlNode) {
        let sel, range;
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(htmlNode);
            this._onChange();
        }
    }

    _onInsertImage(blobUrl) {
        let modal = new ModalDialog();
        let elm = <UploadImageDialog blobUrl={blobUrl} resolve={modal.resolve} reject={modal.reject}/>;

        let save = TextSelection.saveSelection();
        modal.show(elm).then((url) => {
            TextSelection.restoreSelection(save);
            if (url) {
                let tagImg = document.createElement('img');
                tagImg.setAttribute('src', url);
                let tagImgHolder = document.createElement('div');
                tagImgHolder.appendChild(tagImg);
                this._insertDomNodeAtCursor(tagImgHolder);
            }
        }).catch((e) => {
            TextSelection.restoreSelection(save);
            console.log('catch', e);
        });
    }
}
