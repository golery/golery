import React from 'react';
import styles from './PollSelectionView.css';
export default class PollSelectionView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    render() {
        let {section, users, userIndex} = this.props;
        let user = users[userIndex];

        let optionElms = this._renderOptions(section.polls, users, user);

        return <div className={styles.component}>
            <div className={styles.headerHolder}>
                <div className={styles.header}>{section.name}</div>
                <div className={styles.headerBar}></div>
            </div>
            <div>
                {optionElms}
            </div>
        </div>;
    }

    _renderOptions(options, users, user) {
        let selectMap = {};
        let maxSelection = 0;
        for (let option of options) {
            let userSelected = this._findUserSelected(option._id, users);
            selectMap[option._id] = userSelected;
            if (userSelected.length > maxSelection) {
                maxSelection = userSelected.length;
            }
        }

        return options.map((option, i) => {
            let isChecked = user.pollOptions && user.pollOptions.indexOf(option._id) >= 0;
            let userSelected = selectMap[option._id];
            let elmUserSelected = isChecked ? this._renderUserSelected(userSelected) : [];
            let classCheck = isChecked ? styles.check : styles.uncheck;
            let classMaxSelect = userSelected.length === maxSelection && maxSelection > 0 ? styles.maxSelect : '';
            let classSelectioinHolder = [styles.selectionHolder, classCheck, classMaxSelect].join(' ');
            return <div className={classSelectioinHolder} key={i}
                        onClick={e => {
                            this._onSelect(user, option);
                            this.setState(this.state);
                        }}>
                <div>
                    <div className={styles.colRight}>
                        <div>
                            <span className={styles.numberPeople}>{userSelected.length}</span>
                            <span className={styles.iconMan}/>
                        </div>
                    </div>
                    <div className={styles.colLeft}>
                        <span className={styles.checkIcon}/>
                    </div>
                    <div className={styles.colMiddle}>
                        <span className={styles.optionText}>{option.name}</span>
                    </div>
                </div>
                <div className={styles.userSelectedHolder}>
                    {elmUserSelected}
                </div>
            </div>
        });
    }

    _renderUserSelected(users) {
        let elmUsers = users.map((user, i) => {
            return (i == 0 ? '' : ', ') + user.name;
        });
        return <div>{elmUsers}</div>
    }

    _onSelect(user, option) {
        let readOnly = this.props.readOnly;
        if (readOnly) return;

        let optionId = option._id;
        if (typeof user.pollOptions === 'undefined' || user.pollOptions == null) {
            user.pollOptions = [optionId];
            return;
        }

        let index = user.pollOptions.indexOf(optionId);
        if (index >= 0) {
            user.pollOptions.splice(index, 1);
        } else {
            user.pollOptions.push(optionId);
        }
    }

    _findUserSelected(optionId, users) {
        let userSelected = [];
        for (let user of users) {
            if (user.pollOptions && user.pollOptions.indexOf(optionId) >= 0) {
                userSelected.push(user);
            }
        }
        return userSelected;
    }
}

