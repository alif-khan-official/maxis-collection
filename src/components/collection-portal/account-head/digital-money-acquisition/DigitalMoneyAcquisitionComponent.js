import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import ButtonComponent from '../../../widgets/ButtonComponent';
import MainComponent from '../../../../common/MainComponent'
import AuthUtil from '../../../../auth/AuthUtil';
import '../../../../App.css'

class DigitalMoneyAcquisitionComponent extends React.Component {

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
                Header: 'Date',
                id: 'localDateTime',
                minWidth: 200,
                accessor: data => { return data.localDateTime ? data.localDateTime.replace("T", " ").substring(0, 19) : "" }
            },
            {
                Header: "Wallet",
                id: "wallet",
                accessor: data => { return data.wallet === "5ee20671-b381-464b-b2cf-c12de23060af" ? "MyCash" : (data.wallet === "6cacff8c-8f0b-4fd1-aa3c-6819d3261624" ? "Citi" : (data.wallet === "f9a969a7-679e-4701-a1dc-0eff10d0c31e" ? "General" : "UCash")) },
                minWidth: 100
            },
            {
                Header: 'Amount',
                accessor: 'amount'
            },
            {
                Header: 'Reference',
                accessor: 'referenceDetails'
            }
        ];

        return columns;
    }

    handleClick(row) {
        this.props.history.push({
            pathname: '/add-digital-money-acquisition-request',
            state: { row }
        });
    }


    componentDidMount() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;

        try {
            fetch(gwUrl + 'collection-service/endpoint/digital-money-acquisition', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken()
                },
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
        let componentDesign = <div className="home">
            <div className="row">
                <div className="col">
                    <p className="page-title">Digital Money Acquisition Management</p>
                </div>
            </div>

            <div className="row bottom-margin-10px">
                <div className="col-lg-4">
                    <ButtonComponent
                        text='Acquisition'
                        onClick={() => this.props.history.push({
                            pathname: '/add-digital-money-acquisition-request',
                        })}
                    />
                </div>
            </div>

            <div className="row">
                <br></br>
                <div className="col-lg-12">
                    <ReactTable
                        data={this.state.data}
                        columns={columns}
                        defaultPageSize={10}
                        pageSizeOptions={
                            [10, 20, 40]
                        }
                    />
                </div>
                <div className="col-sm-4">
                </div>
            </div>

        </div >
        return componentDesign;
    }

    render() {

        let componentDesign = this.getComponentDesign()

        return <MainComponent component={componentDesign} />;
    }
}

export default withRouter(DigitalMoneyAcquisitionComponent);