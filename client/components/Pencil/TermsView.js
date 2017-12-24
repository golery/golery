import React from 'react';
import PropTypes from 'prop-types';

import styles from './TermsView.css';

export default class TermsView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles.component}>
            <h1>GOLERY TERMS OF SERVICE</h1>
            <p>(Last modified: 24-Dec-2017)</p>

            <p>By accessing and using the platform, including, without limitation, the website, the apps and all content
                and services accessed through or via the website, the apps, the services or otherwise, you accept and
                agree to be bound by the terms and provision of the TOS.
            </p>

            <p>The platform are provided “as is”, “as available”, and “with all faults”.</p>

            <p>Whilst Golery uses reasonable endeavors to correct any errors or omissions in the platform.
                Golery makes no promises, guarantees, representations or warranties of any kind whatsoever
                (express or implied) regarding the website, the apps, the services or any part or parts thereof,
                any content, or any linked services or other external services.</p>

            <p>Golery does not warrant that your use of the platform will be uninterrupted, timely, secure or
                error-free,
                that defects will be corrected, or that the platform or any part or parts thereof, the content,
                or the servers on which the platform operates are or will be free of viruses or other harmful
                components.
                Golery does not warrant that any transmission of content uploaded to the platform will be secure or that
                any elements of the platform designed to prevent unauthorized access, sharing or download of content
                will
                be effective in any and all cases, and does not warrant that your use of the platform is lawful in any
                particular jurisdiction.</p>

            <p>To the maximum extent permitted by applicable law, in no event shall Golery, its directors, employees,
                agents, or licensors be liable for any indirect, punitive, incidental, special, consequential, or
                exemplary damages, including damages for loss of profits, goodwill use, or data or other intangible
                losses, that result from the use of, or inability to use, the services or any other aspect of this
                agreement. Under no circumstances will Golery be responsible for any damage, loss, or injury resulting
                from hacking, tampering, or other unauthorized access or use of the services or your account or the
                information contained therein.</p>

            <p>We reserve the right to change, alter, replace or otherwise modify these Terms of Services at any time,
                without notification. It is your responsibility to check this page from time to time for updates.</p>

            <p>We reserve the right to refuse access to the Service to anyone for any reason at any time.</p>

            <p>You are solely responsible for your conduct and any data, text, files, information, usernames, images,
                graphics, photos, profiles, audio and video clips, sounds, musical works, works of authorship,
                applications, links and other content or materials (collectively, "Content") that you submit,
                post or display on or via the Service.</p>

            <p>You agree that you are responsible for all data charges you incur through use of the Service.</p>

            <p>We prohibit crawling, scraping, caching or otherwise accessing any content on the Service via
                automated means, including but not limited to, user profiles and photos (except as may be the result of
                standard search engine protocols or technologies used by a search engine with Instagram's express
                consent).</p>
            <p>We use so-called cookies in certain cases. You can set up your browser so that a warning appears on your
                screen before a cookie is saved. You can also opt out of the benefits of personalised cookies,
                which will mean you cannot use certain services.</p>
        </div>;
    }
}

TermsView.propTypes = {
    //node: PropTypes.object
};
