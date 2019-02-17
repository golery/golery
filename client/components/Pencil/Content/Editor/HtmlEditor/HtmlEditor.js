import React from 'react';
import styles from './HtmlEditor.css';
import PropTypes from 'prop-types';

import GoleryEditorLib from "golery-editor";
let {GoleryEditor} = GoleryEditorLib;


/**
 * Pure Html editor. It does not know about the node data
 * */
export default class HtmlEditor extends React.Component {
    constructor(props) {
        super(props);
        this.goleryEditor = React.createRef();
    }

    render() {
        let {value, onChange, contentEditableClassName, ...rest} = this.props;
        return (
            <div className={contentEditableClassName}>
                <GoleryEditor
                    value={value}
                    onChange={onChange}
                    readOnly={false}
                    {...rest}
                    ref={this.goleryEditor}
                />
            </div>
        );
    }

    focus() {
        this.goleryEditor.current.editor.focus();
    }

}

HtmlEditor.propTypes = {
    html: PropTypes.string,
    placeHolder: PropTypes.string,
    contentEditableClassName: PropTypes.string,
    toolbar: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
};