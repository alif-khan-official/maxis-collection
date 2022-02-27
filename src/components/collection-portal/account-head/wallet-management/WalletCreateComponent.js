import React from "react";
import { withRouter } from "react-router-dom";
import InputFieldComponent from "../../../widgets/InputFieldComponent"
import ButtonComponent from "../../../widgets/ButtonComponent";
import MainComponent from "../../../../common/MainComponent";
import '../../../../App.css'
import AuthUtil from "../../../../auth/AuthUtil";
import Select from 'react-select';

class WalletCreateComponent extends React.Component {
    constructor(props) {
        super(props);

		this.customStyles = {
			option: (provided, state) => ({
				...provided,
				backgroundColor: state.isSelected ? '#17527F' : state.isFocused ? '#E1E9F4' : undefined,
				cursor: 'pointer'
			}),
		
		};
		
		this.accountTypes =	[
								{ name: "Cashpoint-Collection", code: "Cashpoint-Collection", label: "Cashpoint-Collection", value: "Cashpoint-Collection" },
								{ name: "Cashpoint-PRIMARY", code: "Cashpoint-PRIMARY", label: "Cashpoint-PRIMARY", value: "Cashpoint-PRIMARY" },
								{ name: "Cashpoint-General", code: "Cashpoint-General", label: "Cashpoint-General", value: "Cashpoint-General" },
								{ name: "Merchant-PRIMARY", code: "Merchant-PRIMARY", label: "Merchant-PRIMARY", value: "Merchant-PRIMARY" },
								{ name: "Merchant-General", code: "Merchant-General", label: "Merchant-General", value: "Merchant-General" },
								{ name: "Settlement Bank", code: "Settlement Bank", label: "Settlement Bank", value: "Settlement Bank" },
								{ name: "Payee-PRIMARY", code: "Payee-PRIMARY", label: "Payee-PRIMARY", value: "Payee-PRIMARY" },
								{ name: "Payee-General", code: "Payee-General", label: "Payee-General", value: "Payee-General" },
								{ name: "Master Distributor", code: "Master Distributor", label: "Master Distributor", value: "Master Distributor" }
							]
		;
	
		this.currencyTypes =	[
								{ name: "MFS", code: "MFS", label: "MFS", value: "MFS" },
								{ name: "BDT", code: "BDT", label: "BDT", value: "BDT" }
							]
		;
	
		this.bankAccountTypes =	[
								{ name: "Mother Merchant", code: "Mother Merchant", label: "Mother Merchant", value: "Mother Merchant" },
								{ name: "Local Merchant", code: "Local Merchant", label: "Local Merchant", value: "Local Merchant" },
								{ name: "Distributor", code: "Distributor", label: "Distributor", value: "Distributor" },
								{ name: "DSE", code: "DSE", label: "DSE", value: "DSE" },
								{ name: "General", code: "General", label: "General", value: "General" },
								{ name: "Master Distributor", code: "Master Distributor", label: "Master Distributor", value: "Master Distributor" }
							]
		;
	
		this.currencies =	[
								{ name: "MyCash", code: "MyCash", label: "MyCash", value: "MyCash" },
								{ name: "Ok", code: "Ok", label: "Ok", value: "Ok" },
								{ name: "BDT", code: "BDT", label: "BDT", value: "BDT" }
							]
		;
	
        this.state = {
			"id": "collection-web",
			"merchantId": "maxis-collection",
			"apiKey": "maxis-collection",

            "partnerId"		: "",
            "accountType"	: "",
            "accountId"		: "",
            "currencyType"	: "",
            "currency"		: "",
            "accountName"	: "",
            "accountNumber"	: "",
            "accountDetails":	{
					                "bankName"			: "",
					                "bankBranch"		: "",
					                "bankAccountNumber"	: "",
					                "bankAccountType"	: "",
					                "bankAccountName"	: ""
								},

            "readOnlyFieldValue": "",
            "enable"			: "",

			"transactionAccountId": "",
			
			"walletId"			: "",
			"walletName"		: "",
			"walletAccountId"	: "",
			"ownerId"			: "",
			"walletPin"			: "",
			"walletOTP"			: "",
			"balance"			: "0",
			"walletType"		: "",
			"status"			: "Active"
        }
        
        this.setInputValue = this.setInputValue.bind(this);
        this.setInputValue2 = this.setInputValue2.bind(this);
        this.save = this.save.bind(this);
    }

    setInputValue(property, val) {
        this.setState({
            [property]: val
        });

		let aId = "";
		if (property === "partnerId")
		{
			aId = "COLLECTION_" + val + "_" + this.state.accountNumber + "_" + this.state.currency;
	        this.setInputValue("accountId", aId);
	        this.setInputValue("ownerId", val);
	        this.setInputValue("walletAccountId", aId);
		}
		else if (property === "accountNumber")
		{
			aId = "COLLECTION_" + this.state.partnerId + "_" + val + "_" + this.state.currency;
	        this.setInputValue("accountId", aId);
	        this.setInputValue("walletAccountId", aId);
	        this.setInputValue("walletId", val);
	        this.setInputValue2("accountDetails", "bankAccountNumber", val);
		}
		else if (property === "currency")
		{
			aId = "COLLECTION_" + this.state.partnerId + "_" + this.state.accountNumber + "_" + val;
	        this.setInputValue("walletName", val);
	        this.setInputValue("accountId", aId);
	        this.setInputValue("walletAccountId", aId);
		}
		else if (property === "accountName")
		{
	        this.setInputValue2("accountDetails", "bankAccountName", val);
		}
    }

