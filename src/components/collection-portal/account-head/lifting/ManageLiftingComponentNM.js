import React from "react";

import { withRouter } from "react-router-dom";
import ReactTable from "react-table-6";
import ButtonComponent from "../../../widgets/ButtonComponent";
import MainComponent from "../../../../common/MainComponent";
import AuthUtil from "../../../../auth/AuthUtil";
import DatePicker from "react-datepicker";
import { CSVLink } from "react-csv";
import Constant from "../../../../constants/GeneralConstants";
import "../../../../App.css";
import "react-table-6/react-table.css";
import "react-datepicker/dist/react-datepicker.css";
import numeral from "numeral";

class ManageLiftingComponentNM extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fromDate: new Date(),
      toDate: new Date(),
      dataToDownload: [],
      approvedCollectionCount: 0,
      approvedCollectionAmount: 0,
    };

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
    if (
      AuthUtil.getRolePresence(["Maxis-Collection-Nation-Manager"]) === true
    ) {
      for (let j = 0; j < currentRecords.length; j++) {
        console.log("currentRecords[j]");
        console.log(currentRecords[j]);
        let dataArray = [];

        dataArray[0] = currentRecords[j].createDateTime
          .replace("T", " ")
          .substring(0, 10);
        dataArray[1] = currentRecords[j].cashpoint
          ? currentRecords[j].cashpoint.name
          : "";
        dataArray[2] =
          currentRecords[j].cashpoint == null
            ? ""
            : currentRecords[j].cashpoint.teritory
              ? currentRecords[j].cashpoint.teritory.replace("Territory", "")
              : "";
        dataArray[3] = currentRecords[j].currency;
        dataArray[4] = currentRecords[j].amount;

        dataToDownload[j + 1] = dataArray;
      }
    } else {
      for (let j = 0; j < currentRecords.length; j++) {
        console.log("currentRecords[j]");
        console.log(currentRecords[j]);
        let dataArray = [];

        dataArray[0] = currentRecords[j].createDateTime
          .replace("T", " ")
          .substring(0, 19);
        dataArray[1] = currentRecords[j].cashpointId;
        dataArray[2] = currentRecords[j].cashpoint
          ? currentRecords[j].cashpoint.name
          : "";
        dataArray[3] = currentRecords[j].wallet
          ? currentRecords[j].wallet.walletId
          : "";
        dataArray[4] =
          currentRecords[j].cashpoint == null
            ? ""
            : currentRecords[j].cashpoint.teritory
              ? currentRecords[j].cashpoint.teritory.replace("Territory", "")
              : "";
        dataArray[5] = currentRecords[j].currency;
        dataArray[6] = currentRecords[j].amount;
        dataArray[7] = currentRecords[j].approvalDetails
          ? currentRecords[j].approvalDetails.approvalDecision
          : "";

        dataToDownload[j + 1] = dataArray;
      }
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
    let mockData = [
      {
        id: 1,
        name: "Mukit",
        occupation: "SE",
        address: "Dhaka",
      },
    ];
    return mockData;
  }

  getColumns() {
    if (AuthUtil.getRolePresence(["Cashpoint"]) === true) {
      let columns = [
        {
          Header: "Date",
          id: "createDateTime",
          minWidth: 180,
          accessor: (data) => {
            return data.createDateTime
              ? data.createDateTime.replace("T", " ").substring(0, 19)
              : "";
          },
        },
        {
          Header: "Cashpoint ID",
          minWidth: 120,
          accessor: "cashpointId",
        },
        {
          Header: "Name",
          minWidth: 200,
          accessor: "cashpoint.name",
        },
        {
          Header: "Wallet",
          minWidth: 120,
          accessor: "wallet.walletId",
        },
        {
          Header: "Territory",
          id: "cashpoint",
          minWidth: 150,
          accessor: (data) => {
            return data.cashpoint == null
              ? ""
              : data.cashpoint.teritory
                ? data.cashpoint.teritory.replace("Territory", "")
                : "";
          },
        },
        {
          Header: "Currency",
          minWidth: 100,
          accessor: "currency",
        },
        {
          Header: "Amount",
          minWidth: 100,
          accessor: "amount",
          Cell: ({ row }) => {
            return <div align="right">{row.amount}</div>;
          },
        },
        {
          Header: "Status",
          minWidth: 100,
          accessor: "approvalDetails.approvalDecision",
        },
      ];

      return columns;
    }

    if (
      AuthUtil.getRolePresence(["Maxis-Collection-Nation-Manager"]) === true
    ) {
      let columns = [
        {
          Header: "Date",
          id: "createDateTime",
          minWidth: 180,
          accessor: (data) => {
            return data.createDateTime
              ? data.createDateTime.replace("T", " ").substring(0, 10)
              : "";
          },
        },
        {
          Header: "Name",
          minWidth: 200,
          accessor: "cashpoint.name",
        },
        {
          Header: "Teritory",
          id: "cashpoint",
          minWidth: 150,
          accessor: (data) => {
            return data.cashpoint == null
              ? ""
              : data.cashpoint.teritory
                ? data.cashpoint.teritory.replace("Territory", "")
                : "";
          },
        },
        {
          Header: "Currency",
          minWidth: 100,
          accessor: "currency",
        },
        {
          Header: "Amount",
          minWidth: 100,
          accessor: "amount",
          Cell: ({ row }) => {
            return <div align="right">{row.amount}</div>;
          },
        },
      ];

      return columns;
    }

    let columns = [
      {
        Header: "Date",
        id: "createDateTime",
        minWidth: 180,
        accessor: (data) => {
          return data.createDateTime
            ? data.createDateTime.replace("T", " ").substring(0, 19)
            : "";
        },
      },
      {
        Header: "Cashpoint ID",
        minWidth: 120,
        accessor: "cashpointId",
      },
      {
        Header: "Name",
        minWidth: 200,
        accessor: "cashpoint.name",
      },
      {
        Header: "Wallet",
        minWidth: 120,
        accessor: "wallet.walletId",
      },
      {
        Header: "Territory",
        id: "cashpoint",
        minWidth: 150,
        accessor: (data) => {
          return data.cashpoint == null
            ? ""
            : data.cashpoint.teritory
              ? data.cashpoint.teritory.replace("Territory", "")
              : "";
        },
      },
      {
        Header: "Currency",
        minWidth: 100,
        accessor: "currency",
      },
      {
        Header: "Amount",
        minWidth: 100,
        accessor: "amount",
        Cell: ({ row }) => {
          return <div align="right">{row.amount}</div>;
        },
      },
      {
        Header: "Status",
        minWidth: 100,
        accessor: "approvalDetails.approvalDecision",
      },
      {
        Header: "Action",
        accessor: "name",
        minWidth: 400,
        Cell: ({ row }) => {
          if (
            row._original.approvalDetails.approvalDecision === "" ||
            row._original.approvalDetails.approvalDecision === "pending" ||
            row._original.approvalDetails.approvalDecision === "Pending" ||
            row._original.approvalDetails.approvalDecision === "PENDING"
          ) {
            return (
              <table align="center" className="width-100-percent">
                <tbody>
                  <tr>
                    <td className="width-33-percent">
                      <ButtonComponent
                        text=" Reject "
                        onClick={(e) => {
                          this.handleClick(row, "Reject");
                        }}
                      />
                    </td>
                    <td className="width-33-percent">
                      <ButtonComponent
                        text="Approve"
                        onClick={(e) => {
                          this.handleClick(row, "Approve");
                        }}
                      />
                    </td>
                    <td className="width-33-percent">
                      <ButtonComponent
                        text="Approve Only"
                        onClick={(e) => {
                          this.handleClick(row, "ApproveOnly");
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          }
        },
      },
    ];

    return columns;
  }

  handleClick(row, decision) {
    let data = {
      accountUserId: AuthUtil.getUsername(),
      requestId: row._original.domainId,
      decision: decision,
      commentOne: "n",
      commentTwo: "n",
    };
    this.updateApproval(data);
    console.log("decision: ", decision, " Lifting: ", row._original);
  }

  async updateApproval(data) {
    const gwUrl = process.env.REACT_APP_API_GW_HOST;

    let path = gwUrl + "collection-service/endpoint/lifting/decision-update";
    if (data.decision === "ApproveOnly") {
      path = gwUrl + "collection-service/endpoint/lifting/decision-update-only";
      data.decision = "Approve";
    }
    try {
      let res = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: "Bearer " + AuthUtil.getIdToken(),
        },
        body: JSON.stringify({
          accountUserId: data.accountUserId,
          requestId: data.requestId,
          decision: data.decision,
          commentOne: data.commentOne,
          commentTwo: data.commentTwo,
        }),
      });

      let result = await res.json();

      if (result.result.result === "Success") {
        this.componentDidMount();
      }

      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    const gwUrl = process.env.REACT_APP_API_GW_HOST;

    try {
      fetch(gwUrl + "collection-service/endpoint/lifting/accountId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: "Bearer " + AuthUtil.getIdToken(),
        },
        body: JSON.stringify({
          accountId: AuthUtil.getUsername(),
          fromDate: this.state.fromDate,
          toDate: this.state.toDate,
        }),
      })
        .then((res) => res.json())
        .then((json) => json.result)
        .then((result) => {
          try {
            let roleList = AuthUtil.getRoleList();
            let roleId = roleList[0].name;
            if (roleId === Constant.ROLE_NAME_NM) {
              let approveData = result.data;
              approveData = approveData.filter((collection) => {
                try {
                  if (collection.approvalDetails.approvalDecision === "Approve")
                    return true;
                  else return false;
                } catch (e) {
                  return false;
                }
              });
              this.setState({ data: approveData });
              let approveDataAmount = approveData.reduce(function (
                previousValue,
                currentValue
              ) {
                return previousValue + currentValue.amount;
              },
                0);
              this.setState({
                approvedCollectionAmount:
                  numeral(approveDataAmount).format("0,0.00"),
              });
              this.setState({ approvedCollectionCount: approveData.length });
            } else this.setState({ data: result.data });
            this.prepareDownload("componentDidMount");
          } catch (error) {
            console.log(error);
            this.setState({ data: [] });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  downloadData() {
    try {
      this.csvLink.link.click();
    } catch (e) {
      console.log(e);
    }
  }

  getSearchResult() {
    const gwUrl = process.env.REACT_APP_API_GW_HOST;

    try {
      fetch(gwUrl + "collection-service/endpoint/lifting/accountId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: "Bearer " + AuthUtil.getIdToken(),
        },
        body: JSON.stringify({
          accountId: AuthUtil.getUsername(),
          fromDate: this.state.fromDate,
          toDate: this.state.toDate,
        }),
      })
        .then((res) => res.json())
        .then((json) => json.result)
        .then((result) => {
          try {
            let roleList = AuthUtil.getRoleList();
            let roleId = roleList[0].name;
            if (roleId === Constant.ROLE_NAME_NM) {
              let approveData = result.data;
              approveData = approveData.filter((collection) => {
                try {
                  if (collection.approvalDetails.approvalDecision === "Approve")
                    return true;
                  else return false;
                } catch (e) {
                  return false;
                }
              });
              this.setState({ data: approveData });
              let approveDataAmount = approveData.reduce(function (
                previousValue,
                currentValue
              ) {
                return previousValue + currentValue.amount;
              },
                0);
              this.setState({
                approvedCollectionAmount:
                  numeral(approveDataAmount).format("0,0.00"),
              });
              this.setState({ approvedCollectionCount: approveData.length });
            } else this.setState({ data: result.data });
            this.prepareDownload("componentDidMount");
          } catch (error) {
            console.log(error);
            this.setState({ data: [] });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  getComponentDesign() {
    let columns = this.getColumns();
    let data = this.state.data;
    let filterCaseInsensitive = (filter, row, column) => {
      const id = filter.pivotId || filter.id;
      return row[id] !== undefined
        ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        : true;
    };
    let roleList = AuthUtil.getRoleList();
    let roleId = roleList[0].name;

    let componentDesign = (
      <div className="home">
        <div className="row">
          <div className="col">
            <p className="page-title">Lifting Management</p>
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
                filename="lifting.csv"
                className="hidden"
                ref={(r) => this.csvLink = r}
                target="_blank" />
            </div>
          </div>
        </div>

        <br></br>

        {roleId === Constant.ROLE_NAME_NM && (
          <div className="row">
            <div className="col-12">
              <b>Total Amount :</b> &nbsp;{this.state.approvedCollectionAmount}
              <br />
              <b>Total Count :</b> &nbsp;{this.state.approvedCollectionCount}
            </div>
          </div>
        )}

        <div className="row">
          <br></br>
          <div className="col-12">
            <ReactTable
              data={data}
              columns={columns}
              defaultPageSize={5}
              pageSizeOptions={[5, 10, 20]}
              filterable={true}
              defaultFilterMethod={filterCaseInsensitive}
            />
          </div>
          <div className="col-sm-4"></div>
        </div>
      </div>
    );
    return componentDesign;
  }

  render() {
    let componentDesign = this.getComponentDesign();

    return <MainComponent component={componentDesign} />;
  }
}

export default withRouter(ManageLiftingComponentNM);
