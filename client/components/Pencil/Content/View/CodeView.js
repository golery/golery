import React from 'react';
import PropTypes from 'prop-types';

import styles from './CodeView.scss';
import ModalDialog from '../../../Core/Dialog/ModalDialog';
import CodeEditor from '../Editor/CodeEditor/CodeEditor';

export default class CodeView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles.component}>
            CodeView
            <div className={styles.buttonClose} onClick={() => this._onEdit()}>Edit</div>
        </div>;
    }

    _onEdit() {
        let {code} = this.props;
        let modal = new ModalDialog();
        let elm = <CodeEditor code={code}/>;
        modal.show(elm);
    }
}

CodeView.propTypes = {
    code: PropTypes.string
};
