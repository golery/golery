import React from 'react';
import PropTypes from 'prop-types';

import Dialog from "../Core/Dialog/ModalDialog";
import OptionView from "./OptionView";
import Storage from "../Core/Storage/Storage";
import JsYaml from "js-yaml";

import styles from './CalendarPage.scss';

const STORAGE_KEY_YML = 'yml';
export default class CalendarPage extends React.Component {
    constructor(props) {
        super(props);
        this.storage = new Storage('Calendar');
        this.state = {
            firstSprintDate: new Date(),
            firstSpringId: 1
        };
        this.state = this._loadState();
    }

    _loadState() {
        let text = this.storage.get(STORAGE_KEY_YML);
        let obj = JsYaml.safeLoad(text);
        let newState = {
            firstSprintId: obj.firstSprintId,
            firstSprintDate: new Date(obj.firstSprintDate)
        };

        console.log('Load state', obj);
        return newState;
    }

    _renderWeek(monday, startCurrSprint, endCurrSprint) {
        return [2, 3, 4, 5, 6].map((dayOfWeek, i) => {
            let day = new Date(monday);
            day.setDate(monday.getDate() + (dayOfWeek - 2));
            let text = day.getDate();
            let currentSprint = day.getTime() > startCurrSprint.getTime() && day.getTime() <= endCurrSprint.getTime();
            let styleCurrent = currentSprint ? styles.currentWeek : '';
            return <div key={i} className={styles.dayCell + ' ' + styleCurrent}>{text}</div>;
        });
    }

    async _onOption(e) {
        e.preventDefault();
        e.stopPropagation();

        let modal = new Dialog();
        let inner = <div className={styles.optionDialog}>
            <OptionView resolve={modal.resolve} reject={modal.reject}/>
        </div>;
        let yml = await modal.show(inner);
        this.storage.put(STORAGE_KEY_YML, yml);
        this.setState(this._loadState());
    }

    _findCurrentSprint() {
        let id = this.state.firstSprintId;
        let start = this.state.firstSprintDate;
        if (!start || isNaN(start.getTime())) {
            start = new Date();
            id = 1;
        }
        let now = new Date();
        while (true) {
            let end = new Date(start);
            end.setDate(end.getDate() + 14);
            if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime() || id > 1000) {
                return {id, start, end};
            }
            start = end;
            ++id;
        }
    }

    render() {
        let {id, start, end} = this._findCurrentSprint();
        let monday = this._findMonday(start);
        let weeks = [-1, 0, 1, 2, 3].map((weekDiff, i) => {
            let first = new Date(monday);
            first.setDate(first.getDate() + 7 * weekDiff);
            let line = this._renderWeek(first, start, end);
            return <div className={styles.lineHolder} key={i}>
                {line}
            </div>
        });

        return <div className={styles.component}>
            <div className={styles.title}>Sprint #{id}</div>
            {weeks}
            <div className={styles.optionHolder}><a href={'#'} onClick={e => this._onOption(e)}>Options</a></div>
        </div>;
    }

    _findMonday(date) {
        let monday = new Date(date);
        let day = monday.getDay();
        if (day === 0) {
            monday.setDate(date.getDate() + 1);
        } else if (day > 1) {
            monday.setDate(date.getDate() - (day - 1));
        }
        return monday;
    }
}

CalendarPage.propTypes = {
    //node: PropTypes.object
};
