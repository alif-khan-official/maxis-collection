import React from 'react';

import { withRouter } from 'react-router-dom';
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import MainComponent from '../../../../common/MainComponent';
import AuthUtil from '../../../../auth/AuthUtil';
import '../../../../App.css'

class ApproverMyCashHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    getMockData() {
        let mockData = [{
            id: 1,
            name: "Mukit",
            occupation: "SE",
            address: "Dhaka"
        },
        {
            id: 2,
            name: "Ratul",
            occupation: "SE",
            address: "Dhaka"
        },
        {
            id: 3,
            name: "Emon",
            occupation: "SE",
            address: "Dhaka"
        },
        {
            id: 4,
            name: "Fahim",
            occupation: "SE",
            address: "Dhaka"
        }
        ];
        return mockData;
    }

    getColumns() {
        let columns = [
            {
                "Header": "Date",
                "id": "generateTime",
                "minWidth": 200,
                "accessor": data => { return data.generateTime ? data.generateTime.replace("T", " ").substring(0, 19) : "" }
            },
            {
                "Header": "Merchant ID",
                "minWidth": 150,
                "accessor": "merchantId"
            },
            {
                "Header": "Merchant Name",
                "minWidth": 300,
                "accessor": "merchantName"
            },
            {
                "Header": "Merchant Wallet",
                "minWidth": 150,
                "accessor": "walletAccountId"
            },
            {
                "Header": "Amount",
                "minWidth": 100,
                "accessor": "encashmentAmount",
                "Cell": ({ row }) => { return (<div align="right">{row.encashmentAmount}</div>) }
            },
            {
                "Header": "Decision",
                "minWidth": 150,
                "accessor": "decision"
            }
        ]
            ;

        return columns;
    }

    handleClick(row, decision) {
        let data = {
            approverId: AuthUtil.getUsername(),
            encashmentId: row.domainId,
            comment: "na",
            decision: decision
        }
        this.updateApproval(data);
        console.log("decision: ", decision, " Lifting: ", row._original);
    }

    async updateApproval(data) {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;

        try {
            let res = await fetch(gwUrl + 'collection-service/endpoint/encashment/decision-update', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken()
                },
                body: JSON.stringify({
                    approverId: data.approverId,
                    encashmentId: data.encashmentId,
                    comment: data.comment,
                    decision: data.decision
                })
            });

            let result = await res.json();

            // if (result.result.status === "SUCCESS") {
            //     AuthUtil.setMenu(result.result.response[0].menuId);
            //     this.props.history.push("/home");
            // }

            console.log(result);

        } catch (e) {
            console.log(e);
        }
    }

    componentDidMount() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;

        try {
            fetch(gwUrl + 'collection-service/endpoint/encashment/accountId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken()
                },
                body: JSON.stringify({
                    accountId: AuthUtil.getUsername()
                })
            })
                .then(res => res.json())
                .then(json => json.result)
                .then(result => {
                    try {
                        this.setState({
                            'data': result.data
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

    }

    getComponentDesign() {
        let columns = this.getColumns();
        let data = this.state.data;
        let filterCaseInsensitive = (filter, row, column) => {
            const id = filter.pivotId || filter.id
            return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true
        }
            ;
        let componentDesign =
            <div className="home">
                <div className="row">
                    <div className="col">
                        <p className="page-title">Bank Encashment MyCash History</p>
                    </div>
                </div>
                <br></br>
                <div className="row">
                </div>
                <div className="row">
                    <br></br>
                    <div className="col-sm-12">
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

export default withRouter(ApproverMyCashHistory);