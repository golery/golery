import React from 'react';
import ReactDOM from "react-dom";
import DOMPurify from 'dompurify';

import styles from './HtmlEditor.css';

import Toolbar from '../../../Toolbar';
import ModalDialog from '../../../../Core/Dialog/ModalDialog';
import UploadImageDialog from './UploadImageDialog';
import TextSelection from './Utils/TextSelection';
import pastHtmlProcessor from './PasteHtmlProcessor';
import ClipboardUtils from './Utils/ClipboardUtils';
import CodeEditor from '../CodeEditor/CodeEditor';
import CodeView from '../../View/CodeView';
import PropTypes from 'prop-types';

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


        // when there is no content, the innerHTML can be the placeholder text.
        // we maintain this flag to know if the content is really empty or not
        this.hasContent = false;
        this.placeHolder = !!this.props.placeHolder ? this.props.placeHolder.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';

        this._actionListeners = {
            'header': this._onHeader,
            'bold': this._onBold,
            'italic': this._onItalic,
            'underline': this._onUnderline,
            'clearFormat': this._onClearFormat,
            'number': this._onList,
            'bullet': this._onBullet,
            'indent': this._onIndent,
            'outdent': this._onOutdent,
            'image': this._onInsertImage,
            'code': this._onInsertCode
        }
    }

    fireAction(action) {
        let listener = this._actionListeners[action];
        if (listener) {
            listener.call(this);
        }
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
        let {html} = this.props;
        this.hasContent = !!html;
        html = this.hasContent ? DOMPurify.sanitize(html) : this.placeHolder;
        console.log('render');

        // the div.editor contains default style for text. We cannot set directly to div.contentEditable, becaseu
        // it will generate custom attribute for innerHtml
        let contentEditableClassNames = this._getContentEditableClassName();
        return <div className={styles.component}>
            <div className={styles.editor}>
                <div contentEditable
                     className={contentEditableClassNames}
                     dangerouslySetInnerHTML={{__html: html}}
                     onInput={this._onChange}
                     onPaste={this._onPaste}
                     onKeyDown={(e) => this._onKeyDown(e)}
                     onMouseDown={(e) => this._onMouseDown(e)}
                     onMouseUp={(e) => this._onMouseUp(e)}
                     onFocus={(e) => this._onFocus(e)}
                     onBlur={(e) => this._onBlur(e)}
                     ref={(elmEdit) => {
                         this.elmEdit = elmEdit;
                         this._renderComponentsInsideHtml(elmEdit);
                     }}/>
            </div>
        </div>;
    }

    _renderComponentsInsideHtml(elm) {
        if (elm == null) return;

        console.log(elm);
        let tags = elm.getElementsByClassName('x-pencil-code');
        for (let tag of tags) {
            ReactDOM.render(<CodeView/>, tag);
        }
    }
    _getContentEditableClassName() {
        let className = this.props.contentEditableClassName || '';
        let classEmpty = this.hasContent ? '' : styles.emptyMinimize;
        return [className, styles.contentEditable, classEmpty].join(' ');
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
        this._setToolbarVisibility(false);
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


        this._execCommand('delete');
        this._execCommand('insertHTML', e.innerHTML);
    }

    _onChange() {
        let innerHtml = this.elmEdit.innerHTML;
        this.hasContent = innerHtml !== "";
        if (this.props.onChange) {
            this.props.onChange(innerHtml, this.props.editingContext);
        }
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

    _onInsertCode() {
        let elm = document.createElement('pre');
        elm.className = 'x-pencil-code';
        elm.setAttribute('contenteditable', 'false');
        elm.innerText = 'public class Main {}';
        this._insertDomNodeAtCursor(elm);
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

    _onMouseUp() {
        if (!this.elmToolbarHolder) return;

        if (TextSelection.hasSelection()) {
            this._setToolbarVisibility(false);
            return;
        }

        this._showToolbar();
    }


    _onMouseDown(e) {
        if (e.button !== 0); {
            this._setToolbarVisibility(false)
        }
    }

    _showToolbar() {
        let selectionBound = TextSelection.getSelectionBounds();
        let toolbarBound = this.elmToolbarHolder.getBoundingClientRect();
        let {x, y} = this._computeToolbarPosition(selectionBound, toolbarBound);

        this.elmToolbarHolder.style.left = x;
        this.elmToolbarHolder.style.top = y;
        this._setToolbarVisibility(true);
    }

    _computeToolbarPosition(selectionBound, toolbarBound) {
        let x = (selectionBound.left + selectionBound.right) / 2 - toolbarBound.width / 2;
        if (x < 0) x = 0;
        let y = selectionBound.top - 15 - toolbarBound.height;
        if (y < 0) y = selectionBound.bottom + 15;
        return {x, y};
    }

    _onFocus() {
        console.log('Focus editor');
        if (!this.hasContent) {
            this.elmEdit.innerHTML = '';
            this.elmEdit.classList.remove(styles.emptyMinimize);

            // on mobile, we lose the cursor when chaning innerHtml.
            // Thus, we recreate it
            let range = document.createRange();
            range.selectNodeContents(this.elmEdit);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    _onBlur(e) {
        // if (!this.hasContent) {
        //     this.elmEdit.innerHTML = this.placeHolder;
        //     this.elmEdit.classList.add(styles.emptyMinimize);
        // }
        // this._setToolbarVisibility(false);
    }

    _setToolbarVisibility(visible) {
        if (!this.elmToolbarHolder) return;
        this.elmToolbarHolder.style.visibility = visible ? 'visible' : 'hidden';
    }

    focus() {
        this.elmEdit.focus();
    }

}

HtmlEditor.propTypes = {
    html: PropTypes.string,
    placeHolder: PropTypes.string,
    contentEditableClassName: PropTypes.string,
    toolbar: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
};