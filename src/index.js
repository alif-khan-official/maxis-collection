import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
import React from "react";
import ReactDOM from "react-dom";
import {
	BrowserRouter as Router, Route, Switch
} from "react-router-dom";
import App from "./App";
import UpdatePassword from "./components/password/UpdatePasswordComponent";
import SubmitOTP from "./components/password/OTPSubmitComponent";
import GenerateOTP from "./components/password/OTPGenerateComponent";
import HomeComponent from "./components/collection-portal/home/HomeComponent";
import DetailComponent from "./components/collection-portal/home/DetailPageComponent";
import ManageWallet from "./components/collection-portal/account-head/wallet-management/ManageWalletComponent";
import AddWallet from "./components/collection-portal/account-head/wallet-management/WalletAddComponent";
import CreateWallet from "./components/collection-portal/account-head/wallet-management/WalletCreateComponent";
import WalletOTPResetComponent from "./components/collection-portal/account/wallet-otp-reset/WalletOTPResetComponent";
import DigitalMoneyAcquisition from "./components/collection-portal/account-head/digital-money-acquisition/DigitalMoneyAcquisitionComponent";
import AddDigitalMoneyAcquisitionRequest from "./components/collection-portal/account-head/digital-money-acquisition/DigitalMoneyAcquisitionRequestComponent";
import ManageEncashComponent from "./components/collection-portal/account-head/encashment/ManageEncashComponent";
import ManageCollectionComponent from "./components/collection-portal/account-head/collection/ManageCollectionComponent";
import ManageCollectionComponentNM from "./components/collection-portal/account-head/collection/ManageCollectionComponentNM";
import ManageLiftingComponent from "./components/collection-portal/account-head/lifting/ManageLiftingComponent";
import ManageLiftingComponentNM from "./components/collection-portal/account-head/lifting/ManageLiftingComponentNM";
import MerchantAgentCashoutManagement from "./components/collection-portal/merchant/MerchantAgentCashoutManagement";
import AgentCashoutManagement from "./components/collection-portal/agent/AgentCashoutManagement";
import CashoutAddComponent from "./components/collection-portal/merchant/CashoutAddComponent";
import AHCashoutComponent from "./components/collection-portal/account-head/cashout/AHCashoutComponent";
import CashpointAgentTransferHistory from "./components/collection-portal/cashpoint/CashpointAgentTransferHistory";
import CashpointManagerTransferHistory from "./components/collection-portal/account-head/CashpointManagerTransferHistory";
import AgentCashpointTransferHistory from "./components/collection-portal/agent/CashpointAgentTransferHistory";
import AgentCashpointTransfers from "./components/collection-portal/account-head/CashpointAgentTransferHistory";
import ManageUserCommercial from "./components/collection-portal/account-head/usercommercial/ManageUserCommercial";
import AddUserCommercial from "./components/collection-portal/account-head/usercommercial/UserCommercialAddComponent";
import ManageSendMoneyComponent from "./components/collection-portal/account-head/send-money/ManageSendMoneyComponent";
import SMSComponent from "./components/collection-portal/account-head/notification/Notification";
import TransferHistory from "./components/collection-portal/account-head/transfer/TransferComponent";
import BusinessHouseTopUp from "./components/collection-portal/account-head/BusinessHouseTopUp";

import ApproverMyCash from "./components/collection-portal/account-head/encashment/ApproverMyCash";
import ApproverMyCashHistory from "./components/collection-portal/account-head/encashment/ApproverMyCashHistory";
import UserManagement from "./components/collection-portal/account-head/user/UserManagement";
import UserDetails from "./components/collection-portal/account-head/user/UserDetails";
import AndroiApplicationSubmissionForm from "./components/login/AndroiApplicationSubmissionForm";

import Lab from "./components/Lab";
import "./index.css";
import PrivacyPolicy from "./components/login/privacypolicy";

const routing = (
	<Router>
		<Switch>
			<Route exact path="/" component={App} />
			<Route exact path="/home" component={HomeComponent} />
			<Route exact path="/home/detail" component={DetailComponent} />
			<Route exact path="/manage-wallet" component={ManageWallet} />
			<Route exact path="/add-wallet" component={AddWallet} />
			<Route exact path="/create-wallet" component={CreateWallet} />
			<Route exact path="/reset-wallet-otp" component={WalletOTPResetComponent} />
			<Route exact path="/digital-money-acquire" component={DigitalMoneyAcquisition} />
			<Route exact path="/add-digital-money-acquisition-request" component={AddDigitalMoneyAcquisitionRequest} />
			<Route exact path="/ah-cashout-management" component={AHCashoutComponent} />

			<Route exact path="/androiapplicationsubmissionform" component={AndroiApplicationSubmissionForm} />
			<Route exact path="/notification" component={SMSComponent} />
			<Route exact path="/user-management" component={UserManagement} />
			<Route exact path="/user-detail" component={UserDetails} />

			<Route exact path="/manage-user-commercial" component={ManageUserCommercial} />
			<Route exact path="/add-user-commercial" component={AddUserCommercial} />

			<Route exact path="/manage-encashment" component={ManageEncashComponent} />
			<Route exact path="/manage-encashment-mycash" component={ApproverMyCash} />
			<Route exact path="/manage-encashment-mycash-history" component={ApproverMyCashHistory} />

			<Route exact path="/cp-agent-transfers" component={AgentCashpointTransfers} />
			<Route exact path="/cp-manager-transfers" component={CashpointManagerTransferHistory} />

			<Route exact path="/agent-dse-transfer-management" component={AgentCashpointTransferHistory} />

			<Route exact path="/bh-topup-transfers" component={BusinessHouseTopUp} />
			<Route exact path="/mother-merchant-agent-cashout-management" component={MerchantAgentCashoutManagement} />

			<Route exact path="/cp-agent-transfer-management" component={CashpointAgentTransferHistory} />
			<Route exact path="/add-cashout" component={CashoutAddComponent} />

			<Route exact path="/agent-cashout-management" component={AgentCashoutManagement} />

			<Route exact path="/send-money-history" component={ManageSendMoneyComponent} />

			<Route exact path="/manage-collection" component={ManageCollectionComponent} />
			<Route exact path="/manage-collection-nm" component={ManageCollectionComponentNM} />
			<Route exact path="/manage-lifting-nm" component={ManageLiftingComponentNM} />
			<Route exact path="/manage-lifting" component={ManageLiftingComponent} />

			<Route exact path="/manage-transfer" component={TransferHistory} />

			<Route exact path="/update-password" component={UpdatePassword} />
			<Route exact path="/generate-otp" component={GenerateOTP} />
			<Route exact path="/submit-otp" component={SubmitOTP} />
			<Route exact path="/lab" component={Lab} />

			<Route exact path="/privacy-policy" component={PrivacyPolicy} />
		</Switch>
	</Router>
);
ReactDOM.render(routing, document.getElementById("root"));