    setInputValue2(property1, property2, val) {
		if (property2 === undefined)
		{
	        this.setState({
	            [property1]: val
	        })
		}
		else
		{
			//this.setInputValue2("accountDetails", "bankAccountType", e.value);
			
			if (property1 === "accountDetails" && property2 === "bankAccountType")
		        this.setInputValue("walletType", val);
			
			let p1 = this.state[property1];
			p1[property2] = val;
			this.setState({
	            [property1]: p1
	        })
		}
    }

    async save() {
        this.setState({
            enable: "disable"
        });
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            let res = await fetch(gwUrl + "te/endpoint/api/wallet-account-migrated", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                body: JSON.stringify(this.state)
            });

            let response = await res.json();
            
            console.log("response started");
			this.setInputValue("transactionAccountId", response.accountId);
            console.log(response.accountId);
            console.log("response ended");
            delete this.state['id'];
	        try {
	            let resC = await fetch(gwUrl + "collection-service/endpoint/wallet", {
	                method: "POST",
	                headers: {
	                    "Content-Type": "application/json",
	                    "token": "Bearer " + AuthUtil.getIdToken()
	                },
	                body: JSON.stringify(this.state)
	            });
	
	            let responseC = await resC.json();
	            
	            console.log("responseC started");
	            console.log(responseC);
	            console.log("responseC ended");
	            
	            this.setState({
	                enable: ""
	            });
	        } catch (e) {
	            this.setState({
	                enable: ""
	            });
	            console.log(e);
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
                        <p className="page-title">Add Wallet</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Owner ID</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Owner ID"
                            value={this.state.partnerId ? this.state.partnerId : ""}
                            onChange={(val) => this.setInputValue("partnerId", val)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Account Type</b></div>
                    <div className="col-md-9">
						<Select
							onChange={(e) => {
								this.setInputValue("accountType", e.value);
							}}
							options={this.accountTypes}
							className="dropdown-bottom-margin"
							styles={this.customStyles}
						/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Account ID</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Account Id"
                            value={this.state.accountId ? this.state.accountId : ""}
                            readOnly={true}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Currency Type</b></div>
                    <div className="col-md-9">
						<Select
							onChange={(e) => {
								this.setInputValue("currencyTypes", e.value);
							}}
							options={this.currencyTypes}
							className="dropdown-bottom-margin"
							styles={this.customStyles}
						/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Currency</b></div>
                    <div className="col-md-9">
						<Select
							onChange={(e) => {
								this.setInputValue("currency", e.value);
							}}
							options={this.currencies}
							className="dropdown-bottom-margin"
							styles={this.customStyles}
						/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Account Name</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Account Name"
                            value={this.state.accountName ? this.state.accountName : ""}
                            onChange={(val) => this.setInputValue("accountName", val)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Account Number</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Account Number"
                            value={this.state.accountNumber ? this.state.accountNumber : ""}
                            onChange={(val) => this.setInputValue("accountNumber", val)}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3"><b>Bank Name</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Bank Name"
                            value={this.state.accountDetails.bankName ? this.state.accountDetails.bankName : ""}
                            onChange={(val) => this.setInputValue2("accountDetails", "bankName", val)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Bank Branch Name</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Bank Branch Name"
                            value={this.state.accountDetails.bankBranch ? this.state.accountDetails.bankBranch : ""}
                            onChange={(val) => this.setInputValue2("accountDetails", "bankBranch", val)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"><b>Bank Account Type</b></div>
                    <div className="col-md-9">
						<Select
							onChange={(e) => {
								this.setInputValue2("accountDetails", "bankAccountType", e.value);
							}}
							options={this.bankAccountTypes}
							className="dropdown-bottom-margin"
							styles={this.customStyles}
						/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3"><b>Transaction Account Id</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Transaction Account Id"
                            value={this.state.transactionAccountId ? this.state.transactionAccountId : ""}
                            readOnly={true}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3"><b>Wallet Pin</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type="text"
                            placeholder="Enter Wallet Pin"
                            value={this.state.walletPin ? this.state.walletPin : ""}
                            onChange={(val) => this.setInputValue("walletPin", val)}
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
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <ButtonComponent
                            text="Save"
                            onClick={() => this.save()}
                        />
                    </div>
                </div>
            </div>
        return componentDesign;
    }

    render() {
        let componentDesign = this.getComponentDesign();
        return <MainComponent component={componentDesign} />;
    }

}

export default withRouter(WalletCreateComponent);