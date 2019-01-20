import React from 'react';

import styles from './OptionView.scss';

export default class OptionView extends React.Component {
    constructor(props) {
        super(props);
        this.pre = React.createRef();
    }

    _onSave() {
        let {resolve} = this.props;

        let yml = this.pre.current.innerText;
        resolve(yml);
    }

    render() {
        let text = (
`firstSprintId: 90
firstSprintDate: 2019-01-14
`);

        return <div className={styles.component}>
            Edit the options in yml format
            <pre className={styles.contentEditable} contentEditable={true} ref={this.pre}>
                {text}
            </pre>
            <div className={styles.buttonHolder}><div className={styles.button} onClick={()=>this._onSave()}>Save</div></div>
        </div>;
    }
}