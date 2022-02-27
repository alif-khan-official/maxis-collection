import React from "react";

import { withRouter } from "react-router-dom";
import ReactTable from "react-table-6";
import InputFieldComponent from "../../../widgets/InputFieldComponent";
import ButtonComponent from "../../../widgets/ButtonComponent";
import MainComponent from "../../../../common/MainComponent";
import AuthUtil from "../../../../auth/AuthUtil";
import DatePicker from "react-datepicker";
import { CSVLink } from "react-csv";
import Constant from "../../../../constants/GeneralConstants";
import numeral from "numeral";
import "../../../../App.css";
import "react-table-6/react-table.css";
import "react-datepicker/dist/react-datepicker.css";

class ManageCollectionComponentNM extends React.Component {
	constructor(props) {
		super(props);

		this.reducer = (previousValue, currentValue) => previousValue + currentValue.amount;
		this.state = {
			"data": [],
			"collectionId": "",
			"decisionResult": "",
			"fromDate": new Date(),
			"toDate": new Date(),
			"dataToDownload": [],
			"approvedCollectionCount": 0,
			"approvedCollectionAmount": 0
		}
			;

		this.handleFromDateChange = this.handleFromDateChange.bind(this);
		this.handleToDateChange = this.handleToDateChange.bind(this);
		this.downloadPDFMini = this.downloadPDFMini.bind(this);
		this.getSearchResult = this.getSearchResult.bind(this);
		this.prepareDownload = this.prepareDownload.bind(this);
		this.setInputValue = this.setInputValue.bind(this);
		this.setReference = this.setReference.bind(this);
		this.downloadData = this.downloadData.bind(this);
		this.downloadPDF = this.downloadPDF.bind(this);
		this.markApprove = this.markApprove.bind(this);
		this.view = this.view.bind(this);
	}

	view(collectionId) {
		console.log(collectionId);
	}

