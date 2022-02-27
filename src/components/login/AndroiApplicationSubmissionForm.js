import React from "react";
import { withRouter } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import "../../App.css";
import ButtonComponent from "../widgets/ButtonComponent";
// import Searchable from "react-searchable-dropdown";
import Select from 'react-select';

const customStyles = {
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected ? '#17527F' : state.isFocused ? '#E1E9F4' : undefined,
		cursor: 'pointer'
	}),

}

class AndroiApplicationSubmissionForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			versions: [],
			version: "",
			enable: ""
		};

		this.checkEnter = this.checkEnter.bind(this);
		this.getVersions = this.getVersions.bind(this);
		this.setInputValue = this.setInputValue.bind(this);
		this.getBaseVersion = this.getBaseVersion.bind(this);
		this.asyncFunctionCall = this.asyncFunctionCall.bind(this);
	}

	async getVersions() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		let res = await fetch(gwUrl + "authorization-service/endpoint/app/version-get", {
			"method": "POST",
			"headers": {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"token": "Bearer sdf"
			},
			"body": JSON.stringify({ "appVersion": this.getBaseVersion() })
		});

		let result = await res.json();

		let versions = [];
		for (let i = 0; i < result.result.length; i++)
			versions.push({ "label": result.result[i], "value": result.result[i] });

		this.setInputValue("versions", versions);
	}

	getBaseVersion(versionName) {
		if (versionName) return versionName + "x";
		else return "6.8";
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

	componentDidMount() {
		this.getVersions();
	}

	async asyncFunctionCall() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		try {
			let res = await fetch(gwUrl + "authorization-service/endpoint/app/version-check", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ "appVersion": this.state.version })
			});

			let result = await res.json();

			if (this.state.callbackFunction)
				this.state.callbackFunction(result);
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
				{/* <h3 className="d-flex justify-content-center">COLLECTION PORTAL APP (Cloud) </h3> */}
				<h3 className="center-align-text">COLLECTION PORTAL (CLOUD)</h3>
				<div className="card-body">
					<label><b>Choose Version</b></label>
					{/*
					<Searchable
						value={this.state.version}
						placeholder="Select"
						options={this.state.versions}
						onSelect={(value) => { this.setInputValue("version", value) }}
					/>
					*/}
					<Select
						onChange={(e) => {
							this.setInputValue("version", e.value);
						}}
						options={this.state.versions}
						className="dropdown-bottom-margin"
						styles={customStyles}
					/>

					<ButtonComponent
						text="Validate"
						disabled={this.state.enable}
						onClick={() => this.asyncFunctionCall()}
					/>
				</div>
			</div>
		);
	}

}

export default withRouter(AndroiApplicationSubmissionForm);