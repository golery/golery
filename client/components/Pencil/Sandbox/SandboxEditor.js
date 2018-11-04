import React from "react";
import ReactDOM from "react-dom";

import GoleryEditor, {SlateHtmlSerializer, SlateEditorHtmlDefaultRule, SlateValue} from "golery-editor/dist/index.dev";

import "antd/dist/antd.css";


const initialValue = SlateValue.fromJSON({
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

const serializer = new SlateHtmlSerializer({ rules: SlateEditorHtmlDefaultRule });

class SandboxEditor extends React.Component {
    constructor() {
        super();
        this.state = {
            value: initialValue
        };
    }

    render() {
        const { value } = this.state;
        const onChange = ({ value }) => this.setState({ value });

        return (
            <div>
                <GoleryEditor value={value} onChange={onChange} readOnly={false} debug={true}/>
            </div>
        );
    }

    _setHtml() {
        let html = document.getElementById("sample").innerHTML;
        const v = serializer.deserialize(html);
        this.setState({ value: v });
        console.log(v);
    }

    _getHtml() {
        console.log("Out:", serializer.serialize(this.state.value));
    }
}

export default SandboxEditor;