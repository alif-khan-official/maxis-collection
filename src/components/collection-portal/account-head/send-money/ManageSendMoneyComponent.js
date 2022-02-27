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

class ManageSendMoneyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "data": [],
            "fromDate": new Date(),
            "toDate": new Date(),
            "dataToDownload": []
        }
            ;

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
        for (var i = 0; i < columns.length; i++) {
            headerArray[i] = columns[i].Header;
        }
        dataToDownload[0] = headerArray;

        for (var j = 0; j < currentRecords.length; j++) {
            console.log("currentRecords[j]");
            console.log(currentRecords[j]);
            let dataArray = [];

            dataArray[0] = currentRecords[j].requestTime.replace("T", " ").substring(0, 19);
            dataArray[1] = currentRecords[j].transferAmount;
            dataArray[2] = currentRecords[j].apiCallStatus;

            dataArray[3] = currentRecords[j].merchant !== undefined && currentRecords[j].merchant != null ? currentRecords[j].merchant.userId : "";
            dataArray[4] = currentRecords[j].merchant !== undefined && currentRecords[j].merchant != null ? currentRecords[j].merchant.name : "";
            dataArray[5] = currentRecords[j].merchantWallet !== undefined && currentRecords[j].merchantWallet != null ? currentRecords[j].merchantWallet.walletId : "";

            dataArray[6] = currentRecords[j].payee !== undefined && currentRecords[j].payee != null ? currentRecords[j].payee.userId : "";
            dataArray[7] = currentRecords[j].payee !== undefined && currentRecords[j].payee != null ? currentRecords[j].payee.name : "";
            dataArray[8] = currentRecords[j].payeeWallet !== undefined && currentRecords[j].payeeWallet != null ? currentRecords[j].payeeWallet.walletId : "";

            dataArray[9] = currentRecords[j].payee !== undefined && currentRecords[j].payee != null ? currentRecords[j].payee.district : "";
            dataArray[10] = currentRecords[j].payee !== undefined && currentRecords[j].payee != null ? currentRecords[j].payee.thana : "";

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
        let columns = [
            {
                id: "requestTime",
                Header: "Date",
                minWidth: 200,
                accessor: data => { return data.requestTime !== undefined ? data.requestTime.replace("T", " ").substring(0, 19) : "" }
            },
            {
                id: "transferAmount",
                Header: "Amount",
                accessor: "transferAmount",
                Cell: ({ row }) => { return (<div align="right">{row.transferAmount}</div>) }
            },
            {
                Header: "Status",
                accessor: "apiCallStatus"
            },
            {
                Header: "Merchant ID",
                minWidth: 150,
                accessor: "merchant.userId"
            },
            {
                Header: "Merchant Name",
                minWidth: 250,
                accessor: "merchant.name"
            },
            {
                Header: "Merchant Wallet",
                minWidth: 150,
                accessor: "merchantWallet.walletId"
            },
            {
                Header: "Payee ID",
                minWidth: 150,
                accessor: "payee.userId"
            },
            {
                Header: "Payee Name",
                minWidth: 250,
                accessor: "payee.name"
            },
            {
                Header: "Payee Wallet",
                minWidth: 150,
                accessor: "payeeWallet.walletId"
            },
            {
                Header: "District",
                minWidth: 150,
                accessor: "payee.district"
            },
            {
                Header: "Thana",
                minWidth: 250,
                accessor: "payee.thana"
            }
        ];

        return columns;
    }

    handleClick(row) {
        console.log("Encash: ", row._original);
    }

    componentDidMount() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;

        try {
            fetch(gwUrl + "collection-service/endpoint/wallet/transfer/payee-merchant/accountId", {
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
            fetch(gwUrl + "collection-service/endpoint/wallet/transfer/payee-merchant/accountId", {
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

        let componentDesign = <div className="home">
            <div className="row">
                <div className="col">
                    <p className="page-title">Send Money Management</p>
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
                            filename="SendMoney.csv"
                            className="hidden"
                            ref={(r) => this.csvLink = r}
                            target="_blank" />
                    </div>
                </div>
            </div>

            <div className="row">
                <br></br>
                <div className="col-sm-12">
                    <ReactTable
                        data={data}
                        columns={columns}
                        defaultPageSize={10}
                        pageSizeOptions={[10, 20, 40]}
                        filterable={true}
                        defaultFilterMethod={filterCaseInsensitive}
                    />
                </div>
                <div className="col-sm-0">
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

export default withRouter(ManageSendMoneyComponent);