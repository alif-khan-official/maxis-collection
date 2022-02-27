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
		};
		//		this.putAway = this.putAway.bind(this);
	}

	putAway(walletRow) {
		console.log(walletRow._original.domainId);
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		try {
			fetch(gwUrl + 'collection-service/endpoint/wallet/put-away', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				},
				body: JSON.stringify({
					id: walletRow._original.domainId
				})
			})
				.then(res => res.json())
				.then(json => json.result)
				.then(result => {
					try {
						console.log(result);
						this.setState({ 'data': [] });
						this.componentDidMount();
					} catch (error) {
						console.log(error);
						this.setState({
							'data': []
						});
					}
				})
				;

		}
		catch (e) {
			console.log(e)
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
				Header: 'Wallet ID',
				accessor: 'walletId',
				minWidth: 150,
			}, {
				Header: 'Wallet Name',
				accessor: 'walletName',
				minWidth: 150,
			},
			{
				Header: 'Wallet Account ID',
				accessor: 'walletAccountId',
				minWidth: 300,
			},
			{
				Header: 'Wallet Type',
				accessor: 'walletType',
				minWidth: 200,
			},
			{
				fixed: "right",
				columns: [{
					Header: "Action",
					accessor: "name",
					minWidth: 250,
					Cell: ({ row }) => {
						return (
							<table width="100%">
								<tbody width="100%">
									<tr width="100%">
										<td width="50%">
											<ButtonComponent
												text='View'
												onClick={() => { this.handleClick(row, "VIEW") }}
											/>
										</td>
										<td width="50%">
											<ButtonComponent
												text='Put Away'
												onClick={() => { this.handleClick(row, "PUT_AWAY") }}
											/>
										</td>
									</tr>
								</tbody>
							</table>
						)
					}
				}]

			}
		];

		return columns;
	}

	handleClick(row, clickAction) {

		if (clickAction === undefined || clickAction === "VIEW")
			this.props.history.push({
				pathname: '/add-wallet',
				state: { row }
			});
		else if (clickAction === undefined || clickAction === "PUT_AWAY")
			this.putAway(row);
	}

	setInputValue(property, val) {
		this.setState({
			[property]: val
		})
	}

	componentDidMount() {
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		try {
			fetch(gwUrl + 'collection-service/endpoint/wallet/accountId', {
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
		let tmpData = data;
		let context = this;

		if (this.state.filterValue === undefined || this.state.filterValue === null || this.state.filterValue === '') {

		}

		else if (data === undefined || data === null || data.length === 0) {

		}

		else {
			tmpData = data.filter(function (data1) {
				return data1.walletAccountId.includes(context.state.filterValue);
			});
		}

		let componentDesign =
			<div className="home">
				<div className="row">
					<div className="col">
						<p className="page-title">Wallet Management</p>
					</div>
				</div>

				{(AuthUtil.getRolePresence(["Account Head"]) === true || AuthUtil.getRolePresence(["account_head"]) === true) ?
					<div className="row bottom-margin-10px">
						<div className="col-lg-4">
							<ButtonComponent
								text='Add Wallet'
								onClick={() => this.props.history.push({
									pathname: '/create-wallet',
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
							placeholder='Filter by Wallet Account ID'
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