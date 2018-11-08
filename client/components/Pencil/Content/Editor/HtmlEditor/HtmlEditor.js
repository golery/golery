import React from 'react';
import styles from './HtmlEditor.css';
import PropTypes from 'prop-types';

import {GoleryEditor} from "golery-editor/dist/index.dev";

/**
 * Pure Html editor. It does not know about the node data
 * */
export default class HtmlEditor extends React.Component {
    constructor(props) {
        super(props);
        this.goleryEditor = React.createRef();
    }

    render() {
        let {value, onChange, contentEditableClassName} = this.props;
        return <div className={contentEditableClassName}>
            <GoleryEditor value={value}
                          onChange={onChange}
                          readOnly={false}
                          autoFocus={true}
                          ref={this.goleryEditor}/>
        </div>;
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