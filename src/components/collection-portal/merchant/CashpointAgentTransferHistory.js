import React from 'react';

import { withRouter }   from "react-router-dom"                         ;
import ReactTable       from "react-table-6"                            ;
import ButtonComponent  from "../../widgets/ButtonComponent"         ;
import MainComponent    from "../../../common/MainComponent"         ;
import AuthUtil         from "../../../auth/AuthUtil"                ;
import DatePicker       from "react-datepicker"                         ;
import {CSVLink}        from "react-csv"                                ;
import "../../../App.css"                                            ;
import "react-table-6/react-table.css"                                  ;
import "react-datepicker/dist/react-datepicker.css"                     ;

class CashpointAgentTransferHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "data"          : []        ,
            "fromDate"      : new Date(),
            "toDate"        : new Date(),
            "dataToDownload": []
        }

        this.handleFromDateChange   = this.handleFromDateChange.bind(this)  ;
        this.handleToDateChange     = this.handleToDateChange.bind(this)    ;
        this.getSearchResult        = this.getSearchResult.bind(this)       ;
        this.downloadData           = this.downloadData.bind(this)          ;
        this.prepareDownload        = this.prepareDownload.bind(this)       ;
    }

    prepareDownload(source)
    {
        console.log("prepareDownload");
        console.log(source);
        const columns = this.getColumns();
        const currentRecords = this.state.data;

        let dataToDownload = [];

        let headerArray = [];
        for (var i = 0; i < columns.length - 1; i++)
        {
            headerArray[i] = columns[i].Header;
        }
        dataToDownload[0] = headerArray;

        console.log("====currentRecords====");
        console.log(currentRecords);
        for(var j = 0; j < currentRecords.length; j++)
        {
            console.log("currentRecords[j]");
            console.log(currentRecords[j]);
            let dataArray = [];

            dataArray[0] = currentRecords[j].createDateTime.replace("T", " ").substring(0, 19);
            dataArray[1] = currentRecords[j].cashpointId;
            dataArray[2] = currentRecords[j].cashpoint?currentRecords[j].cashpoint.name: "";
            dataArray[3] = currentRecords[j].wallet?currentRecords[j].wallet.walletId: "";
            dataArray[4] = currentRecords[j].cashpoint == null? "" : (currentRecords[j].cashpoint.teritory? currentRecords[j].cashpoint.teritory.replace("Territory", ""): "");
            dataArray[5] = currentRecords[j].currency;
            dataArray[6] = currentRecords[j].amount;
            dataArray[7] = currentRecords[j].approvalDetails?currentRecords[j].approvalDetails.approvalDecision: "";
           
            dataToDownload[j + 1] = dataArray;
        }

        this.setState({"dataToDownload": dataToDownload});
    }

    handleFromDateChange(date)
    {
        this.setState({"fromDate": date});
    }

    handleToDateChange(date)
    {
        this.setState({"toDate": date});
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
        let columns = [{
            Header: 'Date',
            id: 'requestTime',
            width:180,
            accessor: data => {return data.requestTime? data.createDateTime.replace("T", " ").substring(0, 19): ""}
        }, 
        {
            Header: 'Agent Id',
            width:120,
            accessor: 'agentId'
        },
        {
            Header: 'Name',
            width:200,
            accessor: 'agent.name'
        },
        {
            Header: 'Wallet',
            width:120,
            accessor: 'agentWallet.walletId'
        }, 
        {
            Header: 'Amount',
            width:100,
            accessor: 'transferAmount',
            Cell: ({ row }) => {return (<div align="right">{row.amount}</div>)}
        },
        {
            Header: 'Status',
            width:100,
            accessor: 'apiCallStatus'
        }
        ];

        return columns;
    }

    handleClick(row, decision) {
        let data = {
            accountUserId: AuthUtil.getUsername(),
            requestId: row._original.domainId,
            decision: decision,
            commentOne: "n",
            commentTwo: "n"
        }
        this.updateApproval(data);
        console.log("decision: ", decision, " Lifting: ", row._original);
    }

    componentDidMount() 
    {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;

        try 
        {
            fetch   (   gwUrl + "collection-service/endpoint/wallet/cpagenttransfer/accountId", 
                        {   "method"    :   "POST",
                            "headers"   :   {   "Content-Type"  : "application/json",
                                                "token"         : "Bearer " + AuthUtil.getIdToken()
                                            }
                            ,
                            "body"      : JSON.stringify(   {   "accountId" : AuthUtil.getUsername(),
                                                                "fromDate"  : this.state.fromDate,
                                                                "toDate"    : this.state.toDate                                                            
                                                            }
                                                        )
                        }
                    )
                    .then(res => res.json())
                    .then(json => json.result)
                    .then   (result =>  {
                                            try 
                                            {
                                                this.setState({"data": result.data});
//                                                this.prepareDownload("componentDidMount");
                                            } 
                                            catch (error) 
                                            {
                                                console.log(error);
                                                this.setState({"data": []});
                                            }
                                        }
                            )
            ;
        }
        catch (e) 
        {
            console.log(e)
        }
    }

    downloadData() 
    {
        try 
        {   this.csvLink.link.click();
        }
        catch (e) 
        {
            console.log(e)
        }
    }

    getSearchResult() 
    {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;

        try 
        {
            fetch   (   gwUrl + "collection-service/endpoint/cpagenttransfer/accountId", 
                        {   "method"    :   "POST",
                            "headers"   :   {   "Content-Type"  : "application/json",
                                                "token"         : "Bearer " + AuthUtil.getIdToken()
                                            }
                            ,
                            "body"      : JSON.stringify(   {   "accountId" : AuthUtil.getUsername(),
                                                                "fromDate"  : this.state.fromDate,
                                                                "toDate"    : this.state.toDate                                                            
                                                            }
                                                        )
                        }
                    )
                    .then(res => res.json())
                    .then(json => json.result)
                    .then   (result =>  {
                                            try 
                                            {
                                                this.setState({"data": result.data});
//                                                this.prepareDownload("componentDidMount");
                                            } 
                                            catch (error) 
                                            {
                                                console.log(error);
                                                this.setState({"data": []});
                                            }
                                        }
                            )
            ;
        }
        catch (e) 
        {
            console.log(e)
        }
    }

    getComponentDesign() {
        let columns = this.getColumns();
        let data = this.state.data;
        let filterCaseInsensitive = (filter, row, column) =>    {
                                                                    const id = filter.pivotId || filter.id
                                                                    return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true
                                                                }
        ;
        let componentDesign = <div className="home">
            <div className="row">
                <div className="col-sm-6">
                    <h5>Agent Transactions</h5>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-2"><b>Date range</b></div>
                <div className="col-sm-6">From: &nbsp;
                    <DatePicker dateFormat="yyyy-MMM-dd" selected={this.state.fromDate} onChange={this.handleFromDateChange} />
                    &nbsp;To: &nbsp;
                <DatePicker dateFormat="yyyy-MMM-dd" selected={this.state.toDate} onChange={this.handleToDateChange} />
                </div>
                <div className="col-sm-2">
                    <ButtonComponent
                        text="Search"
                        onClick={() => this.getSearchResult()}
                    />
                </div>
                <div className="col-sm-2">
                    <ButtonComponent
                        text="Download"
                        onClick={() => this.downloadData()}
                    />
                    <div>
                        <CSVLink
                            data={this.state.dataToDownload}
                            filename="lifting.csv"
                            className="hidden"
                            ref={(r) => this.csvLink = r}
                            target="_blank"/>
                    </div>
                </div>
            </div>
            <br></br>
            <div className="row">
                <br></br>
                <div className="col-lg-12">
                    <ReactTable
                        data={data}
                        columns={columns}
                        defaultPageSize={20}
                        pageSizeOptions={[20, 30, 40]}
                        filterable={true}
                        defaultFilterMethod = {filterCaseInsensitive}
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

export default withRouter(CashpointAgentTransferHistory);