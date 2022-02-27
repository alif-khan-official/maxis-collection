import React from "react";
import { NotificationManager } from "react-notifications";
import MainComponent from "../../common/MainComponent";
import InputFieldComponent from "../widgets/InputFieldComponent";
import ButtonComponent from "../widgets/ButtonComponent";
import { withRouter } from "react-router-dom";
import AuthUtil from "../../auth/AuthUtil.js";
import "../../App.css";
class UpdatePasswordComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      userId: AuthUtil.getUsername(),
      newPassword: "",
    };
  }

  setInputValue(property, val) {
    this.setState({
      [property]: val,
    });
  }

  resetForm() {
    this.setState({
      userId: "",
      newPassword: "",
    });
  }

  async changePassword() {
    if (!this.state.userId) {
      return;
    }

    if (!this.state.newPassword) {
      return;
    }

    const gwUrl = process.env.REACT_APP_API_GW_HOST;
    try {
      let res = await fetch(
        gwUrl + "authorization-service/endpoint/user/password-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer " + AuthUtil.getIdToken(),
          },
          body: JSON.stringify({
            userId: this.state.userId,
            newPassword: this.state.newPassword,
          }),
        }
      );

      let result = await res.json();

      if (result.result.status === "SUCCESS") {
        console.log(result);
        this.props.history.push("/");
      } else {
        NotificationManager.warning("FAILURE", "Failed to update password");
        console.log(result);
      }
    } catch (e) {
      this.resetForm();
      console.log(e);
    }
  }

  getComponentDesign() {
    let design = (
      <div className="home">
        <div className="row">
          <div className="col">
            <p className="page-title">Password Update</p>
          </div>
        </div>

        <div className="card-otp">
          <div className="card-body">
            <h5 className="passwords-card-header">Update Password</h5>

            <hr />

            <label><b>Username</b></label>
            <InputFieldComponent
              className="input"
              readOnly={"readOnly"}
              type="text"
              placeholder="Username"
              value={
                this.state.prevPassword
                  ? this.state.prevPassword
                  : AuthUtil.getUsername()
              }
              onChange={(val) => this.setInputValue("prevPassword", val)}
            />

            <br />

            <label><b>New Password</b></label>
            <InputFieldComponent
              className="input"
              type="password"
              placeholder="Enter New Password"
              value={this.state.newPassword ? this.state.newPassword : ""}
              onChange={(val) => this.setInputValue("newPassword", val)}
            />

            <br />

            <ButtonComponent
              text="UPDATE"
              onClick={() => this.changePassword()}
            />
          </div>
        </div>

      </div>

    );

    return design;
  }

  render() {
    let componentDesign = this.getComponentDesign();
    return <MainComponent component={componentDesign} />;
  }
}

export default withRouter(UpdatePasswordComponent);
