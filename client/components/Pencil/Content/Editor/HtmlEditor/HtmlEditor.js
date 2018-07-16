import React from 'react';
import DOMPurify from 'dompurify';
import styles from './HtmlEditor.css';
import PropTypes from 'prop-types';

/**
 * Pure Html editor. It does not know about the node data
 * */
export default class HtmlEditor extends React.Component {
    constructor() {
        super();
        console.log('Create HtmlEditor Object');
        this.editor = null;
        this.elmToolbarHolder = null;
        this.elmContentEditableWithCkEditor = null;
    }

    componentDidMount() {
        if (this.elmContentEditableWithCkEditor == null) {
            this._createCkEditor(this.elmContentEditable);
        }
    }

    componentDidUpdate() {
        // if (this.props.html !== this.elmContentEditable.innerHTML) {
        //     // after user edit, if the props is called with the same previous value (ex: empty)
        //     // the content is not updated automatically. We have to force update
        //     this.elmContentEditable.innerHTML = this.props.html;
        //     console.log("Force update html", this.props.html, this.elmContentEditable.innerHTML);
        // }
    }

    render() {
        console.log('Render HtmlEditor');

        let {html} = this.props;
        this.hasContent = !!html;
        html = this.hasContent ? DOMPurify.sanitize(html) : this.placeHolder;

        return <div className={styles.component}>
            <div className={styles.toolbarHolder} ref={ref => this.elmToolbarHolder = ref}/>
            <div className={this._getContentEditableClassName()}
                 dangerouslySetInnerHTML={{__html: html}}
                 ref={(elmContentEditable) => {
                     this.elmContentEditable = elmContentEditable;
                 }}/>
        </div>;
    }

    _createCkEditor(elmContentEditable) {
        console.log('Create ckeditor');
        if (!window) return;

        // ckeditor heavily used browser native object and thus raising exception for server side
        // rendering. To avoid it, we load it when application start and set to global window object
        let Editor = window.DecoupledEditor;
        let config = {
            autosave: {
                save: () => this._onChange()
            },
            plugins: Editor.builtinPlugins
        };
        config = Object.assign(config, Editor.defaultConfig);
        Editor
            .create(elmContentEditable, config)
            .then(editor => {
                this.editor = editor;
                this.elmContentEditableWithCkEditor = elmContentEditable;
                if (this.props.addToolbar) {
                    this.props.addToolbar(this.editor.ui.view.toolbar.element);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    _getContentEditableClassName() {
        let className = this.props.contentEditableClassName || '';
        let classEmpty = this.hasContent ? '' : styles.emptyMinimize;
        return [className, styles.contentEditable, classEmpty].join(' ');
    }


    _onChange() {
        if (!this.editor) return;
        console.log('OnChange');
        let innerHtml = this.editor.getData();
        this.hasContent = innerHtml !== "";
        if (this.props.onChange) {
            this.props.onChange(innerHtml, this.props.editingContext);
        }
    }

    focus() {
        this.elmContentEditable.focus();
    }

}

HtmlEditor.propTypes = {
    html: PropTypes.string,
    placeHolder: PropTypes.string,
    contentEditableClassName: PropTypes.string,
    toolbar: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
};