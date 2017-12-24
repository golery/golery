import React from "react";
import styles from "./LandingPage.css";
import imgPencilLanding from "./images/pencil-landing.png";
import imgPencilLandingMobile from "./images/pencil-landing-mobile.png";

class AppDetail extends React.Component {
    render() {
        return <div className={styles.appDetail}>
            <div className={styles.appTextHeadMobile}><a href={this.props.href}>{this.props.title}</a></div>
            <div className={styles.colLeft}>
                <div className={styles.imageScreenshotHolder}>
                    <div className={styles.gradientHolder}>
                        <img className={styles.imageScreenshot} src={this.props.image}/>
                    </div>
                    <div className={styles.imageScreenshotGradient}/>
                </div>
            </div>
            <div className={styles.colRight}>
                <div className={styles.appDetailTextBlock}>
                    <div className={styles.appTextHeadDesktop}><a href={this.props.href}>{this.props.title}</a></div>
                    <div className={styles.appTextBody}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openOtherAppDetails: false
        };
    }

    render() {
        let {openOtherAppDetails} = this.state;

        let elmOtherAppDetail = openOtherAppDetails ? this.getOpenAppDetails() :
            <div><a href="#" onClick={() => this._openOtherAppDetails()}>Other apps</a></div>;
        return <div className={styles.component}>
            <div className={styles.pencilLandingBanner}>
                <a href="/pencil">
                    <picture>
                        <source media='(min-width: 480px)'
                                srcSet={imgPencilLanding}/>
                        <source media='(max-width: 480px)'
                                srcSet={imgPencilLandingMobile}/>
                        <img src={imgPencilLanding}/>
                    </picture>
                </a>
            </div>
            {elmOtherAppDetail}
            <div className={styles.pageFooter}>Copyright © 2017 - 2017 Golery™ — All rights reserved</div>
        </div>;
    }

    getOpenAppDetails() {
        return <div>
            <AppDetail image="https://i.imgur.com/DSNxUFG.jpg" title="Go Event" href="/goevent">
                You're going to have a party soon ! <br/>
                Have a list of options to ask your friend to vote for. <br/>
                GoEvent allows you to create a quick poll to collect opinion about places, time, options.
                <br/>
                And there are much more !
            </AppDetail>

            <AppDetail image="https://i.imgur.com/JJcVFSC.jpg" title="Unix Timestamp Converter"
                       href="/unix-timestamp-converter">
                Convert unix timestamp to locale time or UTC time.
            </AppDetail>

            <AppDetail image="https://i.imgur.com/qDqa67k.png" title="JSON formatter" href="/json-formatter">
                Format JSON.
            </AppDetail>

            <AppDetail image="https://i.imgur.com/XCU4jXn.png" title="CountIt" href="#/app/counter">
                Count anything.
            </AppDetail>
        </div>;
    }

    _openOtherAppDetails() {
        this.setState({openOtherAppDetails: !this.state.openOtherAppDetails});
    }
}

