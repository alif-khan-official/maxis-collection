import React from "react";
import { Link, withRouter } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import "../../App.css";
import AuthUtil from "../../auth/AuthUtil.js";
import ButtonComponent from "../widgets/ButtonComponent";
import InputFieldComponent from "../widgets/InputFieldComponent";
import Constant from "../../constants/GeneralConstants";

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            enable: ""
        }
    }

    setInputValue(property, val) {
        this.setState({
            [property]: val
        })
    }

    checkEnter(thisEvent) {
        if (thisEvent.keyCode === 13) {
            this.doLogin();
        }
    }

    resetForm() {
        this.setState({
            username: "",
            password: ""
        })
    }
    async getMenu() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;

        let roleList = AuthUtil.getRoleList();
        let roleId = "";

        for (let index = 0; index < roleList.length; index++) {

            if (roleList[index].name === Constant.ROLE_NAME_ADMIN) {
                roleId = roleList[index].id;
                break;
            } else {
                roleId = roleList[index].id;
                break;
            }
        }

        try {
            let res = await fetch(gwUrl + "authorization-service/endpoint/rolemenu/roleId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                body: JSON.stringify({
                    userId: "",
                    roleId: roleId
                })
            });

            let result = await res.json();

            if (result.result.status === "SUCCESS") {
                if (result.result.response[0] === null) {
                    this.props.history.push("/home");
                    NotificationManager.info("No menu items served from backend for " + this.state.username);
                } else {
                    AuthUtil.setMenu(result.result.response[0].menuId);
                    this.props.history.push("/home");
                }

            }

            console.log(result);

        } catch (e) {
            NotificationManager.error("Error message", "Internal Server Error");
            this.resetForm();
        }
    }
    async doLogin() {
        this.setState({
            enable: "disable"
        });
        if (!this.state.username) {
            this.setState({
                enable: ""
            });
            NotificationManager.warning("FAILURE", "Username field is empty");
            return
        }

        if (!this.state.password) {
            this.setState({
                enable: ""
            });
            NotificationManager.warning("FAILURE", "Password field is empty");
            return
        }
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            let res = await fetch(gwUrl + "authentication-service/endpoint/oauth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            });

            let result = await res.json();

            this.setState({
                enable: ""
            });
            if (result.result.authResponse.id_token) {

                AuthUtil.setUsername(this.state.username);
                AuthUtil.setTokenDetail(result.result.authResponse);
                AuthUtil.setRole(result.result.roleList);
                AuthUtil.setName(result.result.userName);
                AuthUtil.setPhone(result.result.userPhone);

                this.getMenu();

            } else {
                NotificationManager.warning(result.result.message, result.result.result);
            }

        } catch (e) {
            this.setState({
                enable: ""
            });
            NotificationManager.error("Error message", "Internal Server Error");
            this.resetForm();
        }

    }

    render() {
        return (

            <div className="card-login">
                <div className="d-flex justify-content-center">
                    <img alt="Logo" src="/65332127.png" />
                </div>
                {/*
                <h3 className="d-flex justify-content-center">COLLECTION PORTAL (CLOUD)</h3>
                */}
                <h3 className="center-align-text">COLLECTION PORTAL (CLOUD)</h3>
                <div className="card-body">
                    <label><b>Username</b></label>
                    <InputFieldComponent
                        className="input"
                        type="text"
                        placeholder="Username"
                        value={this.state.username ? this.state.username : ""}
                        onChange={(val) => this.setInputValue("username", val)}
                        onKeyDown={(e) => this.checkEnter(e)}
                    />

                    <br />

                    <label><b>Password</b></label>
                    <InputFieldComponent
                        className="input"
                        type="password"
                        placeholder="Password"
                        value={this.state.password ? this.state.password : ""}
                        onChange={(val) => this.setInputValue("password", val)}
                        onKeyDown={(e) => this.checkEnter(e)}
                    />
                    <div className="d-flex justify-content-center"><Link
                        to={{
                            pathname: "/generate-otp",
                        }}
                    >
                        Forget Password? </Link>
                    </div>

                    <ButtonComponent
                        text="LOGIN"
                        disabled={this.state.enable}
                        onClick={() => this.doLogin()}
                    />
                </div>
            </div>
        );
    }

}

export default withRouter(LoginForm);