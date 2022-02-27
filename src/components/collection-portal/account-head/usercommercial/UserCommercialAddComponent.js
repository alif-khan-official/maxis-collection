import React from "react";
import { withRouter } from "react-router-dom";
import InputFieldComponent from "../../../widgets/InputFieldComponent"
import ButtonComponent from "../../../widgets/ButtonComponent";
import MainComponent from "../../../../common/MainComponent";
import '../../../../App.css'
import AuthUtil from "../../../../auth/AuthUtil";
import Constant from "../../../../constants/GeneralConstants";

class WalletAddComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        let data = this.props.location.state;
        console.log("====data====");
        console.log(data);
        if (data === undefined) {
            this.state = {
                userId: "",
                commercialPropertyName: "",
                commercialPropertyValue: "",
                status: "STATUS_ENABLED",
                "existing": false,
                enable: true
            };
        }
        else {
            this.state = {
                id: data.row._original.id,
                userId: data.row._original.userId,
                commercialPropertyName: data.row._original.commercialPropertyName,
                status: data.row._original.status,
                commercialPropertyValue: data.row._original.commercialPropertyValue,
                creationTime: data.row._original.creationTime,
                deactivationTime: data.row._original.deactivationTime,
                "existing": true,
                enable: true
            };
        }
        console.log(this.state);
    }

    async deactivate() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            this.setState({ "status": "STATUS_DISABLED" });

            let res = await fetch(gwUrl + "collection-service/endpoint/user/save-user-commercial", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                body: JSON.stringify(this.state)
            });

            let response = await res.json();

            this.setInputValue("readOnlyFieldValue", response.result.message);


            console.log(response);

        } catch (e) {
            console.log(e);
        }
    }

    setInputValue(property, val) {
        this.setState({
            [property]: val
        })
    }

    async save() {
        this.setState({ enable: "disable" });
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            let res = await fetch(gwUrl + "collection-service/endpoint/user/save-user-commercial", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                body: JSON.stringify(this.state)
            });

            let response = await res.json();
            this.setState({
                enable: ""
            });
            if (response.result.code === Constant.MW_RESPONSE_SUCCESS_CODE) {
                this.props.history.push({
                    pathname: "/manage-user-commercial"
                });
            }

        } catch (e) {
            this.setState({
                enable: ""
            });
            console.log(e);
        }
    }

    getComponentDesign() {
        let design =
            <div className="home">
                <div className="row">
                    <div className="col">
                        <p className="page-title">Commercial Management</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3"><b>Property ID</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder=""
                            value={this.state.id ? this.state.id : ""}
                            onChange={(val) => this.setInputValue("id", val)}
                            readOnly={true}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3"><b>Entity ID</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder=""
                            value={this.state.userId ? this.state.userId : ""}
                            onChange={(val) => this.setInputValue("userId", val)}
                            readOnly={this.state.existing}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3"><b>Property</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder=""
                            value={this.state.commercialPropertyName ? this.state.commercialPropertyName : ""}
                            onChange={(val) => this.setInputValue("commercialPropertyName", val)}
                            readOnly={this.state.existing}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3"><b>Value</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder=""
                            value={this.state.commercialPropertyValue ? this.state.commercialPropertyValue : ""}
                            onChange={(val) => this.setInputValue("commercialPropertyValue", val)}
                            readOnly={this.state.existing}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3"><b>Creation date</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder=""
                            value={this.state.creationTime ? this.state.creationTime : ""}
                            onChange={(val) => this.setInputValue("creationTime", val)}
                            readOnly={true}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3"><b>Status</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder=""
                            value={this.state.status ? this.state.status : ""}
                            onChange={(val) => this.setInputValue("status", val)}
                            readOnly={true}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3"><b>Deactivation date</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder=""
                            value={this.state.deactivationTime ? this.state.deactivationTime : ""}
                            onChange={(val) => this.setInputValue("walletOTP", val)}
                            readOnly={true}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        {(this.state.existing === false) ? <ButtonComponent
                            text="Save"
                            onClick={() => this.save()}
                        /> : <ButtonComponent
                            text="Deactivate"
                            onClick={() => this.deactivate()}
                        />}

                    </div>
                </div>

            </div>
        return design;
    }

    render() {
        let componentDesign = this.getComponentDesign();
        return <MainComponent component={componentDesign} />;
    }

}

export default withRouter(WalletAddComponent);