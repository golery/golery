import React from 'react';
import PropTypes from 'prop-types';

import styles from './SandboxEditor.scss';

import {Value} from "slate";
import Html from "slate-html-serializer";
import {DEFAULT_RULES} from "@canner/slate-editor-html";
import "antd/dist/antd.css";
import CannerEditor from "golery-editor/lib/index";

const initialValue = Value.fromJSON({
    document: {
        nodes: [
            {
                object: "block",
                type: "paragraph",
                nodes: [
                    {
                        object: "text",
                        leaves: [
                            {
                                text: "A line of text in a paragraph."
                            }
                        ]
                    }
                ]
            }
        ]
    }
});

const serializer = new Html({rules: DEFAULT_RULES});
export default class SandboxEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: initialValue
        };
    }

    render() {
        const {value} = this.state;
        const onChange = ({value}) => this.setState({value});

        return (
            <div style={{margin: "20px"}}>
                <div id={"sample"}>
                    This is test
                    <ol>
                        <li>
                            first<br/>firt of firts
                        </li>
                        <li>second</li>
                    </ol>
                </div>
                <button onClick={() => this._setHtml()}>SetHtml</button>
                <button onClick={() => this._getHtml()}>GetHtml</button>
                <CannerEditor value={value} onChange={onChange} readOnly={false}/>
            </div>
        );
    }

    _setHtml() {
        let html = document.getElementById("sample").innerHTML;
        const v = serializer.deserialize(html);
        this.setState({value: v});
        console.log(v);
    }

    _getHtml() {
        console.log("Out:", serializer.serialize(this.state.value));
    }
}

SandboxEditor.propTypes = {
    //node: PropTypes.object
};
