import React from 'react';

import styles from './AccreditPage.css';
export default class AccreditPage extends React.Component {
    componentDidMount() {

    }


    render() {
        // Ref. /work/www/www2/public/images/README.md
        let fca1 = <a href="http://www.freepik.com/free-photos-vectors/pencil">Pencil vector created by Freepik</a>;
        let fca2 = <a href="http://www.freepik.com/free-photos-vectors/hand">Hand vector created by Freepik</a>;
        let fca3 = <a href="http://www.freepik.com/free-photos-vectors/logo">Logo vector created by Macrovector -
            Freepik.com</a>;
        let fca4 = <a href="http://www.freepik.com/free-photos-vectors/calendar">Calendar vector created by Rosapuchalt
            - Freepik.com</a>;
        let fac5 = <a href="http://www.freepik.com/free-photos-vectors/technology">Technology vector created by
            Freepik</a>;
        return <div className={styles.component}>
            <div>
                <h1>FreePick</h1>
                <ol>
                    <ol>
                        <li>{fca1}</li>
                        <li>{fca2}</li>
                        <li>{fca3}</li>
                        <li>{fca4}</li>
                        <li>{fca5}</li>
                    </ol>
                </ol>
            </div>
        </div>;
    }
}
