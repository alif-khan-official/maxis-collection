import React from 'react';

import { withRouter } from 'react-router-dom';
import InputFieldComponent from '../../../widgets/InputFieldComponent'
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import ButtonComponent from '../../../widgets/ButtonComponent';
import MainComponent from '../../../../common/MainComponent'
import AuthUtil from '../../../../auth/AuthUtil';
import '../../../../App.css'

class ManageWalletComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filterValue: ''
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
                Header: 'Property ID',
                accessor: 'id',
                minWidth: 250,
            }, {
                Header: 'Entity ID',
                accessor: 'userId',
                minWidth: 150,
            }, {
                Header: 'Property',
                accessor: 'commercialPropertyName',
                minWidth: 200,
            },
            {
                Header: 'Value',
                accessor: 'commercialPropertyValue',
                minWidth: 100,
            },
            {
                Header: 'Status',
                accessor: 'status',
                minWidth: 150,
            },
            {
                Header: 'Creation Date',
                accessor: 'creationTime',
                minWidth: 200,
            },
            {
                Header: 'Deactivation date',
                accessor: 'deactivationTime',
                minWidth: 200,
            },
            {
                fixed: "right",
                columns: [{
                    Header: "Action",
                    accessor: "name",
                    minWidth: 150,
                    Cell: ({ row }) => {
                        return (
                            <div>
                                <ButtonComponent
                                    text='View'
                                    onClick={(e) => { this.handleClick(row) }}
                                />
                            </div>
                        )
                    }
                }]

            }
        ];

        return columns;
    }

    handleClick(row) {
        this.props.history.push({
            pathname: '/add-user-commercial',
            state: { row }
        });
    }

    setInputValue(property, val) {
        this.setState({
            [property]: val
        })
    }

    componentDidMount() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;

        try {
            fetch(gwUrl + 'collection-service/endpoint/user/get-commercial-all', {
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
                        this.setState({
                            'data': result.response
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
        let tmpData = data;
        let context = this;

        if (this.state.filterValue === undefined || this.state.filterValue === null || this.state.filterValue === '') {

        }

        else if (data === undefined || data === null || data.length === 0) {

        }

        else {
            tmpData = data.filter(function (data1) {
                return data1.commercialPropertyName.includes(context.state.filterValue.toUpperCase());
            });
        }

        let componentDesign =
            <div className="home">
                <div className="row">
                    <div className="col">
                        <p className="page-title">Commercial Management</p>
                    </div>
                </div>

                {(AuthUtil.getRolePresence(["Account Head"]) === true || AuthUtil.getRolePresence(["account_head"]) === true) ?
                    <div className="row bottom-margin-10px">
                        <div className="col-lg-4">
                            <ButtonComponent
                                text='New Commercial Value'
                                onClick={() => this.props.history.push({
                                    pathname: '/add-user-commercial',
                                })}
                            />
                        </div>
                    </div>
                    :
                    <div >
                    </div>
                }

                <div className="row bottom-margin-10px">
                    <div className="col-6">
                        <InputFieldComponent
                            className='form-input'
                            type='text'
                            placeholder='Filter by Property'
                            value={this.state.filterValue ? this.state.filterValue : ''}
                            onChange={(val) => this.setInputValue('filterValue', val)}
                        />
                    </div>
                </div>

                <div className="row">
                    <br></br>
                    <div className="col-lg-12">
                        <ReactTable
                            data={tmpData}
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

            </div>
        return componentDesign;
    }

    render() {

        let componentDesign = this.getComponentDesign()

        return <MainComponent component={componentDesign} />;
    }
}

export default withRouter(ManageWalletComponent);