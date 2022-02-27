import React from 'react';

import { withRouter } from "react-router-dom";
import InputFieldComponent from "../../../widgets/InputFieldComponent";
import TextAreaFieldComponent from "../../../widgets/TextAreaFieldComponent";
import ButtonComponent from "../../../widgets/ButtonComponent";
import MainComponent from "../../../../common/MainComponent";
import AuthUtil from "../../../../auth/AuthUtil";
import "../../../../App.css";
import "react-table-6/react-table.css";
import "react-datepicker/dist/react-datepicker.css";

class Notification extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"phoneNumber": "",
			"message": "",
			"sendMessage": "",
			"sendButtonClicked": ""
		}

		this.sendSMS = this.sendSMS.bind(this);
		this.setValue = this.setValue.bind(this);
	}

	setValue(property, val) {
		this.setState({ [property]: val });
	}

	async sendSMS() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		this.setValue("sendButtonClicked", "CLICKED");
		try {
			let res = await fetch(gwUrl + 'authorization-service/endpoint/sms', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				},
				body: JSON.stringify({
					phoneNumber: this.state.phoneNumber,
					message: this.state.message
				})
			});

			let result = await res.json();
			this.setValue("sendButtonClicked", "RESPONDED");

			console.log("SMS RESULT====>>>>");
			console.log(JSON.stringify(result));
			this.setValue("sendMessage", result.result.id);
		} catch (e) {
			console.log(e);
		}
	}

	componentDidMount() {
		let fundTransferMessage = `Fund Transfer  successful on 09-Feb-21 11:25:04 Sent to : 018471756651 Amount Tk.10,101.00
Balance: Tk.0.00
TXN ID: 21020900002268
MYCash / Maxis Systems Limited
`;
		this.setValue("message", fundTransferMessage);
	}

	getComponentDesign() {
		let componentDesign =
			<div className="home">
				<div className="row">
					<div className="col">
						<p className="page-title">Send SMS</p>
					</div>
				</div>

				<div className="row">
					<div className="col-md-3"><b>Phone Number</b></div>
					<div className="col-md-9">
						<InputFieldComponent
							className="form-input"
							type='text'
							placeholder='Phone Number'
							value={this.state.phoneNumber ? this.state.phoneNumber : ''}
							onChange={(val) => this.setValue('phoneNumber', val)}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-3"><b>Message</b></div>
					<div className="col-md-9">
						<TextAreaFieldComponent
							className="width-100-percent"
							type='text'
							placeholder='Message'
							value={this.state.message ? this.state.message : ''}
							onChange={(val) => this.setValue('message', val)}
							rows="5"
						// cols="100"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<ButtonComponent
							text="Send"
							onClick={() => this.sendSMS()}
						/>
					</div>
				</div>
				<div className="row">
					{this.state.sendButtonClicked === "" &&
						<div className="col-md-12">

						</div>
					}
				</div>
				<div className="row">
					{this.state.sendButtonClicked === "CLICKED" &&
						<div className="col-md-12">
							<h5>Processing ...</h5>
						</div>
					}
				</div>
				<div className="row">
					{this.state.sendButtonClicked === "RESPONDED" &&
						<div className="col-md-12">
							<h5>{this.state.sendMessage}</h5>
						</div>
					}
				</div>
			</div>
		return componentDesign;
	}

	render() {
		let componentDesign = this.getComponentDesign()

		return <MainComponent component={componentDesign} />;
	}
}

export default withRouter(Notification);