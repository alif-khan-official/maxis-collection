import React from "react";
import { withRouter } from "react-router-dom";
import InputFieldComponent from "../../widgets/InputFieldComponent"
import ButtonComponent from "../../widgets/ButtonComponent";
import MainComponent from "../../../common/MainComponent";
import '../../../App.css'
import AuthUtil from "../../../auth/AuthUtil";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Alert from "simple-react-alert"; // Import
import "react-dropdown/style.css";
// import Searchable from "react-searchable-dropdown";
import { openAlert } from "simple-react-alert"; // Import
import Select from 'react-select';

const customStyles = {
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected ? '#17527F' : state.isFocused ? '#E1E9F4' : undefined,
		cursor: 'pointer'
	}),

}

class CashoutAddComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"pin": "",
			"amount": 0,
			"agent": "",
			"agentList": [],
			"agents": [],
			"disableCashoutButton": false
		};
	}

	componentDidMount() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		fetch(gwUrl + "authorization-service/endpoint/user/agent",
			{
				"method": "POST",
				"headers": {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				"body": "{\"accountId\": \"" + AuthUtil.getUsername() + "\"}"
			}
		)
			.then(res => res.json())
			.then(json => json.result)
			.then(result => {
				try {
					console.log("====AGENT (result)====");
					console.log(result.response[0]);
					this.setState({ "agents": result.response[0] });

					let agentList = [];
					for (let index = 0; result.response[0] !== undefined && result.response[0] !== null && index < result.response[0].length; index++) {
						let ele = result.response[0][index];

						let agent = {
							label: ele.name + ' (' + ele.userId + ')',
							value: ele.userId
						};

						agentList.push(agent);
					}

					this.setState({ "agentList": agentList });
				}
				catch (error) {
					console.log(error);
					this.setState({ "agents": [] });
				}
			}
			)
			;
	}

	getAgents() {
		return this.state.agentList;
	}

	getComponentDesign() {
		let design = <div className="card-form-body">
			<Alert>
			</Alert>

			<div className="row">
				<div className="col">
					<p className="page-title">Cashout</p>
				</div>
			</div>
			{/*
			<div className="row dropdown-bottom-margin">
				<div className="col-md-3"><b>Choose Agent</b></div>
				<div className="col-md-9">
					<Searchable
						value=""
						placeholder="Select"
						options={this.getAgents()}
						onSelect={(value) => { this.setInputValue("agent", value) }}
					/>
				</div>
			</div>
			*/}
			<div className="row">
				<div className="col-md-3"><b>Choose Agent</b></div>
				<div className="col-md-9">
					<Select
						onChange={(e) => { this.setInputValue("agent", e.value) }}
						options={this.getAgents()}
						className="dropdown-bottom-margin"
						styles={customStyles}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-md-3"><b>Amount</b></div>
				<div className="col-md-9">
					<InputFieldComponent
						className="form-input"
						type='number'
						placeholder="Enter Amount"
						value={this.state.amount ? this.state.amount : ""}
						onChange={(val) => this.setInputValue("amount", val)}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-md-3"><b>PIN</b></div>
				<div className="col-md-9">
					<InputFieldComponent
						className="form-input"
						type='text'
						placeholder="PIN"
						value={this.state.amount ? this.state.pin : ""}
						onChange={(val) => this.setInputValue("pin", val)}
					/>
				</div>
			</div>


			<div className="row">
				<div className="col-md-12">
					<ButtonComponent
						text='Save'
						onClick={() => { this.setState({ "disableCashoutButton": true }); this.cashout(); }}
					/>
				</div>
			</div>

		</div>
		return design;
	}

	setInputValue(property, val) {
		let saveValue = val;

		if (property === "agent") {
			console.log("====agent====");
			console.log(val);
		}


		if (property === "amount") {
			try {
				saveValue = Number(saveValue);
				if (isNaN(saveValue))
					return;
			}
			catch (e) {
				return;
			}
		}

		this.setState({ [property]: saveValue });
	}

	async cashout() {
		let messagetype = "";
		let message = "";

		if (this.state.amount === "" || this.state.pin === "" || this.state.agent === "") {
			console.log("this.state not submittable");
			this.setState({ "disableCashoutButton": false });
			return;
		}

		if (this.state.disableCashoutButton) {
			console.log("this.state disableCashoutButton");
			console.log(this.state.disableCashoutButton);
			return;
		}

		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		try {
			let res = await fetch(gwUrl + "collection-service/endpoint/cashout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				body: JSON.stringify({
					"merchantId": AuthUtil.getUsername(),
					"merchantWalletPIN": this.state.pin,
					"cashoutMerchantRequestAmount": this.state.amount,
					"agentId": this.state.agent
				})
			});

			let response = await res.json();

			if (response.result.code === "201") {
				messagetype = "success";
				message = "Success";
				//				this.props.history.push({"pathname": "/mother-merchant-agent-cashout-management"});
			}
			else {
				message = "Failed";
				messagetype = "danger";
			}
			this.setState({ "disableCashoutButton": false });
			console.log("this.state.disableCashoutButton");
			console.log(this.state.disableCashoutButton);
		} catch (e) {
			messagetype = "danger";
			console.log(e);
			this.setState({ "disableCashoutButton": false });
			console.log("this.state.disableCashoutButton");
			console.log(this.state.disableCashoutButton);
		}

		openAlert({ "message": message, "type": messagetype, "duration": "2500" });
	}

	render() {
		let componentDesign = this.getComponentDesign();
		return <MainComponent component={componentDesign} />;
	}
}

export default withRouter(CashoutAddComponent);