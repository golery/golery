import React from "react";
import styles from "./LandingPage.css";

class AppLauncher extends React.Component {
    render() {
        return <div className={styles.appHolder}>
            <a className={`${styles.appIcon} ${this.props.style}`} href={this.props.href}/>
            <div className={styles.appName}>{this.props.name}</div>
            <div className={styles.appDescription}>{this.props.desc}</div>
        </div>;
    }
}

class AppDetail extends React.Component {
    render() {
        return <div className={styles.appDetail}>
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
                    <div className={styles.appTextHead}><a href={this.props.href}>{this.props.title}</a></div>
                    <div className={styles.appTextBody}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default class LandingPage extends React.Component {
    render() {
        return <div className={styles.component}>
            <div className={styles.goleryHolder}>
                <div className={styles.golery}>GOLERY</div>
            </div>
            {/*<div><Link to={{pathname: `/login`}}>Login</Link></div>*/}
            {/*<div><a href="api/session">Session</a></div>*/}
            <div className={styles.appList}>
                <AppLauncher style={styles.pencilIcon} href="#/pencil/" name="PENCIL"
                             desc="Save your knowledge in tree"/>
                <AppLauncher style={styles.checkbookIcon} href="/goevent" name="GOEVENT"
                             desc="Schedule events"/>
            </div>
            <div className={styles.appList}>
                <AppLauncher style={styles.menuIcon} href="#/shop/menu/" name="MENU"
                             desc="Resto menu"/>
                <AppLauncher style={styles.tryHtmlIcon} href="/tryhtml/" name="PUBLISH HTML"
                             desc="Publish a HTML snippet"/>
                <AppLauncher style={styles.tryHtmlIcon} href="#/app/counter" name="COUNTER"
                             desc="Click to count"/>
            </div>

            <AppDetail image="https://i.imgur.com/rID4P7q.png" title="Pencil" href="/pencil">
                Write down your ideas !<br/>
                Take note in your class. <br/>
                Keep track of your knowledge in tree structure <br/>
            </AppDetail>

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

            <div className={styles.pageFooter}>Copyright © 2017 - 2017 Golery™ — All rights reserved</div>
        </div>;
    }
}

