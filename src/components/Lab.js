import React from 'react'
import ButtonComponent from './widgets/ButtonComponent'
import AuthUtil from '../auth/AuthUtil';
import Constant from '../constants/GeneralConstants';
import '../App.css'
class LabComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedData: {},
            data: []
        }

    }


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
                            'data': []
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

        let design = <div className="card-form-body">
            <div className="row">
                <div className="col-sm-6">
                    <div className="d-flex justify-content-end"><h3>Wallet Add Form</h3></div>
                </div>
            </div>

            <div className="row">

                <div className="col-sm-6">
                    <div className="d-flex justify-content-start">
                        <div className="form-input-label">Choose Wallet</div>
                        <div className="form-dropdown">
                            <select className="form-dropdown-select" value={this.value} onChange={(e) => { this.setInputValue('selectedData', e.target.value) }}>
                                <option key={"1"} value={"wallet"}>{"Select Wallet Account Number"}</option>)
                                {this.state.data.map((item) => <option key={item.domainId} value={JSON.stringify(item)}>{item.walletAccountId}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end">
                        <ButtonComponent
                            text='Reset'
                            onClick={() => this.save()}
                        />
                    </div>

                </div>
                <div className="col-sm-6">

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
        let walletInfo = JSON.parse(this.state.selectedData);
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
        //return <MainComponent component={componentDesign} />;
        return componentDesign;
    }

}

export default LabComponent;