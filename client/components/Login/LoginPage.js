import React from "react";
import styles from "./LoginPage.css";
import Axios from "axios";

const VIEW_LOADING = Symbol();
const VIEW_INPUT = Symbol();
const VIEW_LOGIN_SUCCESS = Symbol();

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {view: VIEW_LOADING, username: '', password: ''};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);

        this._getSession();
    }

    _getSession() {
        Axios.get("api/session").then((response) => {
            this.setState({view: VIEW_LOGIN_SUCCESS});
            // this.setState({view: VIEW_INPUT});
        }).catch((error) => {
            this.setState({view: VIEW_INPUT});
        });
    }

    _doLogin(username, password) {
        Axios.post("api/public/login", {
            username: username,
            password: password
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        let username = this.state.username;
        let password = this.state.password;
        if (username && password) {
            this.setState({username: username, password: password});
        }
        this._doLogin(username, password);

    }

    handleChangeUsername(event) {
        this.setState({username: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    render() {
        let viewInput = <form className={styles.body} onSubmit={this.handleSubmit}>
            <div className="form-group">
                <input type="text" placeholder="email" className="form-control"
                       value={this.state.username} onChange={this.handleChangeUsername}/><br/>
                <input type="password" placeholder="password" className="form-control"
                       value={this.state.password} onChange={this.handleChangePassword}/><br/>
                <button className="btn btn-success" onClick={this.handleSubmit}><i className="fa fa-sign-in"/>
                    {' '}Log In
                </button>
            </div>
        </form>;
        let viewLoginSuccess = <div>Loggin successfully</div>;

        let view = this.state.view;
        if (view == VIEW_INPUT) view = viewInput;
        else if (view == VIEW_LOGIN_SUCCESS) view = viewLoginSuccess;

        return <div className={styles.component}>
            {view}
        </div>;
    }
}
