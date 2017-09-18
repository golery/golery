import React from 'react';

import styles from './AddCardPage.css';

export default class AddCardPage extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
    }

    componentDidMount() {

    }

    render() {
        return <div className={styles.card} onKeyDown={this.onKeyDown} tabIndex="1"
                    ref={elmCard => elmCard && elmCard.focus()}>
            <div className={styles.content}>
                <div className={styles.cardHead} contentEditable={true}>HEAD</div>
                <div>
                    <div className={styles.separator}></div>
                </div>
                <div className={styles.cardBody} contentEditable={true}>
                    BODY
                </div>
                <div>
                    <button>Save</button>
                    <button onClick={() => this._onClickCancel()}>Cancel</button>
                </div>
            </div>
        </div>;
    }

    _onClickCancel() {
        this.props.history.go(-1);
    }
}

AddCardPage.propTypes = {
    //options: PropTypes.array
};

