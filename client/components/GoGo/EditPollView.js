import React from 'react';
import PropTypes from 'prop-types';

import styles from './EditPollView.css';
import coreStyles from './Core.css';
import deleteIcon from './images/delete.svg';
import threeLines from './images/threelines.svg';

export default class EditPollView extends React.Component {
    constructor(props) {
        super(props);
        this._onAdd = this._onAdd.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onDelete = this._onDelete.bind(this);

        this.state = {pollOptions: props.pollOptions};
    }

    render() {
        let {pollOptions} = this.state;
        let elmOptions = this._renderOptions(pollOptions);
        return <div className={styles.component}>
            {elmOptions}
            <div>
                <a className={coreStyles.button} onClick={()=>this._onAdd(pollOptions)}>Add</a>
            </div>
        </div>;
    }

    _onAdd(pollOptions) {
        pollOptions.push({name: 'new name'});
        this.setState({pollOptions});
    }

    _renderOptions(options) {
        return options.map((option, i) => {
            return <div className={styles.optionHolder} key={i}>
                <input type="text" value={option.name} onChange={(e) => this._onChange(option, e.target.value)}/>
                <div className={styles.deleteButton} onClick={() => this._onDelete(options, i)}>
                    <img className={styles.deleteIcon} src={deleteIcon}></img>
                </div>
                <div className={styles.moveHandler} onClick={() => this._onDelete(options, i)}>
                    <img className={styles.moveHandlerIcon} src={threeLines}></img>
                </div>
            </div>;
        });
    }

    _onDelete(options, index) {
        options.splice(index, 1);
        this.forceUpdate();
    }

    _onChange(option, value) {
        option.name = value;
        this.forceUpdate();
    }
}

EditPollView.propTypes = {
    pollOptions: PropTypes.array
};
