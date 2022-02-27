import React from 'react';
import { withRouter } from 'react-router-dom';
import ButtonComponent from '../../../widgets/ButtonComponent'
import MainComponent from '../../../../common/MainComponent'
import '../../../../App.css'
import AuthUtil from '../../../../auth/AuthUtil';
import Constant from '../../../../constants/GeneralConstants';
import Select from 'react-select';

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#17527F' : state.isFocused ? '#E1E9F4' : undefined,
        cursor: 'pointer'
    }),

}

class WalletOTPResetComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedData: {},
            data: []
        }

    }
    /*
        componentDidMount() {
            const gwUrl = process.env.REACT_APP_API_GW_HOST;
    
            try {
                fetch(gwUrl + 'collection-service/endpoint/wallet', {
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
                                // 'data': []
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
    */
    async componentDidMount() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;

        try {
            let response = await fetch(gwUrl + 'collection-service/endpoint/wallet', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken()
                },
            });

            let result = await response.json();

            for (
                let index = 0;
                result.result.data !== undefined &&
                result.result.data !== null &&
                index < result.result.data.length;
                index++
            ) {
                result.result.data[index].label = result.result.data[index].transactionAccountId;
                result.result.data[index].value = result.result.data[index];
            }

            this.setState({ 'data': result.result.data });
        }
        catch (e) {
            console.log(e)
        }
    }

    getComponentDesign() {
        let design =
            <div className="home" style={{ height: "90vh" }}>
                <div className="row">
                    <div className="col">
                        <p className="page-title">Reset Wallet OTP</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3">
                        <b>Choose Wallet</b>
                    </div>
                    <div className="col-md-9">
                        <Select
                            onChange={(e) => {
                                this.setInputValue("selectedData", e.value);
                            }}
                            options={this.state.data}
                            className="dropdown-bottom-margin"
                            styles={customStyles}
                        />
                    </div>
                </div>
                {/*
                <div className="row">
                    <div className="col-md-3"><b>Choose Wallet</b></div>
                    <div className="col-md-9">
                        <select className="form-dropdown-select dropdown-bottom-margin" value={this.value} onChange={(e) => { this.setInputValue('selectedData', e.target.value) }}>
                            <option key={"1"} value={"wallet"}>{"Select Wallet Account Number"}</option>)
                            {this.state.data.map((item) => <option key={item.domainId} value={JSON.stringify(item)}>{item.walletAccountId}</option>)}
                        </select>
                    </div>
                </div>
                */}
                <div className="row">
                    <div className="col-md-12">
                        <ButtonComponent
                            text='Reset'
                            onClick={() => this.save()}
                        />
                    </div>
                </div>

            </div>
        return design;
    }

    setInputValue(property, val) {
        this.setState({
            [property]: val
        })
    }

    async save() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        // let walletInfo = JSON.parse(this.state.selectedData);
        let walletInfo = this.state.selectedData;

        try {
            let res = await fetch(gwUrl + 'collection-service/endpoint/wallet/otp-reset', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken()
                },
                body: JSON.stringify({
                    walletId: walletInfo.walletId,
                    transactionAccountId: walletInfo.transactionAccountId,
                    walletPin: walletInfo.walletPin
                })
            });

            let response = await res.json();
            if (response.result.code === Constant.MW_RESPONSE_SUCCESS_CODE) {
                this.props.history.push({
                    pathname: '/home'
                });
            }

        } catch (e) {
            console.log(e);
        }
        console.log(this.state);
    }

    render() {
        let componentDesign = this.getComponentDesign();
        return <MainComponent component={componentDesign} />;
    }

}

export default withRouter(WalletOTPResetComponent);