import React from "react";
import ReactDOM from "react-dom";

import styles from './ModalDialog.css';

/** ModalDialog implements a dialog with promise */

class ModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this._onCancel = this._onCancel.bind(this);
    }

    render() {
        return <div className={styles.backdrop} onClick={this._onCancel}>
            <div className={styles.modal}
                 onClick={(e) => {
                     console.log('xxx');
                     e.preventDefault();
                     e.stopPropagation();
                 }}>
                {this.props.children}
                <div className={styles.close} onClick={this._onCancel}>&#10006;</div>
            </div>
        </div>;
    }

    componentWillUnmount() {
    }

    _onCancel(e) {
        e.stopPropagation();
        e.preventDefault();

        if (!!this.props.cancelListener) {
            this.props.cancelListener();
        }
    }
}

/**
 * ModalDialog implements a dialog with promise
 * Usage:
 * <pre>
 * _onInsertImage() {
        let modal = new ModalDialog();
        let elm = <UploadImageDialog resolve={modal.resolve} reject={modal.reject}/>;

        modal.show(elm).then((url) => {
            console.log(url);
        }).catch((e) => {
            console.log('catch', e);
        });
    }
 </pre>
 * */
export default class ModalDialog {
    constructor() {
        this._resolveHandler = null;
        this._rejectHandler = null;
        this._elm = null;

        this._onCancel = this._onCancel.bind(this);
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
    }

    resolve(o) {
        this._close();
        if (this._resolveHandler) {
            this._resolveHandler(o);
        }
    }

    reject(o) {
        this._close();
        if (this._rejectHandler) {
            this._rejectHandler(o);
        }
    }

    show(dialogInner) {
        // create an element at the end of body
        let elm = this._elm = document.createElement('div');
        // this id is just for debug purpose only. It's not used
        elm.id = 'modalDialog';
        document.body.appendChild(elm);

        return this.promise = new Promise((resolve, reject) => {
            this._resolveHandler = resolve;
            this._rejectHandler = reject;

            // Then render modal inside
            ReactDOM.render(<ModalComponent cancelListener={this._onCancel}>{dialogInner}</ModalComponent>, elm);
        });
    }

    // When click cancel, reject promise
    _onCancel() {
        this.reject('User cancel dialog');
    }

    // Remove modal from dom and react
    _close() {
        if (this._elm) {
            // free react memory
            ReactDOM.unmountComponentAtNode(this._elm);
            // delete element
            this._elm.remove();
        }
    }
}
