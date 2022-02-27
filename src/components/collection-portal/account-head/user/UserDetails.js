import React from "react";
import { withRouter } from "react-router-dom";
import InputFieldComponent from "../../../widgets/InputFieldComponent"
import ButtonComponent from "../../../widgets/ButtonComponent";
import Select from "react-select";
import MainComponent from "../../../../common/MainComponent";
import '../../../../App.css'
import AuthUtil from "../../../../auth/AuthUtil";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

class UserDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		let data = this.props.location.state;
		console.log("====data====");
		console.log(data);
		this.collectionTargets = {merchant: [{"label": "Not Selected", value: ""}, {"label": "Merchant", value: "MERCHANT"}, {"label": "Payee", value: "PAYEE"}, {"label": "Mixed", value: "MIXED"}], payee: [{"label": "Not Selected", value: ""}, {"label": "Merchant", value: "MERCHANT"}, {"label": "Payee", value: "PAYEE"}]};
		this.state = {
			userId: data.row._original.userId,
			user: {role:[{displayName: "", name: ""}], userId:"", name: "", phoneNumber: "", email: "", address: "", otherProperties:[{propertyCode: "MERCHANT_COLLECTION_TARGET", propertyValue: ""}]},
			collectionTarget:{"label": "Not Selected", value: ""},
			userThana: { "label": "Thana", "value": "" },
			userDistrict: { "label": "District", "value": "" },
			userRegion: { "label": "Region", "value": "" },
			userArea: { "label": "Area", "value": "" },
			userTerritory: { "label": "Territory", "value": "" },

			managerGeneralWallet: {walletId: ""},
			managerWallet: {},

			thanas: [],
			districts: [],
			regions: [],
			areas: [],
			territories: [],

			thanasDD: [],
			districtsDD: [],
			regionsDD: [],
			areasDD: [],
			territoriesDD: [],
			thanasDDFiltered: [],
			areasDDFiltered: [],
			territoriesDDFiltered: [],

			enable: true,

			settingsDay: {value: ""},
			fromHour: {value: ""},
			fromMinute: {value: ""},
			toHour: {value: ""},
			toMinute: {value: ""},

			rate: "",
			introducer: "",
			kam: "",

			"data": [],

			role: "",
			response: "",
			weekdays: [{ "value": "SUNDAY", "label": "Sunday" },
			{ "value": "MONDAY", "label": "Monday" },
			{ "value": "TUEDAY", "label": "Tueday" },
			{ "value": "WEDNESDAY", "label": "Wednesday" },
			{ "value": "THURSDAY", "label": "Thursday" },
			{ "value": "FRIDAY", "label": "MFriday" },
			{ "value": "SATURDAY", "label": "Saturday" }
			],
			hours: [{ "value": "00", "label": "00" },
			{ "value": "01", "label": "01" },
			{ "value": "02", "label": "02" },
			{ "value": "03", "label": "03" },
			{ "value": "04", "label": "04" },
			{ "value": "05", "label": "05" },
			{ "value": "06", "label": "06" },
			{ "value": "07", "label": "07" },
			{ "value": "08", "label": "08" },
			{ "value": "09", "label": "09" },
			{ "value": "10", "label": "10" },
			{ "value": "11", "label": "11" },
			{ "value": "12", "label": "12" },
			{ "value": "13", "label": "13" },
			{ "value": "14", "label": "14" },
			{ "value": "15", "label": "15" },
			{ "value": "16", "label": "16" },
			{ "value": "17", "label": "17" },
			{ "value": "18", "label": "18" },
			{ "value": "19", "label": "19" },
			{ "value": "20", "label": "20" },
			{ "value": "21", "label": "21" },
			{ "value": "22", "label": "22" },
			{ "value": "23", "label": "23" }
			],
			minutes: [
				{ "value": "00", "label": "00" },
				{ "value": "01", "label": "01" },
				{ "value": "02", "label": "02" },
				{ "value": "03", "label": "03" },
				{ "value": "04", "label": "04" },
				{ "value": "05", "label": "05" },
				{ "value": "06", "label": "06" },
				{ "value": "07", "label": "07" },
				{ "value": "08", "label": "08" },
				{ "value": "09", "label": "09" },

				{ "value": "10", "label": "10" },
				{ "value": "11", "label": "11" },
				{ "value": "12", "label": "12" },
				{ "value": "13", "label": "13" },
				{ "value": "14", "label": "14" },
				{ "value": "15", "label": "15" },
				{ "value": "16", "label": "16" },
				{ "value": "17", "label": "17" },
				{ "value": "18", "label": "18" },
				{ "value": "19", "label": "19" },

				{ "value": "20", "label": "20" },
				{ "value": "21", "label": "21" },
				{ "value": "22", "label": "22" },
				{ "value": "23", "label": "23" },
				{ "value": "24", "label": "24" },
				{ "value": "25", "label": "25" },
				{ "value": "26", "label": "26" },
				{ "value": "27", "label": "27" },
				{ "value": "28", "label": "28" },
				{ "value": "29", "label": "29" },

				{ "value": "30", "label": "30" },
				{ "value": "31", "label": "31" },
				{ "value": "32", "label": "32" },
				{ "value": "33", "label": "33" },
				{ "value": "34", "label": "34" },
				{ "value": "35", "label": "35" },
				{ "value": "36", "label": "36" },
				{ "value": "37", "label": "37" },
				{ "value": "38", "label": "38" },
				{ "value": "39", "label": "39" },

				{ "value": "40", "label": "40" },
				{ "value": "41", "label": "41" },
				{ "value": "42", "label": "42" },
				{ "value": "43", "label": "43" },
				{ "value": "44", "label": "44" },
				{ "value": "45", "label": "45" },
				{ "value": "46", "label": "46" },
				{ "value": "47", "label": "47" },
				{ "value": "48", "label": "48" },
				{ "value": "49", "label": "49" },

				{ "value": "50", "label": "58" },
				{ "value": "51", "label": "58" },
				{ "value": "52", "label": "58" },
				{ "value": "53", "label": "58" },
				{ "value": "54", "label": "58" },
				{ "value": "55", "label": "58" },
				{ "value": "56", "label": "58" },
				{ "value": "57", "label": "58" },
				{ "value": "58", "label": "58" },
				{ "value": "59", "label": "59" }
			]
		};

		this.saveCollectionTarget = this.saveCollectionTarget.bind(this);
		this.loadUsers = this.loadUsers.bind(this);
		this.loadDistrict = this.loadDistrict.bind(this);
		this.loadThanas = this.loadThanas.bind(this);
		this.loadRegions = this.loadRegions.bind(this);
		this.loadAreas = this.loadAreas.bind(this);
		this.loadTerritories = this.loadTerritories.bind(this);
		this.loadCommercials = this.loadCommercials.bind(this);
		this.loadTimes = this.loadTimes.bind(this);

		this.populateDDs = this.populateDDs.bind(this);
		this.populateCollectionTarget = this.populateCollectionTarget.bind(this);

		this.setInputValue = this.setInputValue.bind(this);
		this.setUserValue = this.setUserValue.bind(this);
		this.setDistrict = this.setDistrict.bind(this);
		this.setThana = this.setThana.bind(this);
		this.setRegion = this.setRegion.bind(this);
		this.setArea = this.setArea.bind(this);
		this.setTerritory = this.setTerritory.bind(this);

		this.save = this.save.bind(this);
		this.saveTime = this.saveTime.bind(this);
		this.saveCommercials = this.saveCommercials.bind(this);

		this.deleteTime = this.deleteTime.bind(this);
		this.getColumns = this.getColumns.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.loadManagerWallet = this.loadManagerWallet.bind(this);
		this.createManagerGeneralWallet = this.createManagerGeneralWallet.bind(this);
	}

	populateCollectionTarget(user)
	{
		let op = user.otherProperties;
		if (op !== undefined)
		{
			let t = undefined;
			for(let i = 0; i < op.length && t === undefined; i++)
			{
				let p = op[i];//propertyCode: "MERCHANT_COLLECTION_TARGET", propertyValue: ""
				if (p.propertyCode === "MERCHANT_COLLECTION_TARGET")
				{
					t = p;
				}
			}
			
			if (t !== undefined)
			{
				let collectionTarget = {label: "Not Selected", value: ""};
				
				if (t.propertyValue === "MERCHANT")
					collectionTarget = {label: "Merchant", value: "MERCHANT"};
				else if (t.propertyValue === "PAYEE")
					collectionTarget = {label: "Payee", value: "PAYEE"};
				else if (t.propertyValue === "MIXED")
					collectionTarget = {label: "Mixed", value: "MIXED"};
					
				this.setInputValue("collectionTarget", collectionTarget);
			}
		}
	}
	
	async createManagerGeneralWallet(userId) {
		console.log(userId);
		this.managerGeneralWallet = false;
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		try {
			let res = await fetch(gwUrl + "collection-service/endpoint/wallet/create-general-wallet", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				body: JSON.stringify({ "ownerId": userId })
			});

			let response = await res.json();
			this.setState({ enable: true });

			this.loadManagerWallet(userId);
			console.log(response);
		} catch (e) {
			this.setInputValue("response", "Failed");
			this.setState({ enable: true });
			console.log(e);
		}

	}

	async saveCollectionTarget(userId) {
		console.log(userId);
		this.managerGeneralWallet = false;
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		try {
			let res = await fetch(gwUrl + "collection-service/endpoint/user/save-collection-target", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				body: JSON.stringify({ "userId": userId , "propertyCode": "MERCHANT_COLLECTION_TARGET", propertyValue: this.state.collectionTarget.value})
			});

			let response = await res.json();
			this.setState({ enable: true });
			this.setState({ response: JSON.stringify(response) });

//			this.loadManagerWallet(userId);
			console.log(response);
		} catch (e) {
			this.setInputValue("response", "Failed");
			this.setState({ enable: true });
			console.log(e);
		}

	}

	getComponentDesign() {
		let design = <div className="card-form-body">
			<div className="row">
				<div className="col-sm-12">
					<div align="center"><h3>User Details</h3></div>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">User Id</div>
				</div>
				<div className="col-sm-8">
					<InputFieldComponent
						className="form-input"
						type="text"
						placeholder=""
						value={this.state.user.userId ? this.state.user.userId : ""}
						onChange={(val) => this.setInputValue("id", val)}
						readOnly={true}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">User Name</div>
				</div>
				<div className="col-sm-8">
					<InputFieldComponent
						className="form-input"
						type="text"
						placeholder=""
						value={this.state.user.name ? this.state.user.name : ""}
						onChange={(val) => this.setUserValue("name", val)}
						readOnly={false}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">User Role</div>
				</div>
				<div className="col-sm-8">
					<InputFieldComponent
						className="form-input"
						type="text"
						placeholder=""
						value={this.state.user.role && this.state.user.role.length > 0 ? this.state.user.role[0].displayName : ""}
						onChange={(val) => this.setInputValue("role", val)}
						readOnly={true}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">User Phone</div>
				</div>
				<div className="col-sm-8">
					<InputFieldComponent
						className="form-input"
						type="text"
						placeholder=""
						value={this.state.user.phoneNumber ? this.state.user.phoneNumber : ""}
						onChange={(val) => this.setUserValue("phoneNumber", val)}
						readOnly={false}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">User Email</div>
				</div>
				<div className="col-sm-8">
					<InputFieldComponent
						className="form-input"
						type="text"
						placeholder=""
						value={this.state.user.email ? this.state.user.email : ""}
						onChange={(val) => this.setUserValue("email", val)}
						readOnly={false}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">District</div>
				</div>
				<div className="col-sm-8">
					<Select
						defaultValue={this.state.userDistrict}
						value={this.state.userDistrict}
						placeholder="District"
						options={this.state.districtsDD}
						isSearchable={true}
						onSelect={(value) => { this.setDistrict(value) }}
						onChange={(value) => { this.setDistrict(value) }}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">Thana </div>
				</div>
				<div className="col-sm-8">
					<Select
						defaultValue={this.state.userThana}
						value={this.state.userThana}
						placeholder="Thana"
						options={this.state.thanasDDFiltered}
						isSearchable={true}
						onSelect={(value) => { this.setThana(value) }}
						onChange={(value) => { this.setThana(value) }}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">Address </div>
				</div>
				<div className="col-sm-8">
					<InputFieldComponent
						className="form-input"
						type="text"
						placeholder="Address"
						value={this.state.user.address ? this.state.user.address : ""}
						onChange={(val) => this.setUserValue("address", val)}
						readOnly={false}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">Region</div>
				</div>
				<div className="col-sm-8">
					<Select
						defaultValue={this.state.userRegion}
						value={this.state.userRegion}
						placeholder="Region"
						options={this.state.regionsDD}
						isSearchable={true}
						onSelect={(value) => { this.setRegion(value) }}
						onChange={(value) => { this.setRegion(value) }}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">Area </div>
				</div>
				<div className="col-sm-8">
					<Select
						defaultValue={this.state.userArea}
						value={this.state.userArea}
						placeholder="Area"
						options={this.state.areasDDFiltered}
						isSearchable={true}
						onSelect={(value) => { this.setArea(value) }}
						onChange={(value) => { this.setArea(value) }}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">Territory </div>
				</div>
				<div className="col-sm-8">
					<Select
						defaultValue={this.state.userTerritory}
						value={this.state.userTerritory}
						placeholder="Territory"
						options={this.state.territoriesDDFiltered}
						isSearchable={true}
						onSelect={(value) => { this.setTerritory(value) }}
						onChange={(value) => { this.setTerritory(value) }}
					/>
				</div>
			</div>

			<div className="row">
				<div className="col-sm-2">
				</div>
				<div className="col-sm-8">
					<div className="d-flex justify-content-end">
						<div className="justify-content-start left-padding-10px">
							<ButtonComponent
								text="Save"
								onClick={() => this.save()}
								disabled={!this.state.enable}
							/>
						</div>
					</div>
				</div>
			</div>

			{this.state.user && this.state.user.role && this.state.user.role[0] && !(this.state.user.role[0].name === "Maxis-Collection-Territory-Manager" || this.state.user.role[0].name === "Maxis-Collection-Area-Manager" || this.state.user.role[0].name === "Maxis-Collection-Nation-Manager") &&
				<div>
					<hr />
					<h5>Commercial Settings</h5>
					<hr />

					<div className="row">
						<div className="col-sm-2">
							<div className="form-input-label">KAM </div>
						</div>
						<div className="col-sm-8">
							<InputFieldComponent
								className="form-input"
								type="text"
								placeholder="KAM"
								value={this.state.kam ? this.state.kam : ""}
								onChange={(val) => this.setInputValue("kam", val)}
								readOnly={false}
							/>
						</div>
					</div>
				</div>
			}

			{this.state.user && this.state.user.role && this.state.user.role[0] && !(this.state.user.role[0].name === "Maxis-Collection-Territory-Manager" || this.state.user.role[0].name === "Maxis-Collection-Area-Manager" || this.state.user.role[0].name === "Maxis-Collection-Nation-Manager") &&
				<div className="row">
					<div className="col-sm-2">
						<div className="form-input-label">Introducer </div>
					</div>
					<div className="col-sm-8">
						<InputFieldComponent
							className="form-input"
							type="text"
							placeholder="Introducer"
							value={this.state.introducer ? this.state.introducer : ""}
							onChange={(val) => this.setInputValue("introducer", val)}
							readOnly={false}
						/>
					</div>
				</div>
			}

			{this.state.user && this.state.user.role && this.state.user.role[0] && !(this.state.user.role[0].name === "Maxis-Collection-Territory-Manager" || this.state.user.role[0].name === "Maxis-Collection-Area-Manager" || this.state.user.role[0].name === "Maxis-Collection-Nation-Manager") &&
				<div className="row">
					<div className="col-sm-2">
						<div className="form-input-label">Rate </div>
					</div>
					<div className="col-sm-8">
						<InputFieldComponent
							className="form-input"
							type="text"
							placeholder="Rate"
							value={this.state.rate ? this.state.rate : ""}
							onChange={(val) => this.setInputValue("rate", val)}
							readOnly={false}
						/>
					</div>
				</div>
			}

			{this.state.user && this.state.user.role && this.state.user.role[0] && !(this.state.user.role[0].name === "Maxis-Collection-Territory-Manager" || this.state.user.role[0].name === "Maxis-Collection-Area-Manager" || this.state.user.role[0].name === "Maxis-Collection-Nation-Manager") &&
				<div className="row">
					<div className="col-sm-2">
					</div>
					<div className="col-sm-8">
						<div className="d-flex justify-content-end">
							<div className="justify-content-start left-padding-10px">
								<ButtonComponent
									text="Set"
									onClick={() => this.saveCommercials()}
									disabled={!this.state.enable}
								/>
							</div>
						</div>
					</div>
				</div>
			}

			{this.state.user && this.state.user.role && this.state.user.role[0] && (this.state.user.role[0].name === "Maxis-Collection-Territory-Manager" || this.state.user.role[0].name === "Maxis-Collection-Area-Manager" || this.state.user.role[0].name === "Maxis-Collection-Nation-Manager") &&
				<div className="row">
					<div className="col-sm-2">
						<div className="form-input-label">Wallet</div>
					</div>
					<div className="col-sm-4">
						<InputFieldComponent
							className="form-input"
							type="text"
							placeholder="Maxis Wallet"
							value={this.state.managerGeneralWallet ? this.state.managerGeneralWallet.walletId : ""}
							onChange={(val) => this.setInputValue("managerWallet", val)}
							readOnly={true}
						/>
					</div>
				</div>
			}

			{!this.state.managerWallet && this.state.user && this.state.user.role && this.state.user.role[0] && (this.state.user.role[0].name === "Maxis-Collection-Territory-Manager" || this.state.user.role[0].name === "Maxis-Collection-Area-Manager" || this.state.user.role[0].name === "Maxis-Collection-Nation-Manager") &&
				<div className="row">
					<div className="col-sm-2">
					</div>
					<div className="col-sm-8">
						<div className="d-flex justify-content-end">
							<div className="justify-content-start left-padding-10px">
								<ButtonComponent
									text="Create Wallet"
									onClick={() => this.createManagerGeneralWallet(this.state.user.userId)}
									disabled={!this.state.enable}
								/>
							</div>
						</div>
					</div>
				</div>
			}

			{
				(this.state.role === "Merchant" || this.state.role === "Payee") &&
				<div>
					<hr />
					<h5>Collection Target</h5>
					<hr />
					<div className="row">
						<div className="col-sm-2">
							<div className="form-input-label">Target</div>
						</div>
						<div className="col-sm-2">
							<Select
								placeholder="Target"
								options={this.state.role === "Merchant"?this.collectionTargets.merchant:this.collectionTargets.payee}
								value={this.state.collectionTarget}
								defaultValue={this.state.collectionTarget}
								onChange={(value) => { this.setInputValue("MERCHANT_COLLECTION_TARGET", value) }}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-2">
						</div>
						<div className="col-sm-8">
							<div className="d-flex justify-content-end">
								<div className="justify-content-start left-padding-10px">
									<ButtonComponent
										text="Set Target"
										onClick={() => this.saveCollectionTarget(this.state.user.userId)}
										disabled={!this.state.enable}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			}

			{
				this.state.role === "Merchant" &&
				<div>
					<hr />
					<h5>Collection Type Settings</h5>
					<hr />

					<div className="row">
						<div className="col-sm-2">
							<div className="form-input-label">Day </div>
						</div>
						<div className="col-sm-2">
							<Select
								placeholder="Day"
								options={this.state.weekdays}
								value={this.state.settingsDay}
								onChange={(value) => { this.setInputValue("settingsDay", value) }}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-2">
							<div className="form-input-label">From </div>
						</div>
						<div className="col-sm-2">
							<div className="form-input-label">Hour </div>
						</div>
						<div className="col-sm-2">
							<Select
								options={this.state.hours}
								value={this.state.fromHour}
								onChange={(value) => { this.setInputValue("fromHour", value) }}
							/>
						</div>
						<div className="col-sm-2">
							<div className="form-input-label">Minute</div>
						</div>
						<div className="col-sm-2">
							<Select
								options={this.state.minutes}
								value={this.state.fromMinute}
								onChange={(value) => { this.setInputValue("fromMinute", value) }}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-2">
							<div className="form-input-label">To </div>
						</div>
						<div className="col-sm-2">
							<div className="form-input-label">Hour </div>
						</div>
						<div className="col-sm-2">
							<Select
								options={this.state.hours}
								value={this.state.toHour}
								onChange={(value) => { this.setInputValue("toHour", value) }}
							/>
						</div>
						<div className="col-sm-2">
							<div className="form-input-label">Minute</div>
						</div>
						<div className="col-sm-2">
							<Select
								options={this.state.minutes}
								value={this.state.toMinute}
								onChange={(value) => { this.setInputValue("toMinute", value) }}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-12">
							<div className="d-flex justify-content-start">
								<div className="justify-content-start left-padding-10px">
									<ButtonComponent
										text="Add"
										onClick={() => this.saveTime()}
										disabled={!this.state.enable}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<br></br>
						<div className="col-lg-12">
							<ReactTable
								data={this.state.data}
								columns={this.getColumns()}
								defaultPageSize={5}
								pageSizeOptions={
									[5, 20, 40]
								}
							/>
						</div>
						<div className="col-sm-4">
						</div>
					</div>
				</div>
			}
			<hr />
			<div className="row">
				<div className="col-sm-2">
					<div className="form-input-label">RESPONSE </div>
				</div>
				<div className="col-sm-8">
					<InputFieldComponent
						className="form-input"
						type="text"
						placeholder=""
						value={this.state.response ? this.state.response : ""}
						onChange={(val) => this.setInputValue("response", val)}
						readOnly={true}
					/>
				</div>
			</div>

		</div>
		return design;
	}

	populateDDs(user) {
		this.setInputValue("role", user.role[0].name);

		let districtsLength = this.state.districts.length;
		let selectedDistrict = {id: ""};
		for (let i = 0; i < districtsLength; i++) {

			if (user.district === this.state.districts[i].code) {
				selectedDistrict = this.state.districts[i];
				this.setInputValue("userDistrict", this.state.districtsDD[i]);
				break;
			}
		}

		let thanasDDFiltered = [];
		for (let i = 0; i < this.state.thanas.length; i++) {
			if (selectedDistrict.id === this.state.thanas[i].districtId) {

				thanasDDFiltered.push(this.state.thanasDD[i]);
			}
		}
		this.setInputValue("thanasDDFiltered", thanasDDFiltered);

		for (let i = 0; i < this.state.thanas.length; i++) {
			if (user.thana === this.state.thanas[i].code) {
				this.setInputValue("userThana", this.state.thanasDD[i]);
				console.log("thana found:", i);
				break;
			}
		}

		let selectedRegion = {id: ""};
		for (let i = 0; i < this.state.regions.length; i++)
			if (user.region === this.state.regions[i].code) {
				this.setInputValue("userRegion", this.state.regionsDD[i]);
				selectedRegion = this.state.regions[i];
				break;
			}

		let selectedArea = {id: ""};
		for (let i = 0; i < this.state.areas.length; i++)
			if (user.area === this.state.areas[i].code) {
				this.setInputValue("userArea", this.state.areasDD[i]);
				selectedArea = this.state.areas[i];
				break;
			}

		for (let i = 0; i < this.state.territories.length; i++)
			if (user.teritory === this.state.territories[i].code) {
				this.setInputValue("userTerritory", this.state.territoriesDD[i]);
				break;
			}

		console.log("selectedRegion");
		let areasDDFiltered = [];
		for (let i = 0; i < this.state.areas.length; i++) {
			if (selectedRegion.id === this.state.areas[i].regionId) {

				areasDDFiltered.push(this.state.areasDD[i]);
			}
		}
		this.setInputValue("areasDDFiltered", areasDDFiltered);

		let territoriesDDFiltered = [];
		for (let i = 0; i < this.state.territories.length; i++) {
			if (selectedArea.id === this.state.territories[i].areaId) {

				territoriesDDFiltered.push(this.state.territoriesDD[i]);
			}
		}
		this.setInputValue("territoriesDDFiltered", territoriesDDFiltered);
	}

	setArea(selection) {
		console.log(selection);
		let selectedArea = this.state.areas[selection.value];
		this.setInputValue("userArea", this.state.areasDD[selection.value]);
		console.log(selectedArea);
		let territoriessDDFiltered = [];
		for (let i = 0; i < this.state.territories.length; i++) {
			if (selectedArea.id === this.state.territories[i].areaId) {
				territoriessDDFiltered.push(this.state.territoriesDD[i]);
			}
		}
		this.setInputValue("territoriesDDFiltered", territoriessDDFiltered);
	}

	setRegion(selection) {
		console.log(selection);
		let selectedRegion = this.state.regions[selection.value];
		this.setInputValue("userRegion", this.state.regionsDD[selection.value]);
		this.setInputValue("userArea", { "label": "Area", "value": "" });
		this.setInputValue("userTerritory", { "label": "Territory", "value": "" });
		console.log(selectedRegion);
		let areasDDFiltered = [];
		for (let i = 0; i < this.state.areas.length; i++) {
			if (selectedRegion.id === this.state.areas[i].regionId) {

				areasDDFiltered.push(this.state.areasDD[i]);
			}
		}
		this.setInputValue("areasDDFiltered", areasDDFiltered);
		this.setInputValue("territoriesDDFiltered", []);
	}

	setTerritory(selection) {
		console.log(selection);
		this.setInputValue("userTerritory", this.state.territoriesDD[selection.value]);
	}

	setThana(selection) {
		console.log(selection);
		this.setInputValue("userThana", this.state.thanasDD[selection.value]);
	}

	setDistrict(selection) {
		console.log(selection);
		let selectedDistrict = this.state.districts[selection.value];
		this.setInputValue("userDistrict", this.state.districtsDD[selection.value]);
		this.setInputValue("userThana", { "label": "Thana", "value": "" });
		console.log(selectedDistrict);
		let thanasDDFiltered = [];
		for (let i = 0; i < this.state.thanas.length; i++) {
			if (selectedDistrict.id === this.state.thanas[i].districtId) {

				thanasDDFiltered.push(this.state.thanasDD[i]);
			}
		}
		this.setInputValue("thanasDDFiltered", thanasDDFiltered);
	}

	setInputValue(property, val) {
		let u = this.state.user;
		if (property === "MERCHANT_COLLECTION_TARGET")
		{
			let op = u.otherProperties;
			
			if (op === undefined || op === null)
				op = [];
			let i = -1;
			let t = {};
			for(i = 0; i < op.length; i++)
			{
				t = op[i];
				if (t.propertyCode === "MERCHANT_COLLECTION_TARGET")
					break;
			}
			if (t === undefined)
			{
				t = {propertyCode: "MERCHANT_COLLECTION_TARGET", propertyValue: val.value};
			}
			else
				t.propertyValue = val;
			
			op[i] = t;
			u.otherProperties = op;
			
			this.setInputValue("collectionTarget", val);
			property = "user";
			val = u;
		}
		
		this.setState({[property]: val});
	}

	setUserValue(property, val) {
		let user = this.state.user;
		user[property] = val;
		this.setInputValue("user", user);
	}

	loadUsers = function (gwUrl) {
		try {
			fetch(gwUrl + 'collection-service/endpoint/user/' + this.state.userId, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				}
			})
				.then(res => res.json())
				.then(json => json.result)
				.then(result => {
					try {
						let user = result.response[0];
						this.setState({ 'user': user });

						if (this.state.user && this.state.user.role && this.state.user.role[0] && (this.state.user.role[0].name === "Maxis-Collection-Territory-Manager" || this.state.user.role[0].name === "Maxis-Collection-Area-Manager" || this.state.user.role[0].name === "Maxis-Collection-Nation-Manager")) {
							this.loadManagerWallet(this.state.user.userId);
						}
						this.populateDDs(user);
						this.loadCommercials(gwUrl);
						this.populateCollectionTarget(user);
					} catch (error) {
						console.log(error);
						this.setState({
							'data': []
						});
					}
				})
		}
		catch (e) {
			console.log(e)
		}
	};

	loadCommercials = function (gwUrl) {
		let entity = this;
		try {
			fetch(gwUrl + 'collection-service/endpoint/user/get-commercial-id', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				},
				body: JSON.stringify({ userId: this.state.user.userId })
			})
				.then(res => res.json())
				.then(json => json.result)
				.then(result => {
					try {
						console.log("====COMMERCISLS====");
						console.log(result.response);

						for (let i = 0; i < result.response.length; i++) {
							if (result.response[i].commercialPropertyName === "KAM")
								entity.setInputValue("kam", result.response[i].commercialPropertyValue);
							else if (result.response[i].commercialPropertyName === "INTRODUCER")
								entity.setInputValue("introducer", result.response[i].commercialPropertyValue);
							else if (result.response[i].commercialPropertyName === "RATE")
								entity.setInputValue("rate", result.response[i].commercialPropertyValue);
						}
						this.loadTimes();
					} catch (error) {
						console.log(error);
						this.setState({
							'data': []
						});
					}
				})
		}
		catch (e) {
			console.log(e)
		}
	};

	loadTimes = function () {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		try {
			fetch(gwUrl + 'collection-service/endpoint/merchantreversetimesettings/get?userId=' + this.state.user.userId, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				}
			})
				.then(res => res.json())
				.then(result => {
					try {
						this.setState({
							'data': result
						});
					} catch (error) {
						console.log(error);
						this.setState({
							'data': []
						});
					}
				})


		}
		catch (e) {
			console.log(e)
		}
	};

	loadTerritories(gwUrl) {
		try {
			fetch(gwUrl + 'collection-service/endpoint/api/territory-all', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				}
			})
				.then(res => res.json())
				.then(json => json.territorys)
				.then(territorys => {
					try {
						this.setState({ 'territories': territorys });
						let territoriesDD = this.state.territoriesDD;
						for (let i = 0; i < territorys.length; i++) {
							let territory = { "label": territorys[i].displayName, "value": i };
							territoriesDD.push(territory);
						}
						this.setInputValue('territoriesDD', territoriesDD);
						this.loadUsers(gwUrl);
					} catch (error) {
						console.log(error);
						this.setState({
							'territories': []
						});
					}
				})
		}
		catch (e) {
			console.log(e)
		}
	}

	loadAreas(gwUrl) {
		try {
			fetch(gwUrl + 'collection-service/endpoint/api/area-all', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				}
			})
				.then(res => res.json())
				.then(json => json.areas)
				.then(areas => {
					try {
						this.setState({ 'areas': areas });
						let areasDD = this.state.areasDD;
						for (let i = 0; i < areas.length; i++) {
							let area = { "label": areas[i].displayName, "value": i };
							areasDD.push(area);
						}
						this.setInputValue('areasDD', areasDD);
						this.loadTerritories(gwUrl);
					} catch (error) {
						console.log(error);
						this.setState({
							'areas': []
						});
					}
				})
		}
		catch (e) {
			console.log(e)
		}
	}

	loadRegions(gwUrl) {
		try {
			fetch(gwUrl + 'collection-service/endpoint/api/region-all', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				}
			})
				.then(res => res.json())
				.then(json => json.regions)
				.then(regions => {
					try {
						this.setState({ 'regions': regions });
						let regionsDD = this.state.regionsDD;
						for (let i = 0; i < regions.length; i++) {
							let region = { "label": regions[i].displayName, "value": i };
							regionsDD.push(region);
						}
						this.setInputValue('regionsDD', regionsDD);
						this.loadAreas(gwUrl);
					} catch (error) {
						console.log(error);
						this.setState({
							'regions': []
						});
					}
				})
		}
		catch (e) {
			console.log(e)
		}
	}

	loadDistrict(gwUrl) {
		try {
			fetch(gwUrl + 'collection-service/endpoint/api/district', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				}
			})
				.then(res => res.json())
				.then(json => json.districts)
				.then(districts => {
					try {
						this.setState({ 'districts': districts });
						let districtsDD = this.state.districtsDD;
						for (let i = 0; i < districts.length; i++) {
							let district = { "label": districts[i].displayName, "value": i };
							districtsDD.push(district);
						}
						this.setInputValue('districtsDD', districtsDD);
						this.loadRegions(gwUrl);
					} catch (error) {
						console.log(error);
						this.setState({
							'districts': []
						});
					}
				})
		}
		catch (e) {
			console.log(e)
		}
	}

	loadThanas(gwUrl) {
		try {
			fetch(gwUrl + 'collection-service/endpoint/api/thana-all', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				}
			})
				.then(res => res.json())
				.then(json => json.thanas)
				.then(thanas => {
					try {
						this.setState({ 'thanas': thanas });
						let thanasDD = this.state.thanasDD;
						for (let i = 0; i < thanas.length; i++) {
							let thana = { "label": thanas[i].displayName, "value": i };
							thanasDD.push(thana);
						}
						this.setInputValue('thanasDD', thanasDD);
						this.loadDistrict(gwUrl);
					} catch (error) {
						console.log(error);
						this.setState({
							'thanas': []
						});
					}
				})
		}
		catch (e) {
			console.log(e)
		}
	}

	componentDidMount() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		this.loadThanas(gwUrl);
	}

	async loadManagerWallet(userId) {
		console.log(userId);
		this.managerGeneralWallet = false;
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		try {
			let res = await fetch(gwUrl + "collection-service/endpoint/wallet/accountId", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				body: JSON.stringify({ "accountId": userId })
			});

			let response = await res.json();
			this.setState({ enable: true });


			for (let walletIndex = 0; response && response.result && response.result.data && walletIndex < response.result.data.length; walletIndex++) {
				let wallet = response.result.data[walletIndex];
				if (wallet.walletType === "General") {
					this.setInputValue("managerGeneralWallet", wallet);
					this.managerGeneralWallet = wallet;
					break;
				}
			}

			console.log(response);
		} catch (e) {
			this.setInputValue("response", "Failed");
			this.setState({ enable: true });
			console.log(e);
		}

	}

	async save() {
		this.setState({ enable: false });
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		let userData = {};
		try {
			userData.userId = this.state.user.userId;
			userData.name = this.state.user.name;
			userData.email = this.state.user.email;
			userData.phoneNumber = this.state.user.phoneNumber;
			userData.name = this.state.user.name;
			userData.address = this.state.user.address;
			userData.district = this.state.districts[this.state.userDistrict.value].code;
			userData.thana = this.state.thanas[this.state.userThana.value].code;
			userData.region = this.state.regions[this.state.userRegion.value].code;
			userData.area = this.state.areas[this.state.userArea.value].code;
			userData.teritory = this.state.territories[this.state.userTerritory.value].code;
		}
		catch (e) {

		}

		try {
			let res = await fetch(gwUrl + "collection-service/endpoint/user/save-user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				body: JSON.stringify(userData)
			});

			let response = await res.json();
			this.setState({ enable: true });
			this.setInputValue("response", JSON.stringify(response));
		} catch (e) {
			this.setState({ enable: true });
			console.log(e);
		}
	}

	async saveTime() {
		this.setState({ enable: false });
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		let timeData = {};
		try {
			timeData.userId = this.state.user.userId;
			timeData.settingsDay = this.state.settingsDay.value;
			timeData.fromHour = this.state.fromHour.value;
			timeData.fromMinute = this.state.fromMinute.value;
			timeData.toHour = this.state.toHour.value;
			timeData.toMinute = this.state.toMinute.value;
		}
		catch (e) {

		}

		if (!timeData.settingsDay || timeData.settingsDay === "" ||
			!timeData.fromHour || timeData.settingsDay === "" ||
			!timeData.fromMinute || timeData.fromMinute === "" ||
			!timeData.toHour || timeData.toHour === "" ||
			!timeData.toMinute || timeData.toMinute === ""
		) {
			this.setState({ enable: true });
			this.setInputValue("response", "Time data missing");
			return;
		}

		try {
			let res = await fetch(gwUrl + "collection-service/endpoint/merchantreversetimesettings/save", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				body: JSON.stringify(timeData)
			});

			let response = await res.json();
			this.setState({ enable: true });
			if (response && response.id) {
				this.loadTimes();
				this.setInputValue("response", "Saved successfully with id: " + response.id);
			}
			else
				this.setInputValue("response", "Failed");
		} catch (e) {
			this.setInputValue("response", "Failed");
			this.setState({ enable: true });
			console.log(e);
		}
	}

	async saveCommercials() {
		this.setState({ enable: false });
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		let commercialDataKAM = { "userId": this.state.user.userId, "commercialPropertyName": "KAM", "commercialPropertyValue": this.state.kam };
		let commercialDataINTRODUCER = { "userId": this.state.user.userId, "commercialPropertyName": "INTRODUCER", "commercialPropertyValue": this.state.introducer };
		let commercialDataRATE = { "userId": this.state.user.userId, "commercialPropertyName": "RATE", "commercialPropertyValue": this.state.rate };

		try {
			let res = await fetch(gwUrl + "collection-service/endpoint/user/save-user-commercial", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				body: JSON.stringify(commercialDataKAM)
			});

			let response = await res.json();

			try {
				let res = await fetch(gwUrl + "collection-service/endpoint/user/save-user-commercial", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"token": "Bearer " + AuthUtil.getIdToken()
					},
					body: JSON.stringify(commercialDataINTRODUCER)
				});

				response = await res.json();
				try {
					let res = await fetch(gwUrl + "collection-service/endpoint/user/save-user-commercial", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"token": "Bearer " + AuthUtil.getIdToken()
						},
						body: JSON.stringify(commercialDataRATE)
					});

					this.setState({ enable: true });
					response = await res.json();
					this.setInputValue("response", JSON.stringify(response));
				} catch (e) {
					this.setState({ enable: true });
					console.log(e);
				}
			} catch (e) {
				this.setState({ enable: true });
				console.log(e);
			}

		} catch (e) {
			this.setState({ enable: true });
			console.log(e);
		}
	}

	render() {
		let componentDesign = this.getComponentDesign();
		return <MainComponent component={componentDesign} />;
	}

	deleteTime(timeRow) {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		try {
			fetch(gwUrl + 'collection-service/endpoint/merchantreversetimesettings/remove?id=' + timeRow._original.id, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				}
			})
				.then(res => res.json())
				.then(result => {
					try {
						console.log(result);
						this.loadTimes();
						this.setInputValue("response", JSON.stringify(result));
					} catch (error) {
						console.log(error);
						this.setInputValue("response", JSON.stringify(result));
					}
				})
				;

		}
		catch (e) {
			console.log(e)
		}
	}

	handleClick(row, action) {
		if (action === undefined || action === null || action === "DELETE")
			this.deleteTime(row);
	}

	getColumns() {
		let columns = [
			{
				Header: 'Day',
				accessor: 'settingsDay',
				width: 150,
			},
			{
				Header: 'From hour',
				accessor: 'fromHour',
				width: 150,
			},
			{
				Header: 'From minute',
				accessor: 'fromMinute',
				width: 150,
			},
			{
				Header: 'To hour',
				accessor: 'toHour',
				width: 150,
			},
			{
				Header: 'To minute',
				accessor: 'toMinute',
				width: 150,
			},
			{
				fixed: "right",
				columns: [{
					Header: "Action",
					accessor: "name",
					width: 250,
					Cell: ({ row }) => {
						return (
							<ButtonComponent
								text='Delete'
								onClick={() => { this.handleClick(row, "DELETE") }}
							/>
						)
					}
				}]

			}
		];

		return columns;
	}

}

export default withRouter(UserDetails);