import React from 'react';

import { withRouter } from 'react-router-dom';
import InputFieldComponent from '../../../widgets/InputFieldComponent'
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import ButtonComponent from '../../../widgets/ButtonComponent';
import MainComponent from '../../../../common/MainComponent'
import AuthUtil from '../../../../auth/AuthUtil';
import '../../../../App.css'

class UserManagement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			filterValue: ''
		};
	}

	putAway(userRow) {
		console.log(userRow._original.domainId);
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		try {
			fetch(gwUrl + 'authorization-service/endpoint/user/put-away', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken()
				},
				body: JSON.stringify({
					id: userRow._original.id
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
				Header: 'User ID',
				accessor: 'userId',
				minWidth: 250,
			},
			{
				Header: 'Name',
				accessor: 'name',
				minWidth: 150,
			},
			{
				Header: 'Phone',
				accessor: 'phoneNumber',
				minWidth: 200,
			},
			{
				Header: 'Role',
				accessor: 'role',
				minWidth: 200,
				Cell: ({ row }) => {
					return (
						<div>
							{row.role === undefined || row.role === null || row.role.length < 1 ? "" : row.role[0].displayName}
						</div>
					)
				}
			},
			{
				Header: 'Email',
				accessor: 'email',
				minWidth: 100,
			},
			{
				Header: 'District',
				accessor: 'district',
				minWidth: 150,
			},
			{
				Header: 'Thana',
				accessor: 'thana',
				minWidth: 200,
			},
			{
				Header: 'Territory',
				accessor: 'teritory',
				width: 200,
				Cell: ({ row }) => {
					return (
						<div>
							{row.teritory === undefined || row.teritory === null ? "" : row.teritory.replace("Territory", "")}
						</div>
					)
				}
			},
			{
				Header: 'Area',
				accessor: 'area',
				minWidth: 200,
				Cell: ({ row }) => {
					return (
						<div>
							{row.area === undefined || row.area === null ? "" : row.area.replace("Area", "")}
						</div>
					)
				}
			},
			{
				Header: 'Region',
				accessor: 'region',
				minWidth: 200,
				Cell: ({ row }) => {
					return (
						<div>
							{row.region === undefined || row.region === null ? "" : row.region.replace("Region", "")}
						</div>
					)
				}
			},
			{
				fixed: "right",
				columns: [{
					Header: "Action",
					accessor: "name",
					minWidth: 250,
					Cell: ({ row }) => {
						return (
							<table className="width-100-percent">
								<tbody>
									<tr>
										<td className="width-50-percent">
											<ButtonComponent
												text='View'
												onClick={() => { this.handleClick(row, "VIEW") }}
											/>
										</td>
										<td className="width-50-percent">
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

	handleClick(row, action) {
		if (action === undefined || action === null || action === "VIEW")
			this.props.history.push({ pathname: '/user-detail', state: { row } });
		else if (action === undefined || action === null || action === "PUT_AWAY")
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
			fetch(gwUrl + 'authorization-service/endpoint/user', {
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
			tmpData = data.filter(
				(data1) => data1.userId.includes(context.state.filterValue)
			);
		}

		let componentDesign =
			<div className="home">
				<div className="row">
					<div className="col">
						<p className="page-title">User Management</p>
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
							placeholder='Filter by User ID'
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
							defaultPageSize={5}
							pageSizeOptions={
								[5, 20, 40]
							}
						/>
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

export default withRouter(UserManagement);