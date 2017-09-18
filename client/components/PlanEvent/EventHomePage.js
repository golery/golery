import React from 'react';

import styles from './EventHomePage.css';
export default class EventHomePage extends React.Component {
    constructor(props) {
        super(props);
        //this.onSave = this.onSave.bind(this);
    }

    componentDidMount() {

    }

    render() {
        return <div className={styles.component}>
            Tasty Pizza night !
            <div>At Elsa place (52 Rue de la Gare, Echallens)</div>
            <div>Date: Not defined yet ! <a href="index#/app/event/payment">Vote for a date</a></div>
            <div> 5 days left (counter)</div>
            <div>Contributions</div>
            <div>Attendees</div>
            <div>Elsa E.</div>
            <div>Nuria G.</div>
            <div>Cesla-Yves M.</div>
            <div>Joana A.</div>
            <div>Map
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d684.8187889520204!2d6.631985506339046!3d46.641080403103246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478dcd4fadb233c5%3A0x35e795ec73c40b59!2sAvenue+de+la+Gare%2C+1040+Echallens!5e0!3m2!1sen!2sch!4v1491665781260"
                    width="400" height="450" frameBorder="0" allowFullScreen></iframe>
            </div>
            <div>Utils</div>
            <div>
                <a href="index#/app/event/payment">Payment</a>
            </div>
        </div>;
    }
}
