import React from 'react';
import ReactDOM from "react-dom";
import DOMPurify from 'dompurify';

import styles from './TitleEditor.css';

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
 * Editor for the title.
 * It shows placeholder text when the content is empty.
 * */
export default class TitleEditor extends React.Component {
    constructor(props) {
        super(props);
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

        let contentEditableClassNames = this._getContentEditableClassName();
        return <div className={styles.component}>
            <div contentEditable
                 className={contentEditableClassNames}
                 dangerouslySetInnerHTML={{__html: html}}
                 onInput={() => this._onChange()}
                 onPaste={(e) => this._onPaste(e)}
                 ref={elmEdit => this.elmEdit = elmEdit}/>
        </div>;
    }

    /** Paste only plain text */
    _onPaste(e) {
        e.preventDefault();
        e.stopPropagation();

        let text = e.clipboardData.getData('text/plain');
        if (!text) {
            return;
        }

        this._insertTextAtCursor(text);
    }

    _insertTextAtCursor(text) {
        var sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
            }
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = text;
        }
    }

    _getContentEditableClassName() {
        let className = this.props.contentEditableClassName || '';
        return [className, styles.contentEditable].join(' ');
    }

    _onChange() {
        let innerHtml = this.elmEdit.innerHTML;
        if (this.props.onChange) {
            this.props.onChange(innerHtml, this.props.editingContext);
        }
    }

    focus() {
        this.elmEdit.focus();
    }
}

TitleEditor.propTypes = {
    html: PropTypes.string,
    contentEditableClassName: PropTypes.string,
    onChange: PropTypes.func
};