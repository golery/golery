import React, {Component} from "react";
import styles from './GoGoPage.css';
import coreStyles from './Core.css';

import EventRest from './EventRest';
import Footer from './Footer';

class GoGoPage extends Component {
    constructor(props) {
        super(props);

        this._onCreateEvent = this._onCreateEvent.bind(this);
        this.state = {name: '', email: ''};
    }

    render() {
        const onChangeName = e => {
            this.setState({name: e.target.value}, null);
            this.forceUpdate(null);
        };
        const onChangeEmail = e => {
            this.setState({email: e.target.value}, null);
            this.forceUpdate(null);
        };

        return <div className={`${coreStyles.body} ${styles.component}`}>
            <div className={styles.brandNameHolder}>
                <div className={styles.brandName}>GoEvent</div>
                <div className={styles.slogan}>Schedule events with your friends !</div>
            </div>
            <div className={styles.demoButtonHolder}>
                <a className={coreStyles.button} href="/#/gogo/view/000000000000000000000000">Demo</a>
            </div>
            <div className={styles.createFormHolder}>
                <label>Event name</label>
                <div><input value={this.state.name} onChange={onChangeName} placeholder="Event name"/></div>
                <label>Your email</label>
                <div><input value={this.state.email} onChange={onChangeEmail} placeholder="Your email"/></div>
            </div>
            <div>
                <a className={coreStyles.button} onClick={this._onCreateEvent}>Create Event</a>
            </div>
            <Footer/>
        </div>;
    }

    _onCreateEvent() {
        EventRest.createEvent(this.state.name, this.state.email).then(event => {
            if (!event._id) return;
            window.location.href = "/#/gogo/edit/" + event._id;
        });
    }
}

export default GoGoPage;
