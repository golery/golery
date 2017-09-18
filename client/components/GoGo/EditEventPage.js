import React from 'react';
import {Link} from 'react-router-dom';

import styles from './EditEventPage.css';
import coreStyles from './Core.css';
import EditPollView from './EditPollView';
import EventRest from './EventRest';
import Footer from './Footer';

export default class EditEventPage extends React.Component {
    constructor(props) {
        super(props);
        this._onSaveSection = this._onSaveSection.bind(this);
        this._onSave = this._onSave.bind(this);

        this.eventId = this.props.match.params.eventId;
        this.state = {event: null};
    }

    componentDidMount() {
        EventRest.findEvent(this.eventId).then(o => {
            this.setState({event: o});
        });
    }

    render() {
        let event = this.state.event;
        if (!event) return <div>Loading</div>;

        let section = event.sections[0];
        if (!section.pollOptions) section.pollOptions = [];
        let pollOptions = section.pollOptions;

        const onChangeDescription = e => {
            event.description = e.target.value;
            this.forceUpdate(null);
        };
        let onChangeEventName = (e) => {
            event.name = e.target.value;
            this.forceUpdate(null);
        };
        let onChangeSectionName = (e) => {
            section.name = e.target.value;
            this.forceUpdate(null);
        };
        return <div className={coreStyles.core}>
            <div className={coreStyles.body}>
                <div className={styles.topButtonsHolder}>
                    <Link className={coreStyles.button} to={`/gogo/view/${this.eventId}`}>View</Link>
                    <a className={coreStyles.button} onClick={o => this._onSave(this.state.event)}>Save</a>
                </div>
                <div>
                    <input className={styles.eventName} value={event.name} onChange={onChangeEventName}/>
                    <textarea className={styles.eventDescription} value={event.description}
                              onChange={onChangeDescription}/>
                </div>
                <div>
                    <input className={styles.sectionName} value={section.name} onChange={onChangeSectionName}/>
                    <EditPollView pollOptions={pollOptions} saveListener={() => this._onSaveSection(section)}/>
                </div>
                <Footer/>
            </div>
        </div>;
    }

    _onSaveSection(section) {
        EventRest.updateSection(section);
    }

    _onSave(event) {
        EventRest.updateEvent(event);
    }
}
