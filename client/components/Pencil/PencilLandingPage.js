import React from 'react';
import PropTypes from 'prop-types';

import styles from './PencilLandingPage.css';
import imgPencilTitle from './Assets/Landing/pencil-title-landing.png';
import imgCaptureYourIdeas from './Assets/Landing/capture-your-ideas.png';
import imgSeparator from './Assets/Landing/separator.png';
import imgName from './Assets/Landing/name.png';
import imgPassword from './Assets/Landing/password.png';
import imgPasswordAgain from './Assets/Landing/password-again.png';
import Axios from "axios";

const MODE_LOGIN = "LOGIN";
const MODE_SIGNUP = "SIGNUP";

// https://greensuisse.wixsite.com/draftdesign
export default class PencilLandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: '', confirmPassword: '', message: null, inputMode: MODE_LOGIN};
    }

    render() {
        return <div className={styles.component}>
            <div><img src={"/" + imgPencilTitle}/></div>
            <div className={styles.captureIdeaHolder}><img src={"/" + imgCaptureYourIdeas}/></div>
            <div><img src={"/" + imgSeparator}/></div>
            <form className={styles.form}>
                <div className={styles.inputHolder}>
                    <div><img className={styles.imgName} src={"/" + imgName}/>
                        <input className={styles.input} type="email"
                               value={this.state.email}
                               onChange={(e) => this.setState({email: e.target.value})}/>
                    </div>
                    <div className={styles.passwordHolder}><img className={styles.imgPassword} src={"/" + imgPassword}/>
                        <input className={styles.input} type="password"
                               value={this.state.password}
                               onChange={(e) => this.setState({password: e.target.value})}/>
                    </div>
                    {this.state.inputMode === MODE_SIGNUP ?
                        <div className={styles.passwordAgainHolder}><img className={styles.imgPasswordAgain}
                                                                         src={"/" + imgPasswordAgain}/>
                            <input className={styles.input} type="password"
                                   value={this.state.confirmPassword}
                                   onChange={(e) => this.setState({confirmPassword: e.target.value})}/>
                        </div>
                        : []}
                    <div className={styles.message}>{this.state.message}</div>
                </div>
                <div>
                    <button className={styles.button} onClick={(e) => this._onLogin(e)}>LOGIN</button>
                    <button className={styles.button}
                            onClick={(e) => this._onSignUp(e)}>{this.state.inputMode === MODE_SIGNUP ? "CREATE NEW ACCOUNT" : "SIGN UP"}</button>
                </div>
            </form>
            <div><img src={"/" + imgSeparator}/></div>
            <div>
                <div className={styles.sectionHeader}>Distract free writing mode</div>
                It's only you and the text. No distraction. Keep focus on writing.
            </div>
            <div>
                <div className={styles.sectionHeader}>Organize your ideas</div>
                Write your ideas down. Keep it in structure with tree, tags.
            </div>
            <div>
                <div className={styles.sectionHeader}>Take notes in class</div>
                Good tools to keep note in your classes every day.
            </div>
            <div className={styles.copyright}>
                Copyrigh (C) Golery.com. All right reserved
            </div>
        </div>;
    }

    _onLogin(e) {
        e.preventDefault();
        this._doLogin(this.state.email, this.state.password)
    }

    _doLogin(username, password) {
        Axios.post("/api/public/login", {
            username: username,
            password: password
        }).then(function (response) {
            location.reload();
        }).catch(error => {
            this.setState({message: 'Invalid email/password. Please try again.'});
        });
    }

    _onSignUp(e) {
        e.preventDefault();
        if (this.state.inputMode === MODE_LOGIN) {
            this.setState({inputMode: MODE_SIGNUP});
        } else {
            let {email, password, confirmPassword} = this.state;
            this._doSignUp(email, password, confirmPassword);
        }
    }

    _doSignUp(email, password, confirmPassword) {
        Axios.post("/api/public/signup", {
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }).then(function (response) {
            location.reload();
        }).catch(error => {
            let message = error.response.data.message;
            if (!message) {
                message = "Cannot sign up. Please try again."
            }
            this.setState({message: message});
        });
    }
}

PencilLandingPage.propTypes = {
    //node: PropTypes.object
};