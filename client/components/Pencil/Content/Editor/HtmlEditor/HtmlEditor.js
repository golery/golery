import React from 'react';
import DOMPurify from 'dompurify';
import styles from './HtmlEditor.css';
import PropTypes from 'prop-types';

import {GoleryEditor} from "golery-editor/dist/index.dev";

// import "antd/dist/antd.css";


/**
 * Pure Html editor. It does not know about the node data
 * */
export default class HtmlEditor extends React.Component {
    constructor(props) {
        super(props);
        console.log('Create HtmlEditor Object');
        this.elmToolbarHolder = null;

        this.goleryEditor = React.createRef();
    }

    render() {
        let {html, value, onChange} = this.props;
        this.hasContent = !!html;
        // html = this.hasContent ? DOMPurify.sanitize(html) : this.placeHolder;

        return <div className={this._getContentEditableClassName()}>
            <GoleryEditor value={value}
                          onChange={onChange}
                          readOnly={false}
                          autoFocus={true}
                          ref={this.goleryEditor}/>
        </div>;
    }


    _getContentEditableClassName() {
        let className = this.props.contentEditableClassName || '';
        let classEmpty = '';//this.hasContent ? '' : styles.emptyMinimize;
        return [className, styles.contentEditable, classEmpty].join(' ');
    }


    _onChange(change) {
        let value = change.value;
        let innerHtml = serializer.serialize(value);
        console.log('OnChange', innerHtml);

        this.setState({value: value});

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