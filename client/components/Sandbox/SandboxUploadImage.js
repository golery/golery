import React from 'react';
import {openUploadImageDialog} from "../Pencil/Content/Editor/HtmlEditor/Image/UploadImageDialog";
import UploadImageDialog from "../Pencil/Content/Editor/HtmlEditor/Image/UploadImageDialog";

export default class Sandbox extends React.Component {

    componentDidMount() {
        // this._load();
    }

    _load() {
        openUploadImageDialog();
    }

    render() {
        return (
            <div>
                <div><button onClick={() => this._load()}>Open popup</button></div>
                <div style={{'textAlign': 'center', width: '15rem'}}><UploadImageDialog/></div>
        </div>);
    }
}