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
        let data = this.props.location.state;
        if (data === undefined) {
            this.state = {
                balance: 0,
                ownerId: "",
                domainId: null,
                status: "",
                transactionAccountId: "",
                walletAccountId: "",
                walletId: "",
                walletName: "",
                walletPin: "",
                walletOTP: "",
                walletType: "",
                readOnlyFieldValue: "",
                enable: ""
            }
        }
        else {
            this.state = {
                balance: data.row._original.balance,
                domainId: data.row._original.domainId,
                ownerId: data.row._original.ownerId,
                status: data.row._original.status,
                transactionAccountId: data.row._original.transactionAccountId,
                walletAccountId: data.row._original.walletAccountId,
                walletId: data.row._original.walletId,
                walletName: data.row._original.walletName,
                walletPin: data.row._original.walletPin,
                walletOTP: data.row._original.walletOTP,
                walletType: data.row._original.walletType,
                enable: "disable"
            }
        }
    }

    async balanceCheck() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            let res = await fetch(gwUrl + "collection-service/endpoint/wallet/balance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                body: JSON.stringify({
                    transactionAccountId: this.state.transactionAccountId,
                    walletPin: this.state.walletPin
                })
            });

            let response = await res.json();

            this.setInputValue("readOnlyFieldValue", response.result.message);

            console.log(response);

        } catch (e) {
            console.log(e);
        }
    }

    async enCash() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            let res = await fetch(gwUrl + "collection-service/endpoint/wallet/balance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                body: JSON.stringify({
                    transactionAccountId: this.state.transactionAccountId,
                    walletPin: this.state.walletPin
                })
            });

            let response = await res.json();

            this.setInputValue("readOnlyFieldValue", response.result.message);

            console.log(response);
            //////////////////////////The Balance is 478
            let encashableBalanceString = 0;
            if (!response.result.message.includes("The Balance is ")) {
                return;
            }

            encashableBalanceString = response.result.message.replace("The Balance is ", "");

            let encashableBalance = parseInt(encashableBalanceString, 10);

            if (encashableBalance === undefined || encashableBalance === null || isNaN(encashableBalance)) {
                return;
            }

            let encashmentRequest = {};
            encashmentRequest.walletAccountId = this.state.walletId;
            encashmentRequest.merchantId = this.state.ownerId;
            encashmentRequest.digitalMoney = this.state.walletName;
            encashmentRequest.encashmentAmount = encashableBalance;

            encashmentRequest.encashmentFeeRateForMerchant = 0.0;
            encashmentRequest.maxisVATRate = 0.0;
            encashmentRequest.maxisAITRate = 0.0;
            encashmentRequest.bankFeeRatio = 0.0;
            encashmentRequest.maxisFeeRatio = 0.0;
            encashmentRequest.decision = "pending";
            encashmentRequest.merchantName = "";
            encashmentRequest.feeAmount = 0.0;
            encashmentRequest.bankAmount = 0.0;
            encashmentRequest.maxisAmount = 0.0;
            encashmentRequest.maxisVATAmount = 0.0;
            encashmentRequest.maxisAmountAfterVAT = 0.0;
            encashmentRequest.maxisAITAmount = 0.0;
            encashmentRequest.maxisAmountAfterAIT = 0.0;

            let resEncash = await fetch(gwUrl + "collection-service/endpoint/encashment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                body: JSON.stringify(encashmentRequest)
            });

            let responseEncash = await resEncash.json();

            this.setInputValue("readOnlyFieldValue", responseEncash.result.message);

            console.log(response);
            //////////////////////////
        } catch (e) {
            console.log(e);
        }
    }

    // NOT USED
    async collect() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            let res = await fetch(gwUrl + "collection-service/endpoint/wallet/balance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                body: JSON.stringify({
                    transactionAccountId: this.state.transactionAccountId,
                    walletPin: this.state.walletPin
                })
            });

            let response = await res.json();

            this.setInputValue("readOnlyFieldValue", response.result.message);

            console.log(response);
            //////////////////////////The Balance is 478
            let encashableBalanceString = 0;
            if (!response.result.message.includes("The Balance is ")) {
                return;
            }

            encashableBalanceString = response.result.message.replace("The Balance is ", "");

            let encashableBalance = parseInt(encashableBalanceString, 10);

            if (encashableBalance === undefined || encashableBalance === null || isNaN(encashableBalance)) {
                return;
            }

            let encashmentRequest = {};
            encashmentRequest.walletAccountId = this.state.walletId;
            encashmentRequest.merchantId = this.state.ownerId;
            encashmentRequest.digitalMoney = this.state.walletName;
            encashmentRequest.encashmentAmount = encashableBalance;

            encashmentRequest.encashmentFeeRateForMerchant = 0.0;
            encashmentRequest.maxisVATRate = 0.0;
            encashmentRequest.maxisAITRate = 0.0;
            encashmentRequest.bankFeeRatio = 0.0;
            encashmentRequest.maxisFeeRatio = 0.0;
            encashmentRequest.decision = "pending";
            encashmentRequest.merchantName = "";
            encashmentRequest.feeAmount = 0.0;
            encashmentRequest.bankAmount = 0.0;
            encashmentRequest.maxisAmount = 0.0;
            encashmentRequest.maxisVATAmount = 0.0;
            encashmentRequest.maxisAmountAfterVAT = 0.0;
            encashmentRequest.maxisAITAmount = 0.0;
            encashmentRequest.maxisAmountAfterAIT = 0.0;

            let resEncash = await fetch(gwUrl + "collection-service/endpoint/encashment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                body: JSON.stringify(encashmentRequest)
            });

            let responseEncash = await resEncash.json();

            this.setInputValue("readOnlyFieldValue", responseEncash.result.message);

            console.log(response);
            //////////////////////////
        } catch (e) {
            console.log(e);
        }
    }

    async otpReset() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            let res = await fetch(gwUrl + "collection-service/endpoint/wallet/otp-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                body: JSON.stringify({
                    walletId: this.state.walletId,
                    walletAccountId: this.state.walletAccountId,
                    transactionAccountId: this.state.transactionAccountId,
                    walletPin: this.state.walletPin
                })
            });

            let response = await res.json();

            this.setInputValue("readOnlyFieldValue", response.result.data);

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
        this.setState({
            enable: "disable"
        });
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            let res = await fetch(gwUrl + "collection-service/endpoint/wallet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                body: JSON.stringify({
                    id: this.state.domainId,
                    walletId: this.state.walletId,
                    walletName: this.state.walletName,
                    walletAccountId: this.state.walletAccountId,
                    ownerId: this.state.ownerId,
                    walletPin: this.state.walletPin,
                    walletOTP: this.state.walletOTP,
                    balance: this.state.balance,
                    transactionAccountId: this.state.transactionAccountId,
                    walletType: this.state.walletType,
                    status: this.state.status
                })
            });

            let response = await res.json();
            this.setState({
                enable: ""
            });
            if (response.result.code === Constant.MW_RESPONSE_SUCCESS_CODE) {
                this.props.history.push({
                    pathname: "/manage-wallet"
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
        let componentDesign =
            <div className="home">
                <div className="row">
                    <div className="col">
                        <p className="page-title">Wallet Details</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Wallet ID</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Enter Wallet ID"
                            value={this.state.walletId ? this.state.walletId : ""}
                            onChange={(val) => this.setInputValue("walletId", val)}
                            readOnly={AuthUtil.getRolePresence(["Merchant", "Cashpoint", "Payee"])}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Wallet Name</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Enter Wallet Name"
                            value={this.state.walletName ? this.state.walletName : ""}
                            onChange={(val) => this.setInputValue("walletName", val)}
                            readOnly={AuthUtil.getRolePresence(["Merchant", "Cashpoint", "Payee"])}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Wallet Owner ID</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Enter Wallet Owner ID"
                            value={this.state.ownerId ? this.state.ownerId : ""}
                            onChange={(val) => this.setInputValue("ownerId", val)}
                            readOnly={AuthUtil.getRolePresence(["Merchant", "Cashpoint", "Payee"])}
                        />
                    </div>
                </div>
                {(AuthUtil.getRolePresence(["Merchant", "Cashpoint", "Payee"]) === true) ?
                    <div>{ }</div>
                    :
                    <div className="row">
                        <div className="col-md-3"><b>Wallet Account ID</b></div>
                        <div className="col-md-9">
                            <InputFieldComponent
                                className="form-input"
                                type="text"
                                placeholder="Enter Wallet Account ID"
                                value={this.state.walletAccountId ? this.state.walletAccountId : ""}
                                onChange={(val) => this.setInputValue("walletAccountId", val)}
                            />
                        </div>
                    </div>
                }
                {(AuthUtil.getRolePresence(["Merchant", "Cashpoint", "Payee"]) === true) ?
                    <div>{ }</div>
                    :
                    <div className="row">
                        <div className="col-md-3"><b>Transaction Account ID</b></div>
                        <div className="col-md-9">
                            <InputFieldComponent
                                className="form-input"
                                type="text"
                                placeholder="Enter Transaction Account ID"
                                value={this.state.transactionAccountId ? this.state.transactionAccountId : ""}
                                onChange={(val) => this.setInputValue("transactionAccountId", val)}
                            />
                        </div>
                    </div>
                }
                <div className="row">
                    <div className="col-md-3"><b>Wallet Pin</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Enter Wallet Pin"
                            value={this.state.walletPin ? this.state.walletPin : ""}
                            onChange={(val) => this.setInputValue("walletPin", val)}
                            readOnly={AuthUtil.getRolePresence(["Merchant", "Cashpoint", "Payee"])}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Wallet OTP</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Enter Wallet OTP"
                            value={this.state.walletOTP ? this.state.walletOTP : ""}
                            onChange={(val) => this.setInputValue("walletOTP", val)}
                            readOnly={AuthUtil.getRolePresence(["Merchant", "Cashpoint", "Payee"])}
                        />
                    </div>
                </div>
                {(AuthUtil.getRolePresence(["Merchant", "Cashpoint", "Payee"]) === true) ?
                    <div>{ }</div>
                    :
                    <div className="row">
                        <div className="col-md-3"><b>Wallet Type</b></div>
                        <div className="col-md-9">
                            <InputFieldComponent
                                className="form-input"
                                type="text"
                                placeholder="Enter Wallet Type"
                                value={this.state.walletType ? this.state.walletType : ""}
                                onChange={(val) => this.setInputValue("walletType", val)}
                            />
                        </div>
                    </div>
                }
                <div className="row">
                    <div className="col-md-3"><b>Wallet Status</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            readOnly={AuthUtil.getRolePresence(["Merchant", "Cashpoint", "Payee"])}
                            type="text"
                            placeholder="Enter Wallet Status"
                            value={this.state.status ? this.state.status : ""}
                            onChange={(val) => this.setInputValue("status", val)}
                        />
                    </div>
                </div>
                {(AuthUtil.getRolePresence(["Merchant", "Cashpoint", "Payee"]) === true) ?
                    <div>{ }</div>
                    :
                    <div className="row">
                        <div className="col-md-12">
                            <ButtonComponent
                                text="Save"
                                onClick={() => this.save()}
                            />
                        </div>
                    </div>
                }

                <br />

                <div className="row">
                    <div className="col-md-3 form-input-label"><b>Date </b>({AuthUtil.getAuthCurrentDateTime()})</div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            readOnly="readOnly"
                            type="text"
                            placeholder=""
                            value={this.state.readOnlyFieldValue ? this.state.readOnlyFieldValue : ""}
                            onChange={(val) => this.setInputValue("readOnlyFieldValue", val)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                    </div>
                    <div className="col-md">
                        <ButtonComponent
                            text="Balance Check"
                            onClick={() => this.balanceCheck()}
                        />
                    </div>

                    {(AuthUtil.getRolePresence(["Merchant", "Cashpoint", "Payee"]) === true) ?
                        <span></span>
                        :
                        <div className="col-md">
                            <ButtonComponent
                                text="OTP Reset"
                                onClick={() => this.otpReset()}
                            />
                        </div>
                    }

                    {((AuthUtil.getRolePresence(["account_head"]) === true && this.state.walletType === "Mother Merchant") || AuthUtil.getRolePresence(["Merchant"]) === true) ?
                        <div className="col-md">
                            <ButtonComponent
                                text="Encash"
                                onClick={() => this.enCash()}
                            />
                        </div>
                        :
                        <span></span>
                    }
                </div>
            </div>
        return componentDesign;
    }

    render() {
        let componentDesign = this.getComponentDesign();
        return <MainComponent component={componentDesign} />;
    }

}

export default withRouter(WalletAddComponent);