import React from 'react';
import PropTypes from 'prop-types';

import Axios from "axios";

import styles from './PencilLandingPage.css';
import imgPencilTitle from './Assets/Landing/pencil-title-landing.png';
import imgCaptureYourIdeas from './Assets/Landing/capture-your-ideas.png';
import imgSeparator from './Assets/Landing/separator.png';
import imgName from './Assets/Landing/name.png';
import imgPassword from './Assets/Landing/password.png';
import imgPasswordAgain from './Assets/Landing/password-again.png';
import ModalDialog from '../Core/Dialog/ModalDialog';
import TermsView from './TermsView';

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
            <div className={styles.pencilTitleImageHolder}><img src={"/" + imgPencilTitle}/></div>
            <div className={styles.captureIdeaHolder}><img src={"/" + imgCaptureYourIdeas}/></div>
            <form className={styles.form}>
                <div className={styles.inputHolder}>
                    <div>
                        <div className={styles.inputLabel}><img className={styles.imgName} src={"/" + imgName}/></div>
                        <input className={styles.input} type="email"
                               value={this.state.email}
                               onChange={(e) => this.setState({email: e.target.value})}/>
                    </div>
                    <div className={styles.passwordHolder}>
                        <div className={styles.inputLabel}><img className={styles.imgPassword} src={"/" + imgPassword}/>
                        </div>
                        <input className={styles.input} type="password"
                               value={this.state.password}
                               onChange={(e) => this.setState({password: e.target.value})}/>
                    </div>
                    {this.state.inputMode === MODE_SIGNUP ?
                        <div>
                            <div className={styles.passwordAgainHolder}><img className={styles.imgPasswordAgain}
                                                                             src={"/" + imgPasswordAgain}/>
                                <input className={styles.input} type="password"
                                       value={this.state.confirmPassword}
                                       onChange={(e) => this.setState({confirmPassword: e.target.value})}/>
                            </div>
                            <div className={styles.acceptTermsConditions}>
                                By signing up, I accept all <a href="#" onClick={() => this._onShowTermConditions()}>
                                    Terms and services (TOS)</a>.
                            </div>
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
            <div><img className={styles.separator} src={"/" + imgSeparator}/></div>
            <div>
                <div className={styles.sectionHeader}>Hierarchical note taking</div>
                Organize your ideas into a tree. Easy and intuitive drag & drop to organize your knowledge tree.
            </div>
            <div>
                <div className={styles.sectionHeader}>Visualize your ideas with images and youtube</div>
                Easily insert image and youtube video just by Ctrl-C, Ctrl-V.
            </div>
            <div>
                <div className={styles.sectionHeader}>Simplistic design</div>
                Distract free writing tool with the most simplistic design.
            </div>
            <div>
                <div className={styles.sectionHeader}>Tool for take notes in class</div>
                Looking for a tool to take notes in class. This is your perfect accompany tool !
            </div>
            <div className={styles.copyright}>
                Copyright © 2017 - 2017 Golery™. All rights reserved. Contact: <a href="mailto:golery.team@gmail.com">golery.team@gmail.com</a>
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
        if (password !== confirmPassword) {
            this.setState({message: 'Password does not match'});
            return;
        }
        Axios.post("/api/public/signup", {
            username: email,
            password: password,
            confirmPassword: confirmPassword
        }).then(function () {
            location.reload();
        }).catch(error => {
            let message = error.response.data.message;
            if (!message) {
                message = "Cannot sign up. Please try again."
            }
            this.setState({message: message});
        });
    }

    _onShowTermConditions() {
        new ModalDialog().show(<TermsView/>);
    }
}

PencilLandingPage.propTypes = {
    //node: PropTypes.object
};