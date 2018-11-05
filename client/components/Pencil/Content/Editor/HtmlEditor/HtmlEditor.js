import React from 'react';
import DOMPurify from 'dompurify';
import styles from './HtmlEditor.css';
import PropTypes from 'prop-types';

import GoleryEditor, {SlateHtmlSerializer, SlateEditorHtmlDefaultRule, SlateValue} from "golery-editor/dist/index.dev";

import "antd/dist/antd.css";

const serializer = new SlateHtmlSerializer({ rules: SlateEditorHtmlDefaultRule });

/**
 * Pure Html editor. It does not know about the node data
 * */
export default class HtmlEditor extends React.Component {
    constructor(props) {
        super(props);
        console.log('Create HtmlEditor Object');
        this.elmToolbarHolder = null;

        let {html} = this.props;
        this.state = {
            value: serializer.deserialize(html)
        };

        this.goleryEditor = React.createRef();
    }

    render() {
        let {html} = this.props;
        this.hasContent = !!html;
        html = this.hasContent ? DOMPurify.sanitize(html) : this.placeHolder;

        return <div className={styles.component}>
            <div className={styles.toolbarHolder} ref={ref => this.elmToolbarHolder = ref}/>
            <GoleryEditor value={this.state.value}
                          onChange={(change)=> this._onChange(change)}
                          readOnly={false}
                          autoFocus={true}
                          className={this._getContentEditableClassName()}
                          ref={this.goleryEditor}
            />
        </div>;
    }


    _getContentEditableClassName() {
        let className = this.props.contentEditableClassName || '';
        let classEmpty = this.hasContent ? '' : styles.emptyMinimize;
        return [className, styles.contentEditable, classEmpty].join(' ');
    }


    _onChange(change) {
        this.setState({value: change.value});
        let innerHtml = serializer.serialize(this.state.value);
        console.log('OnChange', innerHtml);
        this.hasContent = innerHtml !== "";
        if (this.props.onChange) {
            this.props.onChange(innerHtml, this.props.editingContext);
        }
    }

    focus() {
        // this.goleryEditor.current.focus();
    }

}

HtmlEditor.propTypes = {
    html: PropTypes.string,
    placeHolder: PropTypes.string,
    contentEditableClassName: PropTypes.string,
    toolbar: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
};