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

        // when there is no content, the innerHTML can be the placeholder text.
        // we maintain this flag to know if the content is really empty or not
        this.hasContent = false;
        this.placeHolder = !!this.props.placeHolder ? this.props.placeHolder.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';

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
                 ref={elmEdit => this.elmEdit = elmEdit}/>
        </div>;
    }

    _getContentEditableClassName() {
        let className = this.props.contentEditableClassName || '';
        let classEmpty = this.hasContent ? '' : styles.emptyMinimize;
        return [className, styles.contentEditable, classEmpty].join(' ');
    }

    _onChange() {
        let innerHtml = this.elmEdit.innerHTML;
        this.hasContent = innerHtml !== "";
        if (this.props.onChange) {
            this.props.onChange(innerHtml, this.props.editingContext);
        }
    }

    /*
    TODO: set selection after set text
    onFocus={(e) => this._onFocus(e)}
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
    }*/

    focus() {
        this.elmEdit.focus();
    }
}

TitleEditor.propTypes = {
    html: PropTypes.string,
    placeHolder: PropTypes.string,
    contentEditableClassName: PropTypes.string,
    onChange: PropTypes.func
};