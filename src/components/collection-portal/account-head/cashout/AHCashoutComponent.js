import React from "react";

import { withRouter } from "react-router-dom";
import ReactTable from "react-table-6";
import ButtonComponent from "../../../widgets/ButtonComponent";
import MainComponent from "../../../../common/MainComponent";
import AuthUtil from "../../../../auth/AuthUtil";
import DatePicker from "react-datepicker";
import { CSVLink } from "react-csv";
import "../../../../App.css";
import "react-table-6/react-table.css";
import "react-datepicker/dist/react-datepicker.css";

class AHCashoutComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"data": [],
			"fromDate": new Date(),
			"toDate": new Date(),
			"dataToDownload": []
		}

		this.handleFromDateChange = this.handleFromDateChange.bind(this);
		this.handleToDateChange = this.handleToDateChange.bind(this);
		this.getSearchResult = this.getSearchResult.bind(this);
		this.downloadData = this.downloadData.bind(this);
		this.prepareDownload = this.prepareDownload.bind(this);
	}

	prepareDownload(source) {
		console.log("prepareDownload");
		console.log(source);
		const columns = this.getColumns();
		const currentRecords = this.state.data;

		let dataToDownload = [];

		let headerArray = [];
		for (var i = 0; i < columns.length - 1; i++) {
			headerArray[i] = columns[i].Header;
		}
		dataToDownload[0] = headerArray;

		console.log("====currentRecords====");
		console.log(currentRecords);
		for (var j = 0; j < currentRecords.length; j++) {
			console.log("currentRecords[j]");
			console.log(currentRecords[j]);
			let dataArray = [];

			dataArray[0] = currentRecords[j].requestTime.replace("T", " ").substring(0, 19);
			dataArray[1] = currentRecords[j].merchantId;
			dataArray[2] = currentRecords[j].merchantName;
			dataArray[3] = currentRecords[j].merchantWalletAccountId;
			dataArray[4] = currentRecords[j].agentId;
			dataArray[5] = currentRecords[j].agentName;
			dataArray[6] = currentRecords[j].agentWalletAccountId;
			dataArray[7] = currentRecords[j].cashoutMerchantRequestAmount;
			dataArray[8] = currentRecords[j].cashoutRequestStatus;

			dataToDownload[j + 1] = dataArray;
		}

		this.setState({ "dataToDownload": dataToDownload });
	}

	handleFromDateChange(date) {
		this.setState({ "fromDate": date });
	}

	handleToDateChange(date) {
		this.setState({ "toDate": date });
	}

	getMockData() {
		let mockData = [
			{
				"id": 1,
				"name": "Mukit",
				"occupation": "SE",
				"address": "Dhaka"
			}
		];
		return mockData;
	}

	getColumns() {
		let columns = [
			{
				"Header": "Date",
				"id": "requestTime",
				"minWidth": 180,
				"accessor": data => { return data.requestTime ? data.requestTime.replace("T", " ").substring(0, 19) : "" }
			},
			{
				"Header": "Merchant ID",
				"minWidth": 120,
				"accessor": "merchantId"
			},
			{
				"Header": "Merchant Name",
				"minWidth": 250,
				"accessor": "merchantName"
			},
			{
				"Header": "Merchant Wallet",
				"minWidth": 250,
				"accessor": "merchantWalletAccountId"
			},
			{
				"Header": "Agent ID",
				"minWidth": 120,
				"accessor": "agentId"
			},
			{
				"Header": "Agent Name",
				"minWidth": 250,
				"accessor": "agentName"
			},
			{
				"Header": "Agent Wallet",
				"minWidth": 250,
				"accessor": "agentWalletAccountId"
			},
			{
				"Header": "Amount",
				"minWidth": 120,
				"accessor": "cashoutMerchantRequestAmount"
			},
			{
				"Header": "Status",
				"minWidth": 200,
				"accessor": "cashoutRequestStatus"
			}
		];

		return columns;
	}

	componentDidMount() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		try {
			fetch(gwUrl + "collection-service/endpoint/cashout/accountId",
				{
					"method": "POST",
					"headers": {
						"Content-Type": "application/json",
						"token": "Bearer " + AuthUtil.getIdToken()
					}
					,
					"body": JSON.stringify({
						"accountId": AuthUtil.getUsername(),
						"fromDate": this.state.fromDate,
						"toDate": this.state.toDate
					}
					)
				}
			)
				.then(res => res.json())
				.then(json => json.result)
				.then(result => {
					try {
						this.setState({ "data": result.data });
						this.prepareDownload("componentDidMount");
					}
					catch (error) {
						console.log(error);
						this.setState({ "data": [] });
					}
				}
				)
				;
		}
		catch (e) {
			console.log(e)
		}
	}

	downloadData() {
		try {
			this.csvLink.link.click();
		}
		catch (e) {
			console.log(e)
		}
	}

	getSearchResult() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		try {
			fetch(gwUrl + "collection-service/endpoint/cashout/accountId",
				{
					"method": "POST",
					"headers": {
						"Content-Type": "application/json",
						"token": "Bearer " + AuthUtil.getIdToken()
					}
					,
					"body": JSON.stringify({
						"accountId": AuthUtil.getUsername(),
						"fromDate": this.state.fromDate,
						"toDate": this.state.toDate
					}
					)
				}
			)
				.then(res => res.json())
				.then(json => json.result)
				.then(result => {
					try {
						this.setState({ "data": result.data });
						this.prepareDownload("componentDidMount");
					}
					catch (error) {
						console.log(error);
						this.setState({ "data": [] });
					}
				}
				)
				;
		}
		catch (e) {
			console.log(e)
		}
	}

	cashout() {
		this.props.history.push({ "pathname": '/add-cashout' });
	}

	getComponentDesign() {
		let columns = this.getColumns();
		let data = this.state.data;

		console.log("====data====");
		console.log(data);

		let filterCaseInsensitive = (filter, row, column) => {
			const id = filter.pivotId || filter.id
			return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true
		}
			;
		let componentDesign = <div className="home">
			<div className="row">
				<div className="col">
					<p className="page-title">Cashout Management</p>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<div className="card">
						<div className="card-header-list">
							<div className="row">
								<div className="col-lg-2 my-auto"><b>Search by Date Range</b></div>
								<div className="col-lg-3 my-auto">From: &nbsp; &ensp;
									<DatePicker dateFormat="yyyy-MMM-dd" selected={this.state.fromDate} onChange={this.handleFromDateChange} />
								</div>
								<div className="col-lg-3 my-auto">&emsp; To: &emsp;
									<DatePicker dateFormat="yyyy-MMM-dd" selected={this.state.toDate} onChange={this.handleToDateChange} />
								</div>
								<div className="col-lg-4">
									<ButtonComponent
										text="Search"
										onClick={() => this.getSearchResult()}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<br></br>

			<div className="row bottom-margin-10px">
				<div className="col-lg-4 offset-lg-8">
					<ButtonComponent
						text="Download"
						onClick={() => this.downloadData()}
					/>
					<div>
						<CSVLink
							data={this.state.dataToDownload}
							filename="cashout.csv"
							className="hidden"
							ref={(r) => this.csvLink = r}
							target="_blank" />
					</div>
				</div>
			</div>

			<div className="row">
				<br></br>
				<div className="col-lg-12">
					<ReactTable
						data={data}
						columns={columns}
						defaultPageSize={20}
						pageSizeOptions={[20, 30, 40]}
						filterable={true}
						defaultFilterMethod={filterCaseInsensitive}
					/>
				</div>
				<div className="col-sm-4">
				</div>
			</div>

		</div>
		return componentDesign;
	}

	render() {

		let componentDesign = this.getComponentDesign()

		return <MainComponent component={componentDesign} />;
	}
}

export default withRouter(AHCashoutComponent);