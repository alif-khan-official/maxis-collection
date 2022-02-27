
import React from 'react';
import { withRouter } from 'react-router-dom';
import InputFieldComponent from '../../../widgets/InputFieldComponent'
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

class DigitalMoneyAcquisitionRequestComponent extends React.Component {

    constructor(props) {
        super(props);

        let data = this.props.location.state;

        if (data === undefined) {
            this.state = {
                wallet: '',
                amount: '',
                b64Image: '',
                bankName: '',
                bankBranch: '',
                bankAccountType: '',
                bankAccountName: '',
                bankAccountNumber: '',
                rerenceDetails: '',
                bank: '',
                walletList: [],
                mdWallet: [],
                enable: '',
                pushed: 'no'
            }
        } else {
            this.state = {
                wallet: data.row._original.wallet,
                amount: data.row._original.amount,
                b64Image: data.row._original.b64Image,
                bankName: data.row._original.reference.bankName,
                bankBranch: data.row._original.reference.bankBranch,
                bankAccountType: data.row._original.reference.bankAccountType,
                bankAccountName: data.row._original.reference.bankAccountName,
                bankAccountNumber: data.row._original.reference.bankAccountNumber,
                rerenceDetails: data.row._original.referenceDetails,
                bank: data.row._original.bank,
                walletList: [],
                mdWallet: [],
                enable: 'disable',
                pushed: 'yes'
            }
        }

    }

    getMockData() {
        let mockData = [
            {
                id: 1,
                name: "Choose Option",
                path: "/"
            },
            {
                id: 2,
                name: "CV Bank",
                path: "/cv-bank"
            }

        ];
        return mockData;
    }
    /*
        componentDidMount() {
            const gwUrl = process.env.REACT_APP_API_GW_HOST;
            let tmpWallet = []
            try {
                fetch(gwUrl + 'collection-service/endpoint/wallet', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': 'Bearer ' + AuthUtil.getIdToken()
                    },
                })
                    .then(res => res.json())
                    .then(json => json.result)
                    .then(result => {
                        tmpWallet = result.data.filter(function (d) {
                            return d.walletType === "Master Distributor";
                        });
                        console.log(tmpWallet);
                        this.setState({ 'mdWallet': tmpWallet });
                        this.setState({ 'walletList': result.data });
                    });
    
            }
            catch (e) {
                console.log(e)
            }
        }
        */
    async componentDidMount() {
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        let tmpWallet = []
        try {
            let response = await fetch(gwUrl + 'collection-service/endpoint/wallet', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken()
                },
            });

            let result = await response.json();

            tmpWallet = result.result.data.filter(function (d) {
                return d.walletType === "Master Distributor";
            });

            for (
                let index = 0;
                tmpWallet !== undefined &&
                tmpWallet !== null &&
                index < tmpWallet.length;
                index++
            ) {
                tmpWallet[index].label = tmpWallet[index].walletName;
                tmpWallet[index].value = tmpWallet[index].transactionAccountId;
            }

            console.log(tmpWallet);
            this.setState({ 'mdWallet': tmpWallet });
            this.setState({ 'walletList': result.result.data });
        }
        catch (e) {
            console.log(e)
        }
    }

    setInputValue(property, val) {
        this.setState({
            [property]: val
        })
    }

    async save() {
        this.setState({
            enable: 'disable'
        });
        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            let res = await fetch(gwUrl + 'collection-service/endpoint/digital-money-acquisition', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken()
                },
                body: JSON.stringify({
                    wallet: this.state.wallet,
                    amount: this.state.amount,
                    b64Image: this.state.b64Image,
                    reference: {
                        bankName: this.state.bankName,
                        bankBranch: this.state.bankBranch,
                        bankAccountType: this.state.bankAccountType,
                        bankAccountName: this.state.bankAccountName,
                        bankAccountNumber: this.state.bankAccountNumber,
                        refenceDetails: this.state.rerenceDetails
                    },
                    refenceDetails: this.state.rerenceDetails,
                    bank: this.state.bank

                })
            });

            let response = await res.json();

            this.setState({
                enable: ''
            });

            if (response.result.code === Constant.DMA_RESPONSE_SUCCESS_CODE) {
                this.props.history.push({
                    pathname: '/digital-money-acquire'
                });
            }

        } catch (e) {
            this.setState({
                enable: ''
            });
            console.log(e);
        }
    }

    getComponentDesign() {
        this.state.walletList.filter(function (w) {

            if (w.walletId === "054-2101-000003995" || w.walletId === "3677901027521" || w.walletId === "054-2101-000003995" || w.walletId === "114.120.3432" || w.walletId === "0105702000532" || w.walletId === "Commission" || w.walletId === "111311130973714") {
                return w;
            }

            return null;
        });

        let componentDesign =
            <div className="home" style={{ height: "90vh" }}>
                <div className="row">
                    <div className="col">
                        <p className="page-title">Digital Money Acquisition</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3">
                        <b>Choose Wallet</b>
                    </div>
                    <div className="col-md-9">
                        <Select
                            onChange={(e) => {
                                this.setInputValue("wallet", e.value);
                            }}
                            options={this.state.mdWallet}
                            className="dropdown-bottom-margin"
                            styles={customStyles}
                        />
                    </div>
                </div>
                {/*            
                <div className="row">
                    <div className="col-md-3"><b>Choose Wallet</b></div>
                    <div className="col-md-9">
                        <select
                            className="form-dropdown-select dropdown-bottom-margin"
                            value={this.value}
                            onChange={(e) => {
                                this.setInputValue('wallet', JSON.parse(e.target.value).transactionAccountId);
                                console.log(e.target.value)
                            }}
                        >
                            <option value="#">Choose Wallet</option>
                            {this.state.mdWallet.map((item) => <option key={item.domainId} value={JSON.stringify(item)}>{item.walletName}</option>)}
                        </select>
                    </div>
                </div>
                */}
                <div className="row">
                    <div className="col-md-3"><b>Amount</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type='number'
                            placeholder="Enter Amount"
                            value={this.state.amount ? this.state.amount : ''}
                            onChange={(val) => this.setInputValue('amount', val)}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3"><b>Reference Details</b></div>
                    <div className="col-md-9">
                        <InputFieldComponent
                            className="form-input"
                            type='text'
                            placeholder="Enter Reference Details"
                            value={this.state.rerenceDetails ? this.state.rerenceDetails : ''}
                            onChange={(val) => this.setInputValue('rerenceDetails', val)}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <ButtonComponent
                            text='Save'
                            disabled={this.state.enable}
                            onClick={() => this.save()}
                        />
                    </div>
                </div>
            </div>
        return componentDesign;
    }

    render() {
        let componentDesign = this.getComponentDesign();
        return <MainComponent component={componentDesign} />;
    }

}

export default withRouter(DigitalMoneyAcquisitionRequestComponent);