	setReference() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		try {
			fetch(gwUrl + "collection-service/endpoint/collection/set-pay-reference", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				body: JSON.stringify({
					"collectionId": this.state.collectionId,
					"reference": this.state.reference
				})
			})
				.then(res => res.json())
				.then(json => json.result)
				.then(result => {
					this.setInputValue("decisionResult", undefined, JSON.stringify(result));
				})
		}
		catch (e) {
			console.log(e)
		}
	}

	markApprove() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		try {
			fetch(gwUrl + "collection-service/endpoint/collection/decision-update", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				body: JSON.stringify({
					"collectionId": this.state.collectionId,
					"decision": "APPROVE"
				})
			})
				.then(res => res.json())
				.then(json => json.result)
				.then(result => {
					this.setInputValue("decisionResult", undefined, JSON.stringify(result));
				})
		}
		catch (e) {
			console.log(e)
		}
	}

	setInputValue(property1, property2, val) {
		let setValue = val;

		if (property2) {
			let p1 = this.state[property1];

			p1[property2] = setValue;
			this.setState({ [property1]: p1 });
		}
		else
			this.setState({ [property1]: setValue });
	}

	downloadPDFMini() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		let pdfCol = [];
		let cols = this.getColumns();
		for (let i = 0; i < (cols.length - 0); i++) {
			pdfCol.push(cols[i].Header);
		}

		let pdfTable = [];
		for (let j = 0; j < this.state.data.length; j++) {
			let row = [];

			row.push(this.state.data[j].dateTime ? this.state.data[j].dateTime.replace("T", " ").substring(0, 19) : "");
			row.push(this.state.data[j].amount);
			row.push(this.state.data[j].decision);

			row.push(this.state.data[j].merchantId);
			row.push(this.state.data[j].merchantName);
			row.push(this.state.data[j].merchantWallet.walletId);

			row.push(this.state.data[j].payeeId);
			row.push(this.state.data[j].payeeName);
			row.push(this.state.data[j].payeeWallet.walletId);

			row.push(this.state.data[j].cashPointId);
			row.push(this.state.data[j].cpName);
			row.push(this.state.data[j].cashpointWallet.walletId);

			row.push(this.state.data[j].collectionTypeName);
			row.push(this.state.data[j].invoiceNo);
			row.push(this.state.data[j].reference1);
			row.push(this.state.data[j].reference2);
			row.push(this.state.data[j].reference3);

			row.push(this.state.data[j].id);

			pdfTable.push(row);
		}

		console.log("pdfTable");
		console.log(pdfTable);
		let title = "Collection Report";

		let pdfType = "TYPE_PDF_TABLE";
		let reportType = "TYPE_REPORT_COLLECTION_MINI";
		let data = {
			"tableTitle": title,
			"data": pdfTable,
			"typeReport": reportType,
			"typePDF": pdfType,
			"columnHeader": pdfCol
		}
			;

		try {
			fetch(gwUrl + "collection-service/endpoint/pdfgenerator", {
				"method": "POST",
				"headers": {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				"body": JSON.stringify(data)
			})
				.then(res => res.json())
				.then(json => json.result)
				.then(result => {
					console.log(result);
					if (result === undefined) return;
					let byteCharacters = atob(result.pdfDocumentString);
					var blob = new Blob([byteCharacters], { type: "application/pdf" });
					console.log(blob);
					var link = document.createElement("a");
					link.href = "data:application/pdf;base64," + result.pdfDocumentString;
					var fileName = result.pdfDocumentTitle + ".pdf";
					link.download = fileName;
					link.click();
				})
		}
		catch (e) {
			console.log(e)
		}
	}

	downloadPDF() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		let pdfCol = [];
		let cols = this.getColumns();
		for (let i = 0; i < (cols.length - 0); i++) {
			pdfCol.push(cols[i].Header);
		}

		let pdfTable = [];
		for (let j = 0; j < this.state.data.length; j++) {
			let row = [];

			row.push(this.state.data[j].dateTime ? this.state.data[j].dateTime.replace("T", " ").substring(0, 19) : "");
			row.push(this.state.data[j].amount);
			row.push(this.state.data[j].decision);

			row.push(this.state.data[j].merchantId);
			row.push(this.state.data[j].merchantName);
			row.push(this.state.data[j].merchantWallet.walletId);

			row.push(this.state.data[j].payeeId);
			row.push(this.state.data[j].payeeName);
			row.push(this.state.data[j].payeeWallet.walletId);

			row.push(this.state.data[j].cashPointId);
			row.push(this.state.data[j].cpName);
			row.push(this.state.data[j].cashpointWallet.walletId);

			row.push(this.state.data[j].collectionTypeName);
			row.push(this.state.data[j].invoiceNo);
			row.push(this.state.data[j].reference1);
			row.push(this.state.data[j].reference2);
			row.push(this.state.data[j].reference3);

			pdfTable.push(row);
		}

		console.log("pdfTable");
		console.log(pdfTable);
		let title = "Collection Report";
		let data = {
			"tableTitle": title,
			"data": pdfTable,
			"typeReport": "TYPE_REPORT_COLLECTION",
			"typePDF": "TYPE_PDF_TABLE",
			"columnHeader": pdfCol
		}
			;

		try {
			fetch(gwUrl + "collection-service/endpoint/pdfgenerator", {
				"method": "POST",
				"headers": {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				"body": JSON.stringify(data)
			})
				.then(res => res.json())
				.then(json => json.result)
				.then(result => {
					console.log(result);
					if (result === undefined) return;
					let byteCharacters = atob(result.pdfDocumentString);
					var blob = new Blob([byteCharacters], { type: "application/pdf" });
					console.log(blob);
					var link = document.createElement("a");
					link.href = "data:application/pdf;base64," + result.pdfDocumentString;
					var fileName = result.pdfDocumentTitle + ".pdf";
					link.download = fileName;
					link.click();
				})
		}
		catch (e) {
			console.log(e)
		}
	}

	prepareDownload(source) {
		console.log("prepareDownload");
		console.log(source);
		const columns = this.getColumns();
		const currentRecords = this.state.data;

		let dataToDownload = [];

		let headerArray = [];
		for (var i = 0; i < columns.length; i++) {
			headerArray[i] = columns[i].Header;
		}
		dataToDownload[0] = headerArray;

		let roleList = AuthUtil.getRoleList();
		let roleId = roleList[0].name;
		if (roleId === Constant.ROLE_NAME_MERCHANT)
			for (let j = 0; j < currentRecords.length; j++) {
				let dataArray = [];

				dataArray[0] = currentRecords[j].dateTime.replace("T", " ").substring(0, 19);
				dataArray[1] = currentRecords[j].amount;
				dataArray[2] = currentRecords[j].decision;

				dataArray[3] = currentRecords[j].merchantId;
				dataArray[4] = currentRecords[j].merchantName;
				dataArray[5] = currentRecords[j].merchantWallet ? currentRecords[j].merchantWallet.walletId : "";

				dataArray[6] = currentRecords[j].payeeId;
				dataArray[7] = currentRecords[j].payeeName;
				dataArray[8] = currentRecords[j].payeeWallet ? currentRecords[j].payeeWallet.walletId : "";

				dataArray[9] = currentRecords[j].cashPointId;
				dataArray[10] = currentRecords[j].cpName;
				dataArray[11] = currentRecords[j].cashpointWallet ? currentRecords[j].cashpointWallet.walletId : "";

				dataArray[12] = currentRecords[j].collectionTypeName;
				dataArray[13] = currentRecords[j].invoiceNo;
				dataArray[14] = currentRecords[j].reference1;

				dataArray[15] = currentRecords[j].reference2;
				dataArray[16] = currentRecords[j].reference3;
				dataArray[17] = currentRecords[j].id;

				dataToDownload[j + 1] = dataArray;
			}
		else if (roleId === Constant.ROLE_NAME_NM)
			for (let j = 0; j < currentRecords.length; j++) {
				let dataArray = [];

				dataArray[0] = currentRecords[j].dateTime.replace("T", " ").substring(0, 10);
				dataArray[1] = currentRecords[j].amount;

				dataArray[2] = currentRecords[j].merchantName;
				dataArray[3] = currentRecords[j].payeeName;
				dataArray[4] = currentRecords[j].cpName;
				dataToDownload[j + 1] = dataArray;
			}
		else if (roleId === Constant.ROLE_NAME_AH)
			for (let j = 0; j < currentRecords.length; j++) {
				let dataArray = [];

				dataArray[0] = currentRecords[j].dateTime.replace("T", " ").substring(0, 19);
				dataArray[1] = currentRecords[j].amount;
				dataArray[2] = currentRecords[j].decision;

				dataArray[3] = currentRecords[j].merchantId;
				dataArray[4] = currentRecords[j].merchantName;
				dataArray[5] = currentRecords[j].merchantWallet ? currentRecords[j].merchantWallet.walletId : "";

				dataArray[6] = currentRecords[j].payeeId;
				dataArray[7] = currentRecords[j].payeeName;
				dataArray[8] = currentRecords[j].payeeWallet ? currentRecords[j].payeeWallet.walletId : "";

				dataArray[9] = currentRecords[j].cashPointId;
				dataArray[10] = currentRecords[j].cpName;
				dataArray[11] = currentRecords[j].cashpointWallet ? currentRecords[j].cashpointWallet.walletId : "";

				dataArray[12] = currentRecords[j].collectionTypeName;
				dataArray[13] = currentRecords[j].invoiceNo;
				dataArray[14] = currentRecords[j].reference1;

				dataArray[15] = currentRecords[j].reference2;
				dataArray[16] = currentRecords[j].reference3;
				dataArray[17] = currentRecords[j].id;

				dataArray[18] = currentRecords[j].payReference;
				dataArray[19] = currentRecords[j].reverse;

				if (currentRecords[j].feeDetails) {
					dataArray[20] = currentRecords[j].feeDetails.merchantEncashmentFeeRate;

					dataArray[21] = currentRecords[j].feeDetails.merchantEncashmentReceiveAmount.toFixed(4);
					dataArray[22] = currentRecords[j].feeDetails.merchantEncashmentFeeAmount.toFixed(4);
					dataArray[23] = currentRecords[j].feeDetails.merchantEncashmentFeeBankRatio;

					dataArray[24] = currentRecords[j].feeDetails.merchantEncashmentFeeBankAmount.toFixed(4);
					dataArray[25] = currentRecords[j].feeDetails.merchantEncashmentFeeMaxisAmount.toFixed(4);
					dataArray[26] = currentRecords[j].feeDetails.maxisVATRate;

					dataArray[27] = currentRecords[j].feeDetails.maxisVATAmount.toFixed(4);
					dataArray[28] = currentRecords[j].feeDetails.maxisPostVATAmount.toFixed(4);
					dataArray[29] = currentRecords[j].feeDetails.maxisPostVATAITRate;

					dataArray[30] = currentRecords[j].feeDetails.maxisPostVATAITAmount.toFixed(4);
					dataArray[31] = currentRecords[j].feeDetails.maxisPostVATPostAITAmount.toFixed(4);
					dataArray[32] = currentRecords[j].feeDetails.cashpointCollectionCommissionRate;

					dataArray[33] = currentRecords[j].feeDetails.cashpointCollectionCommissionAmount.toFixed(4);
					dataArray[34] = currentRecords[j].feeDetails.cashpointVATAmount.toFixed(4);
					dataArray[35] = currentRecords[j].feeDetails.cashpointPostVATAmount.toFixed(4);

					dataArray[36] = currentRecords[j].feeDetails.cashpointPostVATAITAmount.toFixed(4);
					dataArray[37] = currentRecords[j].feeDetails.cashpointPostVATPostAITAmount.toFixed(4);
				}

				dataToDownload[j + 1] = dataArray;
			}

		this.setState({ dataToDownload: dataToDownload });
	}

	handleFromDateChange(date) {
		this.setState({ fromDate: date });
	}

	handleToDateChange(date) {
		this.setState({ toDate: date });
	}

	getMockData() {
		let mockData = [{
			id: 1,
			name: "Mukit",
			occupation: "SE",
			address: "Dhaka"
		}
		];
		return mockData;
	}

	getColumns() {
		let roleList = AuthUtil.getRoleList();
		let roleId = roleList[0].name;

		let columns = [
			{
				id: "dateTime",
				Header: "Date",
				minWidth: 200,
				accessor: data => { return data.dateTime ? data.dateTime.replace("T", " ").substring(0, 19) : "" }
			},
			{
				id: "amount",
				Header: "Amount",
				accessor: "amount",
				Cell: ({ row }) => { return (<div align="right">{row.amount}</div>) }
			},
			{
				Header: "Status",
				accessor: "decision"
			},
			{
				Header: "Merchant ID",
				minWidth: 150,
				accessor: "merchantId"
			},
			{
				Header: "Merchant Name",
				minWidth: 250,
				accessor: "merchantName"
			},
			{
				Header: "Merchant Wallet",
				minWidth: 150,
				accessor: "merchantWallet.walletId"
			},
			{
				Header: "Payee ID",
				minWidth: 250,
				accessor: "payeeId"
			},
			{
				Header: "Payee Name",
				minWidth: 250,
				accessor: "payeeName"
			},
			{
				Header: "Payee Wallet",
				minWidth: 150,
				accessor: "payeeWallet.walletId"
			},
			{
				Header: "Cashpoint ID",
				minWidth: 150,
				accessor: "cashPointId"
			},
			{
				Header: "Cashpoint Name",
				minWidth: 250,
				accessor: "cpName"
			},
			{
				Header: "Cashpoint Wallet",
				minWidth: 150,
				accessor: "cashpointWallet.walletId"
			},
			{
				Header: "Collection Type",
				minWidth: 250,
				accessor: "collectionTypeName"
			},
			{
				Header: "Invoice",
				minWidth: 150,
				accessor: "invoiceNo"
			},
			{
				Header: "Ref1",
				minWidth: 150,
				accessor: "reference1"
			},
			{
				Header: "Ref2",
				minWidth: 150,
				accessor: "reference2"
			},
			{
				Header: "Ref3",
				minWidth: 150,
				accessor: "reference3"
			},
			{
				Header: "Collection ID",
				minWidth: 300,
				accessor: "id"
			}
		];

		let columnsNM = [
			{
				id: "dateTime",
				Header: "Date",
				minWidth: 150,
				accessor: data => { return data.dateTime ? data.dateTime.replace("T", " ").substring(0, 10) : "" }
			},
			{
				id: "amount",
				Header: "Amount",
				minWidth: 100,
				accessor: "amount",
				Cell: ({ row }) => { return (<div align="right">{numeral(row.amount).format("0,0.00")}</div>) }
			},
			{
				Header: "Merchant Name",
				minWidth: 250,
				accessor: "merchantName"
			},
			{
				Header: "Payee Name",
				minWidth: 250,
				accessor: "payeeName"
			},
			{
				Header: "Cashpoint Name",
				minWidth: 250,
				accessor: "cpName"
			}
		];

		let columnsMerchant = [
			{
				id: "dateTime",
				Header: "Date",
				minWidth: 200,
				accessor: data => { return data.dateTime ? data.dateTime.replace("T", " ").substring(0, 19) : "" }
			},
			{
				id: "amount",
				Header: "Amount",
				accessor: "amount",
				Cell: ({ row }) => { return (<div align="right">{row.amount}</div>) }
			},
			{
				Header: "Status",
				accessor: "decision"
			},
			{
				Header: "Payee Name",
				minWidth: 200,
				accessor: "payeeName"
			},
			{
				Header: "Payee Wallet",
				minWidth: 120,
				accessor: "payeeWallet.walletId"
			},
			{
				Header: "CP Wallet",
				minWidth: 120,
				accessor: "cashpointWallet.walletId"
			},
			{
				Header: "Collection Type",
				minWidth: 150,
				accessor: "collectionTypeName"
			},
			{
				Header: "Invoice",
				minWidth: 150,
				accessor: "invoiceNo"
			}
		];

		let columnsAH = [
			{
				id: "dateTime",
				Header: "Date",
				minWidth: 200,
				accessor: data => { return data.dateTime ? data.dateTime.replace("T", " ").substring(0, 19) : "" }
			},
			{
				id: "amount",
				Header: "Amount",
				accessor: "amount",
				Cell: ({ row }) => { return (<div align="right">{row.amount}</div>) }
			},
			{
				Header: "Status",
				accessor: "decision"
			},
			{
				Header: "Merchant ID",
				minWidth: 150,
				accessor: "merchantId"
			},
			{
				Header: "Merchant Name",
				minWidth: 250,
				accessor: "merchantName"
			},
			{
				Header: "Merchant Wallet",
				minWidth: 150,
				accessor: "merchantWallet.walletId"
			},
			{
				Header: "Payee ID",
				minWidth: 250,
				accessor: "payeeId"
			},
			{
				Header: "Payee Name",
				minWidth: 250,
				accessor: "payeeName"
			},
			{
				Header: "Payee Wallet",
				minWidth: 150,
				accessor: "payeeWallet.walletId"
			},
			{
				Header: "Cashpoint ID",
				minWidth: 150,
				accessor: "cashPointId"
			},
			{
				Header: "Cashpoint Name",
				minWidth: 250,
				accessor: "cpName"
			},
			{
				Header: "Cashpoint Wallet",
				minWidth: 150,
				accessor: "cashpointWallet.walletId"
			},
			{
				Header: "Collection Type",
				minWidth: 250,
				accessor: "collectionTypeName"
			},
			{
				Header: "Invoice",
				minWidth: 150,
				accessor: "invoiceNo"
			},
			{
				Header: "Ref1",
				minWidth: 150,
				accessor: "reference1"
			},
			{
				Header: "Ref2",
				minWidth: 150,
				accessor: "reference2"
			},
			{
				Header: "Ref3",
				minWidth: 150,
				accessor: "reference3"
			},
			{
				Header: "Collection ID",
				minWidth: 300,
				accessor: "id"
			},
			{
				id: "payReference",
				minWidth: 300,
				Header: "Pay reference",
				accessor: "payReference",
				Cell: ({ row }) => {
					let pr = row._original.payReference;
					if (pr !== undefined && pr != null) {
						return (
							<div align="center">
								{pr}
							</div>
						)
					}
					else
						return (<div></div>)
				}
			},
			{
				id: "reverse",
				Header: "External Encashment",
				minWidth: 200,
				accessor: "reverse",
				Cell: ({ row }) => {
					if (row._original.reverse) {
						return (
							<div align="">
								YES
							</div>
						)
					}
					else
						return (<div>No</div>)
				}
			},
			{
				id: "merchantRate",
				Header: "Merchant Rate",
				minWidth: 150,
				accessor: "merchantEncashmentFeeRate",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.merchantEncashmentFeeRate + "%") : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "merchantAmount",
				Header: "Merchant Amount",
				minWidth: 150,
				accessor: "merchantEncashmentReceiveAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? row._original.feeDetails.merchantEncashmentReceiveAmount : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "feeAmount",
				Header: "Fee Amount",
				minWidth: 150,
				accessor: "merchantEncashmentFeeAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.merchantEncashmentFeeAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "bankRatio",
				Header: "Bank Ratio",
				minWidth: 150,
				accessor: "merchantEncashmentFeeBankRatio",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? row._original.feeDetails.merchantEncashmentFeeBankRatio + "%" : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "bankAmount",
				Header: "Bank Amount",
				minWidth: 150,
				accessor: "merchantEncashmentFeeBankAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.merchantEncashmentFeeBankAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "maxisAmount",
				Header: "Maxis Amount",
				minWidth: 150,
				accessor: "merchantEncashmentFeeMaxisAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.merchantEncashmentFeeMaxisAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "maxisVATRate",
				Header: "VAT Rate",
				minWidth: 100,
				accessor: "maxisVATRate",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? row._original.feeDetails.maxisVATRate + "%" : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "maxisVATAmount",
				Header: "Maxis VAT Amount",
				minWidth: 200,
				accessor: "maxisVATAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.maxisVATAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "maxisPostVATAmount",
				Header: "Maxis Amount after VAT",
				minWidth: 200,
				accessor: "maxisPostVATAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.maxisPostVATAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "maxisPostVATAITRate",
				Header: "AIT Rate",
				minWidth: 100,
				accessor: "maxisPostVATAITRate",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.maxisPostVATAITRate + "%") : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "maxisPostVATAITAmount",
				Header: "Maxis AIT Amount",
				minWidth: 150,
				accessor: "maxisPostVATAITAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.maxisPostVATAITAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "maxisPostVATAITAmount",
				Header: "Maxis Amount after AIT",
				minWidth: 200,
				accessor: "maxisPostVATPostAITAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.maxisPostVATPostAITAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "cashpointCollectionCommissionRate",
				Header: "Cashpoint Rate",
				minWidth: 150,
				accessor: "cashpointCollectionCommissionRate",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? row._original.feeDetails.cashpointCollectionCommissionRate + "%" : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "cashpointCollectionCommissionAmount",
				Header: "Cashpoint Amount",
				minWidth: 150,
				accessor: "cashpointCollectionCommissionAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.cashpointCollectionCommissionAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "cashpointVATAmount",
				Header: "Cashpoint VAT Amount",
				minWidth: 200,
				accessor: "cashpointVATAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.cashpointVATAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "cashpointPostVATAmount",
				Header: "Cashpoint Amount after VAT",
				minWidth: 250,
				accessor: "cashpointPostVATAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.cashpointPostVATAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "cashpointPostVATAITAmount",
				Header: "Cashpoint AIT Amount",
				minWidth: 200,
				accessor: "cashpointPostVATAITAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.cashpointPostVATAITAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
			{
				id: "cashpointPostVATPostAITAmount",
				Header: "Cashpoint Amount after AIT",
				minWidth: 250,
				accessor: "cashpointPostVATPostAITAmount",
				Cell: ({ row }) => {
					let val = row._original.feeDetails ? (row._original.feeDetails.cashpointPostVATPostAITAmount - 0).toFixed(4) : "";
					if (val === undefined || val == null)
						val = "";
					return (
						<div align="right">
							{val}
						</div>
					)
				}
			},
		];
		console.log(roleId);
		if (roleId === Constant.ROLE_NAME_MERCHANT)
			return columnsMerchant;
		else if (roleId === Constant.ROLE_NAME_AH)
			return columnsAH;
		else if (roleId === Constant.ROLE_NAME_NM)
			return columnsNM;
		else
			return columns;
	}

	handleClick(row) {
		console.log("Encash: ", row._original);
	}

	componentDidMount() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		try {
			fetch(gwUrl + "collection-service/endpoint/collection/accountId", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				body: JSON.stringify({
					accountId: AuthUtil.getUsername(),
					fromDate: new Date(),
					toDate: new Date()
				})
			})
				.then(res => res.json())
				.then(json => json.result)
				.then(result => {
					try {
						let roleList = AuthUtil.getRoleList();
						let roleId = roleList[0].name;
						if (roleId === Constant.ROLE_NAME_NM) {
							let approveData = result.data;
							approveData = approveData.filter((collection) => { if (collection.decision === "APPROVE") return true; else return false; });
							this.setState({ "data": approveData });
							let approveDataAmount = approveData.reduce(function (previousValue, currentValue) { return previousValue + currentValue.amount }, 0);
							this.setState({ "approvedCollectionAmount": numeral(approveDataAmount).format("0,0.00") });
							this.setState({ "approvedCollectionCount": approveData.length });
						}
						else
							this.setState({ "data": result.data });
						this.prepareDownload("componentDidMount");
					} catch (error) {
						console.log(error);
						this.setState({
							"data": []
						});
					}
				})
		}
		catch (e) {
			console.log(e)
		}
	}

	getSearchResult() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		try {
			fetch(gwUrl + "collection-service/endpoint/collection/accountId", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken()
				},
				body: JSON.stringify({
					accountId: AuthUtil.getUsername(),
					fromDate: this.state.fromDate,
					toDate: this.state.toDate
				})
			})
				.then(res => res.json())
				.then(json => json.result)
				.then(result => {
					try {
						let roleList = AuthUtil.getRoleList();
						let roleId = roleList[0].name;
						if (roleId === Constant.ROLE_NAME_NM) {
							let approveData = result.data;
							approveData = approveData.filter((collection) => { if (collection.decision === "APPROVE") return true; else return false; });
							this.setState({ "data": approveData });
							let approveDataAmount = approveData.reduce(function (previousValue, currentValue) { return previousValue + currentValue.amount }, 0);
							this.setState({ "approvedCollectionAmount": numeral(approveDataAmount).format("0,0.00") });
							this.setState({ "approvedCollectionCount": approveData.length });
						}
						else
							this.setState({ "data": result.data });
						this.prepareDownload("getSearchResult");
					} catch (error) {
						console.log(error);
						this.setState({
							"data": []
						});
					}
				})
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

	getComponentDesign() {
		let columns = this.getColumns();
		let data = this.state.data;
		let filterCaseInsensitive = (filter, row, column) => {
			const id = filter.pivotId || filter.id
			return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true
		};
		let roleList = AuthUtil.getRoleList();
		let roleId = roleList[0].name;

		let componentDesign =
			<div className="home">
				<div className="row">
					<div className="col">
						<p className="page-title">Collection Management</p>
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
					<div className="col-lg-4">
						<ButtonComponent
							text="Download"
							onClick={() => this.downloadData()}
						/>
						<div>
							<CSVLink
								data={this.state.dataToDownload}
								filename="collection.csv"
								className="hidden"
								ref={(r) => this.csvLink = r}
								target="_blank" />
						</div>
					</div>
					<div className="col-lg-4">
						<ButtonComponent
							text="Download PDF"
							onClick={() => this.downloadPDF()}
						/>
					</div>
					<div className="col-lg-4">
						<ButtonComponent
							text="Download PDF Mini"
							onClick={() => this.downloadPDFMini()}
						/>
					</div>
				</div>

				<br></br>
				{roleId === Constant.ROLE_NAME_NM &&
					<div className="row">
						<div className="col-12">
							<b>Total Amount	:</b> &nbsp;{this.state.approvedCollectionAmount}
							<br />
							<b>Total Count	:</b> &nbsp;{this.state.approvedCollectionCount}
						</div>
					</div>
				}

				<div className="row">
					<div className="col-12">
						<ReactTable
							data={data}
							columns={columns}
							defaultPageSize={10}
							pageSizeOptions={[10, 20, 40]}
							filterable={true}
							defaultFilterMethod={filterCaseInsensitive}
						/>
					</div>
				</div>

				<br></br>

				{roleId !== "account_head" ?
					<div className="row">
						<div className="col">
						</div>
					</div>
					:
					<div className="row">
						<div className="col">
							<div className="card">
								<div className="card-header-list">
									<div className="row">
										<div className="col-sm-3">
											<div className="form-input-label"><b>Collection ID</b></div>
										</div>
										<div className="col-sm-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Collection ID"
												onChange={(val) => this.setInputValue("collectionId", undefined, val)}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-sm-3">
											<div className="form-input-label"><b>Reference</b></div>
										</div>
										<div className="col-sm-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Reference"
												onChange={(val) => this.setInputValue("reference", undefined, val)}
											/>
										</div>
									</div>

									<div className="row">
										<div className="col-lg-6">
											<ButtonComponent
												text="Approve"
												onClick={() => this.markApprove()}
											/>
										</div>
										<div className="col-lg-6">
											<ButtonComponent
												text="Set Reference"
												onClick={() => this.setReference()}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col">
											{this.state.decisionResult}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

				}
			</div>
		return componentDesign;
	}

	render() {
		let componentDesign = this.getComponentDesign()
		return <MainComponent component={componentDesign} />;
	}
}

export default withRouter(ManageCollectionComponentNM);