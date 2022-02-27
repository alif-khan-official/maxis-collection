import React from "react";
import { withRouter } from "react-router-dom";
import MainComponent from "../../../common/MainComponent";
import InputFieldComponent from "../../widgets/InputFieldComponent";
import ButtonComponent from "../../widgets/ButtonComponent";
import "../../../App.css";
import AuthUtil from "../../../auth/AuthUtil";
import { Fieldset } from "primereact/fieldset";
import "react-dropdown/style.css";
import classNames from "classnames";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Alert from "simple-react-alert"; // Import
import { openAlert } from "simple-react-alert"; // Import
import Select from 'react-select';

const customStyles = {
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isSelected ? '#17527F' : state.isFocused ? '#E1E9F4' : undefined,
		cursor: 'pointer'
	}),

}

class HomeComponent extends React.Component {
	constructor(props) {
		super(props);
		this.fieldSetLegendClassName = classNames("maxisFieldset1 maxisFieldset2");
		this.depositBanks = [];
		this.depositBanksDropdown = [];
		this.transferWallets = [];
		this.transferWalletsDropdown = [];
		this.motherMerchants = [];
		this.motherMerchantsDropdown = [];
		this.localMerchants = [];
		this.localMerchantsDropdown = [];
		this.collectionTypes = [];
		this.collectionTypesDropdown = [];
		this.motherBusinessHouseDropdown = [];
		this.walletTypes = [
			{ label: "MyCash", value: "MyCash" },
			{ label: "Ok", value: "Ok" },
			{ label: "General", value: "General" },
		];
		this.agents = [];
		this.agentDropdown = [];

		this.currentLocalMerchantsDropdown = [];

		this.sendMoney = this.sendMoney.bind(this);
		this.collect = this.collect.bind(this);
		this.agenttoCPSell = this.agenttoCPSell.bind(this);
		this.agentSell = this.agentSell.bind(this);
		this.transfer = this.transfer.bind(this);
		this.deposit = this.deposit.bind(this);
		this.prepareHomePage = this.prepareHomePage.bind(this);
		this.getCurrencies = this.getCurrencies.bind(this);
		this.getMaxisManagers = this.getMaxisManagers.bind(this);
		this.maxisManagerTopup = this.maxisManagerTopup.bind(this);
		this.getMotherMerchants = this.getMotherMerchants.bind(this);
		this.getBusinessHouse = this.getBusinessHouse.bind(this);
		this.maxisBusinessHouseTopup = this.maxisBusinessHouseTopup.bind(this);
		this.showLoadingText = this.showLoadingText.bind(this);
		this.merchantPullOTPRequest = this.merchantPullOTPRequest.bind(this);
		this.merchantPullOTPSubmit = this.merchantPullOTPSubmit.bind(this);

		this.disableMerchantPullOTPSubmitButton = true;
		this.disableMerchantPullOTPRequestButton = false;

		this.state = {
			managerDropDown: [],
			pageLoading: true,
			maxisManagers: [],

			deposit: {
				amount: 0,
				currencyType: "MFS",
				currency: "",
				cashpointId: "",
				bankDetails: {
					domainId: "",
					walletId: "",
					walletName: "",
					walletAccountId: "",
					ownerId: "",
					walletPin: "",
					walletOTP: "",
					balance: 0,
					transactionAccountId: "",
					walletType: "",
					status: "",
				},
				depositeSlipImage: "",
				reference: "",
				comments: "",
				approvalDetails: {
					approvalDecision: "",
					decisionTime: null,
					approvalTransactionId: "",
					liftingAccountId: "",
					liftingWalletId: "",
				},
			},
			transfer: {
				transferAmount: 0,
				walletPin: "",
				transferWalletId: "",
				userId: "",
				transferType: "",
			},
			collection: {
				cashPointId: AuthUtil.getUsername(),
				merchantId: "",
				payeeId: "",
				amount: "",
				collectionType: "",
				currency: "",
				collectionPin: "",
				payeePin: "",
				invoiceNo: "",
				reference1: "",
				reference2: "",
				reference3: "",
				document: "n/a",
				decision: "pending",
				transactionEngineId: "",
				transactionEngineReply: "",
			},
			agent: {
				amount: 0,
				pin: "",
				agentId: "",
			},
			cp: {
				amount: 0,
				pin: "",
				agentId: AuthUtil.getUsername(),
			},
			sendmoney: {
				amount: 0,
				pin: "",
				merchantId: "",
				payeeId: AuthUtil.getUsername(),
				comment: "",
			},
			topupbh: {
				bhId: "",
				transferAmount: 0.0,
			},
			maxisManager: {
				toUserId: "",
				transferAmount: 0.0,
				transferType: "TRANSFER_TYPE_GENERAL_DISTRIBUTOR_GENERAL_MANAGER",
				userId: AuthUtil.getUsername(),
			},
			merchantPull: {
				"merchantId": AuthUtil.getUsername(),
				"payeeId": "",
				"currency": "",
				"transferAmount": "",
				"merchantPullOTP": "",
				"comment":"",
				"responseRequest": {"result": {"data": {"id": ""}}}
			},
			merchantPayeeDropDown: [],
			disableMerchantPullOTPRequestButton: false,
			disableMerchantPullOTPSubmitButton: true,

			disableTransferButton: false,
			disableDepositButton: false,
			disableCollectButton: false,
			disableAgentButton: false,
			disableSelltoCPButton: false,
			disableSendMoneyButton: false,
			disableMaxisManagerTopupButton: false,

			agentDropDown: [],

			count: 0,
			total: 0
		};
	}

	async prepareHomePage() {

		if (this.depositBanks.length > 0) return;
		const gwUrl = process.env.REACT_APP_API_GW_HOST;

		if (
			AuthUtil.getRolePresence(["Cashpoint"]) === true ||
			AuthUtil.getRolePresence(["Payee"]) === true ||
			AuthUtil.getRolePresence(["Maxis-Collection-Territory-Manager"]) ===
			true ||
			AuthUtil.getRolePresence(["Maxis-Collection-Area-Manager"]) === true ||
			AuthUtil.getRolePresence(["Maxis-Collection-Nation-Manager"]) === true
		) {
			// getMotherMerchants
			this.setState({ count: 1 });

			let motherMerchantListRequest = await fetch(
				gwUrl + "authorization-service/endpoint/user/merchant",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: "Bearer " + AuthUtil.getIdToken(),
					},
					body: '{"accountId": "' + AuthUtil.getUsername() + '"}',
				}
			);
			let responseMotherMerchantList = await motherMerchantListRequest.json();
			console.log("responseMotherMerchantList");
			console.log(responseMotherMerchantList);
			let motherMerchantList = responseMotherMerchantList.result.response[0];

			let motherMerchants = [];
			for (
				let index = 0;
				motherMerchantList !== undefined &&
				motherMerchantList !== null &&
				index < motherMerchantList.length;
				index++
			) {
				let ele = motherMerchantList[index];

				let motherMerchant = {
					label: ele.name + " (" + ele.userId + ")",
					value: ele.userId,
				};

				motherMerchants.push(motherMerchant);
			}

			this.motherMerchants = motherMerchantList;
			this.motherMerchantsDropdown = motherMerchants;
		}
		if (AuthUtil.getRolePresence(["Merchant"]) === true) {
			// getLocalMerchants
			this.setState({ count: 1 });

			let localMerchantListRequest = await fetch(
				gwUrl + "authorization-service/endpoint/user/payee",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: "Bearer " + AuthUtil.getIdToken(),
					},
					body: '{"accountId": "' + AuthUtil.getUsername() + '"}',
				}
			);
			let responseLocalMerchantList = await localMerchantListRequest.json();
			console.log("responseLocalMerchantList");
			console.log(responseLocalMerchantList);
			let localMerchantList = responseLocalMerchantList.result.response[0];

			let localMerchants = [];
			for (
				let index = 0;
				localMerchantList !== undefined &&
				localMerchantList !== null &&
				index < localMerchantList.length;
				index++
			) {
				let ele = localMerchantList[index];

				let localMerchant = {
					label: ele.name + " (" + ele.userId + ")",
					value: ele.userId,
				};

				localMerchants.push(localMerchant);
			}

			this.localMerchants = localMerchantList;
			this.localMerchantsDropdown = localMerchants;
			this.currenctLocalMerchantsDropdown = [];
			let clmd = [];
			for (
					let index = 0;
					index < this.localMerchantsDropdown.length;
					index++
				) {
					let lm = this.localMerchants[index];
					for (
						let lmIndex = 0;
						lmIndex < lm.taggedMerchantIds.length;
						lmIndex++
					) {
						if (lm.taggedMerchantIds[lmIndex].merchantId === AuthUtil.getUsername()) {
							clmd.push(this.localMerchantsDropdown[index]);
							break;
						}
					}
				}
			this.setInputValue("merchantPayeeDropDown", undefined, clmd);
		}
		if (AuthUtil.getRolePresence(["Cashpoint"]) === true) {
			// getDepositBanks
			this.setState({ count: 2 });

			let banksListRequest = await fetch(
				gwUrl + "collection-service/endpoint/wallet/banks",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						token: "Bearer " + AuthUtil.getIdToken(),
					},
				}
			);

			let responseBankList = await banksListRequest.json();
			console.log("responseBankList");
			console.log(responseBankList);
			let bankList = responseBankList.result.data;

			let banks = [];
			for (
				let index = 0;
				bankList !== undefined && bankList !== null && index < bankList.length;
				index++
			) {
				let ele = bankList[index];

				let bank = {
					label:
						ele.walletId +
						" (" +
						ele.walletAccountId
							.replace("COLLECTION_Maxis_", "")
							.replace(ele.walletId, "")
							.replace("_", " ")
							.replace("_", " ") +
						")",
					value: index,
				};

				banks.push(bank);
			}

			this.depositBanks = bankList;
			this.depositBanksDropdown = banks;

			// getTransferWallets
			this.setState({ count: 3 });

			let walletsListRequest = await fetch(
				gwUrl + "collection-service/endpoint/wallet/accountId",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: "Bearer " + AuthUtil.getIdToken(),
					},
					body: '{"accountId": "' + AuthUtil.getUsername() + '"}',
				}
			);
			let responseWalletList = await walletsListRequest.json();
			console.log("responseWalletList");
			console.log(responseWalletList);
			let walletListPrimary = responseWalletList.result.data;
			let walletList = [];

			let wallets = [];
			for (
				let index = 0;
				walletListPrimary !== undefined &&
				walletListPrimary !== null &&
				index < walletListPrimary.length;
				index++
			) {
				let ele = walletListPrimary[index];

				let wallet = { label: ele.walletId, value: ele.walletId };

				if (ele.walletType === "DSE") {
					walletList.push(ele);
					wallets.push(wallet);
				}
			}

			let optionMyCashDistributorDSE =
				'{"label": "From MyCash Distributor [MYCASH_WALLET_DISTRIBUTOR] --> To MyCash DSE [MYCASH_WALLET_DSE]", "value": "TRANSFER_TYPE_MYCASH_DISTRIBUTOR_DSE"}';
			let optionMyCashDSEDistributor =
				'{"label": "From MyCash DSE [MYCASH_WALLET_DSE] --> To MyCash Distributor [MYCASH_WALLET_DISTRIBUTOR]", "value": "TRANSFER_TYPE_MYCASH_DSE_DISTRIBUTOR"}';
			let optionGeneralMyCashDistributor =
				'{"label": "From Lifting Balance --> To MyCash Distributor [MYCASH_WALLET_DISTRIBUTOR]", "value": "TRANSFER_TYPE_GENERAL_MYCASH_DISTRIBUTOR"}';
			let optionMyCashDistributorGeneral =
				'{"label": "From MyCash Distributor [MYCASH_WALLET_DISTRIBUTOR] --> To Lifting Balance", "value": "TRANSFER_TYPE_MYCASH_DISTRIBUTOR_GENERAL"}';

			this.transferTypeCurrent = [];

			for (
				let index = 0;
				walletListPrimary !== undefined &&
				walletListPrimary !== null &&
				index < walletListPrimary.length;
				index++
			) {
				let ele = walletListPrimary[index];
				if (
					ele.walletType !== null &&
					ele.walletType.toUpperCase() === "DSE" &&
					ele.walletName.toUpperCase() === "MYCASH"
				) {
					optionMyCashDistributorDSE = optionMyCashDistributorDSE.replace(
						"MYCASH_WALLET_DSE",
						ele.walletId
					);
					optionMyCashDSEDistributor = optionMyCashDSEDistributor.replace(
						"MYCASH_WALLET_DSE",
						ele.walletId
					);
				} else if (
					ele.walletType !== null &&
					ele.walletType.toUpperCase() === "DISTRIBUTOR" &&
					ele.walletName.toUpperCase() === "MYCASH"
				) {
					optionMyCashDistributorDSE = optionMyCashDistributorDSE.replace(
						"MYCASH_WALLET_DISTRIBUTOR",
						ele.walletId
					);
					optionMyCashDSEDistributor = optionMyCashDSEDistributor.replace(
						"MYCASH_WALLET_DISTRIBUTOR",
						ele.walletId
					);
					optionGeneralMyCashDistributor =
						optionGeneralMyCashDistributor.replace(
							"MYCASH_WALLET_DISTRIBUTOR",
							ele.walletId
						);
					optionMyCashDistributorGeneral =
						optionMyCashDistributorGeneral.replace(
							"MYCASH_WALLET_DISTRIBUTOR",
							ele.walletId
						);
				}
			}
			this.transferTypeCurrent.push(JSON.parse(optionMyCashDistributorDSE));
			this.transferTypeCurrent.push(JSON.parse(optionMyCashDSEDistributor));
			this.transferTypeCurrent.push(JSON.parse(optionGeneralMyCashDistributor));
			this.transferTypeCurrent.push(JSON.parse(optionMyCashDistributorGeneral));

			console.log("walletList");
			console.log(walletList);
			console.log("wallets");
			console.log(wallets);

			this.transferWallets = walletList;
			this.transferWalletsDropdown = wallets;

			// getCollectionTypes
			this.setState({ count: 4 });

			let collectionTypesListRequest = await fetch(
				gwUrl + "collection-service/endpoint/collection/type",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						token: "Bearer " + AuthUtil.getIdToken(),
					},
				}
			);
			let responseCollectionTypeList = await collectionTypesListRequest.json();
			console.log("responseCollectionTypeList");
			console.log(responseCollectionTypeList);
			let collectionTypeList = responseCollectionTypeList.result.data;

			let collectionTypes = [];
			let collectionTypesUsable = [];
			for (
				let index = 0;
				collectionTypeList !== undefined &&
				collectionTypeList !== null &&
				index < collectionTypeList.length;
				index++
			) {
				let ele = collectionTypeList[index];
				if (
					ele.collectionType !== undefined &&
					ele.collectionType !== "" &&
					ele.collectionType != null
				) {
					let collectionType = {
						label: ele.collectionType,
						value: ele.id,
					};
					collectionTypesUsable.push(ele);
					collectionTypes.push(collectionType);
				}
			}

			this.collectionTypes = collectionTypesUsable;
			this.collectionTypesDropdown = collectionTypes;

			// getLocalMerchants
			this.setState({ count: 5 });

			let localMerchantListRequest = await fetch(
				gwUrl + "authorization-service/endpoint/user/payee",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: "Bearer " + AuthUtil.getIdToken(),
					},
					body: '{"accountId": "' + AuthUtil.getUsername() + '"}',
				}
			);
			let responseLocalMerchantList = await localMerchantListRequest.json();
			console.log("responseLocalMerchantList");
			console.log(responseLocalMerchantList);
			let localMerchantList = responseLocalMerchantList.result.response[0];

			let localMerchants = [];
			for (
				let index = 0;
				localMerchantList !== undefined &&
				localMerchantList !== null &&
				index < localMerchantList.length;
				index++
			) {
				let ele = localMerchantList[index];

				let localMerchant = {
					label: ele.name + " (" + ele.userId + ")",
					value: ele.userId,
				};

				localMerchants.push(localMerchant);
			}

			this.localMerchants = localMerchantList;
			this.localMerchantsDropdown = localMerchants;
			this.currenctLocalMerchantsDropdown = [];

			// getAgents
			this.setState({ count: 6 });

			let agentAccountIdJSON = { accountId: AuthUtil.getUsername() };
			let agentListRequest = await fetch(
				gwUrl + "collection-service/endpoint/user/cpagents",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: "Bearer " + AuthUtil.getIdToken(),
					},
					body: JSON.stringify(agentAccountIdJSON),
				}
			);
			let responseAgentList = await agentListRequest.json();
			console.log("responseAgentList");
			console.log(responseAgentList);
			let agentListPrimary =
				responseAgentList && responseAgentList.result
					? responseAgentList.result.response
					: [];
			let agentList = [];
			let agents = [];

			for (
				let index = 0;
				agentListPrimary !== undefined &&
				agentListPrimary !== null &&
				index < agentListPrimary.length;
				index++
			) {
				let ele = agentListPrimary[index];
				let agentDisplayName = ele.user.name + " (" + ele.wallet.walletId + ")";

				let agent = { label: agentDisplayName, value: ele.user.userId };

				agentList.push(agent);
				agents.push(agent);
			}

			console.log("agentList");
			console.log(agentList);
			console.log("agents");
			console.log(agents);

			this.agents = agentList;
			this.agentDropdown = agents;

			this.setState({ agentDropDown: agents });

			// get maxis managers
			this.setState({ count: 7 });

			let managerListRequest = await fetch(
				gwUrl + "authorization-service/endpoint/user/get-all-managers",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						token: "Bearer " + AuthUtil.getIdToken(),
					},
				}
			);
			let responseManagerList = await managerListRequest.json();
			console.log("responseManagerList");
			console.log(responseManagerList);
			let managerListPrimary =
				responseManagerList && responseManagerList.result
					? responseManagerList.result.response
					: [];
			let managerList = [];

			let managers = [];
			for (
				let index = 0;
				managerListPrimary !== undefined &&
				managerListPrimary !== null &&
				index < managerListPrimary.length;
				index++
			) {
				let ele = managerListPrimary[index];

				if (ele === null) continue;
				let manager = { label: ele.name, value: ele.userId };

				managerList.push(manager);
				managers.push(manager);
			}

			console.log("managerList");
			console.log(managerList);
			console.log("managers");
			console.log(managers);

			this.managers = managerList;
			this.managerDropdown = managers;

			this.setState({ managerDropdown: managers });
		}

		this.setState({ pageLoading: false });
	}

	getCurrencies() {
		var options = [
			{ name: "MyCash", code: "MyCash", label: "MyCash", value: "MyCash" },
			{ name: "OK Wallet", code: "OK", label: "OK Wallet", value: "OK" },
			{ name: "General", code: "General", label: "General", value: "General" },
		];
		console.log(options);
		return options;
	}

	getDepositBanks() {
		console.log(this.depositBanksDropdown);
		return this.depositBanksDropdown;
	}

	getAgents() {
		console.log("this.state.agentDropDown");
		console.log(this.state.agentDropDown);
		return this.state.agentDropDown;
	}

	getTransferWallets() {
		console.log(this.transferWalletsDropdown);
		return this.transferWalletsDropdown;
	}

	getTransferTypes() {
		console.log(this.transferWalletsDropdown);
		return this.transferWalletsDropdown;
	}

	getWalletTypes() {
		console.log(this.walletTypes);
		return this.walletTypes;
	}

	getMotherMerchants() {
		console.log(this.motherMerchantsDropdown);
		return this.motherMerchantsDropdown;
	}

	getBusinessHouse() {
		console.log(this.motherMerchantsDropdown);
		return this.motherBusinessHouseDropdown;
	}

	getCollectiontypes() {
		console.log(this.collectionTypesDropdown);
		return this.collectionTypesDropdown;
	}

	getLocalMerchants() {
		console.log("this.currentLocalMerchantsDropdown");
		console.log(this.currentLocalMerchantsDropdown);
		return this.currentLocalMerchantsDropdown;
	}

	getMaxisManagers() {
		console.log("this.currentLocalMerchantsDropdown");
		console.log(this.currentLocalMerchantsDropdown);
		return this.state.maxisManagers;
	}

	getRiders() {
		console.log("this.currentLocalMerchantsDropdown");
		console.log(this.currentLocalMerchantsDropdown);
		return this.currentRidersDropdown;
	}

	setInputValue(property1, property2, val) {
		let setValue = val;

		if (property2) {
			let p1 = this.state[property1];

			if (
				(property1 === "collection" && property2 === "amount") ||
				(property1 === "merchantPull" && property2 === "transferAmount") ||
				(property1 === "deposit" && property2 === "amount") ||
				(property1 === "transfer" && property2 === "transferAmount") ||
				(property1 === "transfer" && property2 === "walletPin") ||
				(property1 === "agent" && property2 === "pin") ||
				(property1 === "cp" && property2 === "amount")
			) {
				if (isNaN(val)) return;
			} else if (property1 === "deposit" && property2 === "bankDetails") {
				setValue = this.depositBanks[val];
			} else if (property1 === "collection" && property2 === "merchantId") {
				let clmd = [];

				for (
					let index = 0;
					index < this.localMerchantsDropdown.length;
					index++
				) {
					let lm = this.localMerchants[index];
					for (
						let lmIndex = 0;
						lmIndex < lm.taggedMerchantIds.length;
						lmIndex++
					) {
						if (lm.taggedMerchantIds[lmIndex].merchantId === setValue) {
							clmd.push(this.localMerchantsDropdown[index]);
							break;
						}
					}
				}
				this.currentLocalMerchantsDropdown = clmd;
				console.log(this.currentLocalMerchantsDropdown);
				p1.payeeId = "";
			}

			p1[property2] = setValue;
			this.setState({ [property1]: p1 });
		} else 
		{
			this.setState({ [property1]: setValue });
		}
	}

	async deposit() {
		if (
			this.state.deposit.amount < 1 ||
			this.state.deposit.currency === "" ||
			this.state.deposit.bankDetails.domainId === undefined
		) {
			console.log("this.state not submittable");
			this.setState({ disableDepositButton: false });
			return;
		}

		if (this.state.disableDepositButton) {
			console.log("this.state disabled");
			return;
		}

		let depositRequest = this.state.deposit;
		depositRequest.cashpointId = AuthUtil.getUsername();

		console.log("this.state submittable");
		console.log(depositRequest);
		let res = await fetch(
			process.env.REACT_APP_API_GW_HOST + "collection-service/endpoint/lifting",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: "Bearer " + AuthUtil.getIdToken(),
				},
				body: JSON.stringify(depositRequest),
			}
		);

		let response = await res.json();
		console.log(response);
		this.setState({ disableDepositButton: false });

		let messagetype = "warning";
		let message = "Please check manually";
		if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("fail")
		) {
			messagetype = "danger";
			message = response.result.message;
		} else if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("success")
		) {
			messagetype = "success";
			message = response.result.message;
		} else if (response.result === undefined) {
			messagetype = "danger";
			message = response.message;
		}
		openAlert({ message: message, type: messagetype, duration: "2500" });
	}

	async maxisBusinessHouseTopup() {
		console.log("inside collect");
		console.log(this.state.collection);

		if (
			this.state.collection.amount === undefined ||
			this.state.collection.amount === "" ||
			this.state.collection.cashPointId === undefined ||
			this.state.collection.cashPointId === "" ||
			this.state.collection.merchantId === undefined ||
			this.state.collection.merchantId === ""
		) {
			console.log("this.state not submittable");
			this.setState({ disableCollectButton: false });
			return;
		}

		if (this.state.disableCollectButton) {
			console.log("this.state disabled");
			return;
		}
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		let collectionRequest = await fetch(
			gwUrl + "collection-service/endpoint/wallet/topupbh",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: "Bearer " + AuthUtil.getIdToken(),
				},
				body: JSON.stringify({
					userId: this.state.collection.cashPointId,
					toUserId: this.state.collection.merchantId,
					transferAmount: this.state.collection.amount,
				}),
			}
		);
		let response = await collectionRequest.json();
		console.log("collection response");
		console.log(response);
		this.setState({ disableCollectButton: false });
		let messagetype = "warning";
		let message = "Please check manually";
		if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("fail")
		) {
			messagetype = "danger";
			message = response.result.message;
		} else if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("success")
		) {
			messagetype = "success";
			message = response.result.message;
		} else if (
			response.code === 201 ||
			response.message === "201" ||
			response.message === "Success"
		) {
			messagetype = "success";
			message = "Success";
		} else if (response.result === undefined) {
			messagetype = "danger";
			message = response.message;
		}
		openAlert({ message: message, type: messagetype, duration: "2500" });
	}

	async transfer() {
		if (
			this.state.transfer.transferAmount < 1 ||
			this.state.transfer.walletPin === "" ||
			this.state.transfer.transferType === ""
		) {
			console.log("this.transfer not submittable");
			this.setState({ disableTransferButton: false });
			return;
		}

		if (this.state.disableTransferButton) {
			console.log("this.state disabled");
			return;
		}

		let transferRequest = this.state.transfer;
		transferRequest.userId = AuthUtil.getUsername();
		transferRequest.transferType = this.state.transfer.transferType;

		console.log("this.transfer submittable");
		console.log(transferRequest);
		let res = await fetch(
			process.env.REACT_APP_API_GW_HOST +
			"collection-service/endpoint/wallet/transfer-by-type",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: "Bearer " + AuthUtil.getIdToken(),
				},
				body: JSON.stringify(transferRequest),
			}
		);

		let response = await res.json();
		console.log(response);

		this.setState({ disableTransferButton: false });
		let messagetype = "warning";
		let message = "Please check manually";
		if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("fail")
		) {
			messagetype = "danger";
			message = response.result.message;
		} else if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("success")
		) {
			messagetype = "success";
			message = response.result.message;
		} else if (response.result === undefined) {
			messagetype = "danger";
			message = response.message;
		}
		openAlert({ message: message, type: messagetype, duration: "2500" });
	}

	async agentSell() {
		if (
			this.state.agent.amount < 1 ||
			this.state.agent.pin === "" ||
			this.state.agent.agentId === ""
		) {
			console.log("this.agentSell not submittable");
			this.setState({ disableAgentButton: false });
			return;
		}

		if (this.state.disableAgentButton) {
			console.log("this.state disabled");
			return;
		}

		let agentRequest = {};
		agentRequest.cashpointId = AuthUtil.getUsername();
		agentRequest.transferAmount = this.state.agent.amount;
		agentRequest.walletPin = this.state.agent.pin;
		agentRequest.agentId = this.state.agent.agentId;

		console.log("this.transfer submittable");
		console.log(agentRequest);
		let res = await fetch(
			process.env.REACT_APP_API_GW_HOST +
			"collection-service/endpoint/wallet/transfer/dse-agent",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: "Bearer " + AuthUtil.getIdToken(),
				},
				body: JSON.stringify(agentRequest),
			}
		);

		let response = await res.json();
		console.log(response);

		this.setState({ disableAgentButton: false });
		let messagetype = "warning";
		let message = "Please check manually";
		if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("fail")
		) {
			messagetype = "danger";
			message = response.result.message;
		} else if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("success")
		) {
			messagetype = "success";
			message = response.result.message;
		} else if (response.result === undefined) {
			messagetype = "danger";
			message = response.message;
		}
		openAlert({ message: message, type: messagetype, duration: "2500" });
	}

	async agenttoCPSell() {
		if (
			this.state.cp.amount < 1 ||
			this.state.cp.pin === "" ||
			this.state.cp.agentId === ""
		) {
			console.log("this.agentSell not submittable");
			this.setState({ disableSelltoCPButton: false });
			return;
		}

		if (this.state.disableSelltoCPButton) {
			console.log("this.state disabled");
			return;
		}

		let agentRequest = {};
		agentRequest.transferAmount = this.state.cp.amount;
		agentRequest.walletPin = this.state.cp.pin;
		agentRequest.agentId = this.state.cp.agentId;

		console.log("this.transfer submittable");
		console.log(agentRequest);
		let res = await fetch(
			process.env.REACT_APP_API_GW_HOST +
			"collection-service/endpoint/wallet/transfer/agent-dse",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: "Bearer " + AuthUtil.getIdToken(),
				},
				body: JSON.stringify(agentRequest),
			}
		);

		let response = await res.json();
		console.log(response);

		this.setState({ disableSelltoCPButton: false });
		let messagetype = "warning";
		let message = "Please check manually";
		if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("fail")
		) {
			messagetype = "danger";
			message = response.result.message;
		} else if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("success")
		) {
			messagetype = "success";
			message = response.result.message;
		} else if (response.result === undefined) {
			messagetype = "danger";
			message = response.message;
		}
		openAlert({ message: message, type: messagetype, duration: "2500" });
	}

	async maxisManagerTopup() {
		console.log("inside maxisManagerTopup");
		console.log(this.state.collection);

		if (
			this.state.maxisManager.transferAmount === undefined ||
			this.state.maxisManager.transferAmount === "" ||
			this.state.maxisManager.toUserId === undefined ||
			this.state.maxisManager.toUserId === ""
		) {
			console.log("this.state not submittable");
			this.setState({ disableMaxisManagerTopupButton: false });
			return;
		}

		if (this.state.disableMaxisManagerTopupButton) {
			console.log("this.state disabled");
			return;
		}
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		let collectionRequest = await fetch(
			gwUrl + "collection-service/endpoint/wallet/transfer-by-type",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: "Bearer " + AuthUtil.getIdToken(),
				},
				body: JSON.stringify(this.state.maxisManager),
			}
		);
		let response = await collectionRequest.json();
		console.log("collection response");
		console.log(response);
		this.setState({ disableMaxisManagerTopupButton: false });
		let messagetype = "warning";
		let message = "Please check manually";
		if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("fail")
		) {
			messagetype = "danger";
			message = response.result.message;
		} else if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("success")
		) {
			messagetype = "success";
			message = response.result.message;
		} else if (response.result === undefined) {
			messagetype = "danger";
			message = response.message;
		}
		openAlert({ message: message, type: messagetype, duration: "2500" });
	}

	async collect() {
		console.log("inside collect");
		console.log(this.state.collection);

		if (
			this.state.collection.amount === undefined ||
			this.state.collection.amount === "" ||
			this.state.collection.currency === undefined ||
			this.state.collection.currency === "" ||
			this.state.collection.collectionType === undefined ||
			this.state.collection.collectionType === "" ||
			this.state.collection.payeeId === undefined ||
			this.state.collection.payeeId === "" ||
			this.state.collection.cashPointId === undefined ||
			this.state.collection.cashPointId === "" ||
			this.state.collection.merchantId === undefined ||
			this.state.collection.merchantId === "" ||
			this.state.collection.amount < 10
		) {
			console.log("this.state not submittable");
			this.setState({ disableCollectButton: false });
			return;
		}

		if (this.state.disableCollectButton) {
			console.log("this.state disabled");
			return;
		}
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		let collectionRequest = await fetch(
			gwUrl + "collection-service/endpoint/collection",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: "Bearer " + AuthUtil.getIdToken(),
				},
				body: JSON.stringify(this.state.collection),
			}
		);
		let response = await collectionRequest.json();
		console.log("collection response");
		console.log(response);
		this.setState({ disableCollectButton: false });
		let messagetype = "warning";
		let message = "Please check manually";
		if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("fail")
		) {
			messagetype = "danger";
			message = response.result.message;
		} else if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("success")
		) {
			messagetype = "success";
			message = response.result.message;
		} else if (response.result === undefined) {
			messagetype = "danger";
			message = response.message;
		}
		openAlert({ message: message, type: messagetype, duration: "2500" });
	}

	async sendMoney() {
		if (
			this.state.sendmoney.amount < 1 ||
			this.state.sendmoney.pin === "" ||
			this.state.sendmoney.merchantId === ""
		) {
			console.log("this.sendMoney not submittable");
			this.setState({ disableSendMoneyButton: false });
			return;
		}

		if (this.state.disableSendMoneyButton) {
			console.log("this.state disabled");
			return;
		}

		let agentRequest = {};
		agentRequest.transferAmount = this.state.sendmoney.amount;
		agentRequest.walletPin = this.state.sendmoney.pin;
		agentRequest.merchantId = this.state.sendmoney.merchantId;
		agentRequest.payeeId = this.state.sendmoney.payeeId;
		agentRequest.currency = "MyCash";
		agentRequest.comment = this.state.sendmoney.comment;

		console.log("this.transfer submittable");
		console.log(agentRequest);
		let res = await fetch(
			process.env.REACT_APP_API_GW_HOST +
			"collection-service/endpoint/wallet/transfer/payee-merchant",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: "Bearer " + AuthUtil.getIdToken(),
				},
				body: JSON.stringify(agentRequest),
			}
		);

		let response = await res.json();
		console.log(response);

		this.setState({ disableSendMoneyButton: false });
		let messagetype = "warning";
		let message = "Please check manually";
		if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("fail")
		) {
			messagetype = "danger";
			message = response.result.message;
		} else if (
			response.result !== undefined &&
			response.result.message !== undefined &&
			response.result.message.toLowerCase().includes("success")
		) {
			messagetype = "success";
			message = response.result.message;
		} else if (response.result === undefined) {
			messagetype = "danger";
			message = response.message;
		}
		openAlert({ message: message, type: messagetype, duration: "2500" });
	}

	showLoadingText() {
		if (AuthUtil.getRolePresence(["Cashpoint"]) === true) {
			this.setState({ total: 7 });
		}
		else if (
			AuthUtil.getRolePresence(["Payee"]) === true ||
			AuthUtil.getRolePresence(["Merchant"]) === true ||
			AuthUtil.getRolePresence(["Maxis-Collection-Territory-Manager"]) === true ||
			AuthUtil.getRolePresence(["Maxis-Collection-Area-Manager"]) === true ||
			AuthUtil.getRolePresence(["Maxis-Collection-Nation-Manager"]) === true
		) {
			this.setState({ total: 1 });
		}
	}

	async merchantPullOTPSubmit() {
		console.log("inside merchantPullOTPSubmit");
		console.log(this.state.merchantPull);

		if(!this.disableMerchantPullOTPSubmitButton)
		{
			this.disableMerchantPullOTPSubmitButton = true;
			this.setState({ disableMerchantPullOTPSubmitButton: true });
		}
		else {
			console.log("this.state disabled");
			return;
		}
		if (
			this.state.merchantPull.transferAmount === undefined ||
			this.state.merchantPull.transferAmount === "" ||
			this.state.merchantPull.currency === undefined ||
			this.state.merchantPull.currency === "" ||
			this.state.merchantPull.payeeId === undefined ||
			this.state.merchantPull.payeeId === "" || 
			this.state.merchantPull.responseRequest.result.data.id === undefined ||
			this.state.merchantPull.responseRequest.result.data.id === "" || 
			this.state.merchantPull.merchantPullOTP === undefined ||
			this.state.merchantPull.merchantPullOTP === ""
		) {
			console.log("this.state not submittable");
			this.setState({ disableMerchantPullOTPSubmitButton: false });
			return;
		}

		let pullRequest = await fetch(
			process.env.REACT_APP_API_GW_HOST +
			"collection-service/endpoint/wallet/transfer/payee-merchant-pull-confirm",
			{
				"method": "POST",
				"headers": {
					"Content-Type": "application/json",
					"token": "Bearer " + AuthUtil.getIdToken(),
				},
				"body": JSON.stringify({"otp": this.state.merchantPull.merchantPullOTP, "id": this.state.merchantPull.responseRequest.result.data.id}),
			}
		);
		let responseRequest = await pullRequest.json();
		console.log("pull otp submit response");
		console.log(responseRequest);
		
		if (responseRequest.result === "FAILURE" || responseRequest.result === "Failure")
		{
			openAlert({ message: "Failed", type: "danger", duration: "2500" });
		}
		else if (responseRequest.result !== undefined && responseRequest.result !== null && responseRequest.result.result === "Success")
		{
			openAlert({ message: "Successful", type: "success", duration: "2500" });
		}
		else
		{
			openAlert({ message: "Successful", type: "success", duration: "2500" });
		}

		this.setState({ disableMerchantPullOTPRequestButton: false });
		this.disableMerchantPullOTPRequestButton = false;
		this.setState({ disableMerchantPullOTPSubmitButton: true });
		this.disableMerchantPullOTPSubmitButton = true;
	}

	async merchantPullOTPRequest() {
		console.log("inside merchantPullOTPRequest");
		console.log(this.state.merchantPull);

		if(!this.disableMerchantPullOTPRequestButton)
		{
			this.disableMerchantPullOTPRequestButton = true;
			this.setState({ disableMerchantPullOTPRequestButton: true });
			this.setState({ disableMerchantPullOTPSubmitButton: false });
			this.disableMerchantPullOTPSubmitButton = false;
		}
		else {
			console.log("this.state disabled");
			return;
		}

		if (
			this.state.merchantPull.transferAmount === undefined ||
			this.state.merchantPull.transferAmount === "" ||
			this.state.merchantPull.currency === undefined ||
			this.state.merchantPull.currency === "" ||
			this.state.merchantPull.payeeId === undefined ||
			this.state.merchantPull.payeeId === ""
		) {
			console.log("this.state not submittable");
			this.setState({ disableMerchantPullOTPRequestButton: false });
			this.setState({ disableMerchantPullOTPSubmitButton: true });
			return;
		}

		let pullRequest = await fetch(
			process.env.REACT_APP_API_GW_HOST +
			"collection-service/endpoint/wallet/transfer/payee-merchant-pull",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: "Bearer " + AuthUtil.getIdToken(),
				},
				body: JSON.stringify(this.state.merchantPull),
			}
		);
		let responseRequest = await pullRequest.json();
		console.log("pull otp request response");
		console.log(responseRequest);
		
		if (responseRequest.result.result === "FAILURE")
		{
			openAlert({ message: "OTP not sent. Please try a few mintutes later.", type: "danger", duration: "2500" });
		}
		else if (responseRequest.result.result === "SUCCESS")
		{
			this.setInputValue("merchantPull", "responseRequest", responseRequest);
		}
	}

	getComponentDesign() {
		let pageLoading = this.state.pageLoading;

		if (pageLoading) {
			return (
				<div className="home">
					<div className="loader-container">
						<div className="spinner-border" role="status" aria-hidden="true"></div>
						<div className="loader-text">{`LOADING ${this.state.count}/${this.state.total}`}</div>
					</div>
				</div >
			);
		}

		let componentDesign = (
			<div className="home">
				<Alert></Alert>

				{AuthUtil.getRolePresence(["Payee"]) === true ? (
					<div className="card-form-body-home">
						<div
							className="row card"
						>
							<div className="col-md-12 card-header">
								<Fieldset
									legend="Send Money"
									toggleable
									collapsed={true}
									className={this.fieldSetLegendClassName}
								>
									<hr />
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Amount</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Agent sell amount"
												value={this.state.sendmoney.amount}
												onChange={(val) =>
													this.setInputValue("sendmoney", "amount", val)
												}
											/>
										</div>
									</div>
									
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Merchant</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue("sendmoney", "merchantId", e.value);
												}}
												options={this.getMotherMerchants()}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>PIN</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="PIN"
												value={this.state.sendmoney.pin}
												onChange={(val) =>
													this.setInputValue("sendmoney", "pin", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Comment</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Comment"
												value={this.state.sendmoney.comment}
												onChange={(val) =>
													this.setInputValue("sendmoney", "comment", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-12">
											<ButtonComponent
												text="Send Money"
												onClick={() => {
													this.setState({ disableSendMoneyButton: true });
													this.sendMoney();
												}}
												disabled={this.state.disableSendMoneyButton}
											/>
										</div>
									</div>
								</Fieldset>
							</div>
						</div>
					</div>
				) : (
					<div></div>
				)}
				{AuthUtil.getRolePresence(["Agent"]) === true ? (
					<div className="card-form-body-home">
						<div
							className="row card"
						>
							<div className="col-md-12 card-header">
								<Fieldset
									legend="Cashpoint Transfer"
									toggleable
									collapsed={true}
									className={this.fieldSetLegendClassName}
								>
									<hr />
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Amount</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Agent sell amount"
												value={this.state.cp.amount}
												onChange={(val) =>
													this.setInputValue("cp", "amount", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>PIN</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Agent PIN"
												value={this.state.cp.pin}
												onChange={(val) => this.setInputValue("cp", "pin", val)}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-12">
											<ButtonComponent
												text="CP Transfer"
												onClick={() => {
													this.setState({ disableSelltoCPButton: true });
													this.agenttoCPSell();
												}}
												disabled={this.state.disableSelltoCPButton}
											/>
										</div>
									</div>
								</Fieldset>
							</div>
						</div>
					</div>
				) : (
					<div></div>
				)}
				{AuthUtil.getRolePresence(["Cashpoint"]) === true ? (
					<div className="card-form-body-home">
						<div
							className="row card"
						>
							<div className="col-md-12 card-header">
								<Fieldset
									legend="Deposit"
									toggleable
									collapsed={true}
									className={this.fieldSetLegendClassName}
								>
									<hr />
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Amount</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Deposit amount"
												value={this.state.deposit.amount}
												onChange={(val) =>
													this.setInputValue("deposit", "amount", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Currency</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue("deposit", "currency", e.value);
												}}
												options={this.getCurrencies()}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Currency Type</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Currency type"
												readOnly={true}
												value={this.state.deposit.currencyType}
												onChange={(val) =>
													this.setInputValue("deposit", "currencyType", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Bank</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue("deposit", "bankDetails", e.value);
												}}
												options={this.getDepositBanks()}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Reference / Cheque</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Referencec"
												value={this.state.deposit.reference}
												onChange={(val) =>
													this.setInputValue("deposit", "reference", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Comments</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Referencec"
												value={this.state.deposit.comments}
												onChange={(val) =>
													this.setInputValue("deposit", "comments", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-12">
											<ButtonComponent
												text="Deposit"
												onClick={() => {
													this.setState({ disableDepositButton: true });
													this.deposit();
												}}
											/>
										</div>
									</div>
								</Fieldset>
							</div>
						</div>

						<div className="row">
							<div className="col-md-12"> &nbsp;</div>
						</div>

						<div
							className="row card"
						>
							<div className="col-md-12 card-header">
								<Fieldset
									legend="Transfer"
									toggleable
									collapsed={true}
									className={this.fieldSetLegendClassName}
								>
									<hr />
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Amount</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Transfer amount"
												value={this.state.transfer.transferAmount}
												onChange={(val) =>
													this.setInputValue("transfer", "transferAmount", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Type</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue(
														"transfer",
														"transferType",
														e.value
													);
												}}
												options={this.transferTypeCurrent}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>PIN</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="PIN"
												value={this.state.transfer.walletPin}
												onChange={(val) =>
													this.setInputValue("transfer", "walletPin", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-12">
											<ButtonComponent
												text="Transfer"
												onClick={() => {
													this.setState({ disableTransferButton: true });
													this.transfer();
												}}
												disabled={this.state.disableTransferButton}
											/>
										</div>
									</div>
								</Fieldset>
							</div>
						</div>

						<div className="row">
							<div className="col-md-12"> &nbsp;</div>
						</div>

						<div
							className="row card"
						>
							<div className="col card-header">
								<Fieldset
									legend="Collection"
									toggleable
									collapsed={true}
									className={this.fieldSetLegendClassName}
								>
									<hr />
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Amount</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="collection amount"
												value={this.state.collection.amount}
												onChange={(val) =>
													this.setInputValue("collection", "amount", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Merchant</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue("collection", "merchantId", e.value);
												}}
												options={this.getMotherMerchants()}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Payee</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue("collection", "payeeId", e.value);
												}}
												options={this.getLocalMerchants()}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>

									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Collection type</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue("collection", "collectionType", e.value);
												}}
												options={this.getCollectiontypes()}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Wallet</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue("collection", "currency", e.value);
												}}
												options={this.getWalletTypes()}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Invoice</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Invoice"
												value={this.state.collection.invoiceNo}
												onChange={(val) =>
													this.setInputValue("collection", "invoiceNo", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Reference 1</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Reference 1"
												value={this.state.collection.reference1}
												onChange={(val) =>
													this.setInputValue("collection", "reference1", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Reference 2</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Reference 2"
												value={this.state.collection.reference2}
												onChange={(val) =>
													this.setInputValue("collection", "reference2", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Reference 3</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Reference 3"
												value={this.state.collection.reference3}
												onChange={(val) =>
													this.setInputValue("collection", "reference3", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Collection PIN</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="password"
												placeholder="Collection PIN"
												value={this.state.collection.collectionPin}
												onChange={(val) =>
													this.setInputValue("collection", "collectionPin", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Payee PIN</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="password"
												placeholder="Payee PIN"
												value={this.state.collection.payeePin}
												onChange={(val) =>
													this.setInputValue("collection", "payeePin", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-12">
											<ButtonComponent
												text="Collect"
												onClick={() => {
													this.setState({ disableCollectButton: true });
													this.collect();
												}}
												disabled={this.state.disableCollectButton}
											/>
										</div>
									</div>
								</Fieldset>
							</div>
						</div >

						<div className="row">
							<div className="col-md-12"> &nbsp;</div>
						</div>

						<div
							className="row card"
						>
							<div className="col-md-12 card-header">
								<Fieldset
									legend="Agent Sell"
									toggleable
									collapsed={true}
									className={this.fieldSetLegendClassName}
								>
									<hr />
									
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Agent</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue("agent", "agentId", e.value);
												}}
												options={this.getAgents()}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Amount</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Agent sell amount"
												value={this.state.agent.amount}
												onChange={(val) =>
													this.setInputValue("agent", "amount", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>PIN</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="DSE PIN"
												value={this.state.agent.pin}
												onChange={(val) =>
													this.setInputValue("agent", "pin", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-12">
											<ButtonComponent
												text="Sell to agent"
												onClick={() => {
													this.setState({ disableAgentButton: true });
													this.agentSell();
												}}
												disabled={this.state.disableAgentButton}
											/>
										</div>
									</div>
								</Fieldset>
							</div>
						</div>

						<div className="row">
							<div className="col-md-12"> &nbsp;</div>
						</div>

						<div
							className="row card"
						>
							<div className="col-md-12 card-header">
								<Fieldset
									legend="Maxis Credit Transfer"
									toggleable
									collapsed={true}
									className={this.fieldSetLegendClassName}
								>
									<hr />
									
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Maxis account</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue(
														"maxisManager",
														"toUserId",
														e.value
													);
												}}
												options={this.state.managerDropdown}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Amount</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Topup amount"
												value={this.state.maxisManager.transferAmount}
												onChange={(val) =>
													this.setInputValue(
														"maxisManager",
														"transferAmount",
														val
													)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-12">
											<ButtonComponent
												text="Sell to Maxis Manager"
												onClick={() => {
													this.setState({
														disableMaxisManagerTopupButton: true,
													});
													this.disableMaxisManagerTopupButton = true;
													this.maxisManagerTopup();
												}}
												disabled={this.state.disableMaxisManagerTopupButton}
											/>
										</div>
									</div>
								</Fieldset>
							</div>
						</div>

						<div className="row">
							<div className="col-md-12"> &nbsp;</div>
						</div>

						<div
							className="row card"
						
						>
							<div className="col-md-12 card-header">
								<Fieldset
									legend="Business House Credit Transfer"
									toggleable
									collapsed={true}
									className={this.fieldSetLegendClassName}
								>
									<hr />
									
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Business House</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue(
														"collection",
														"merchantId",
														e.value
													);
												}}
												options={this.getMotherMerchants()}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Amount</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Topup amount"
												value={this.state.collection.amount}
												onChange={(val) =>
													this.setInputValue("collection", "amount", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-12">
											<ButtonComponent
												text="Topup Business House"
												onClick={() => {
													this.setState({ disableCollectButton: true });
													this.disableCollectButton = true;
													this.maxisBusinessHouseTopup();
												}}
												disabled={this.state.disableCollectButton}
											/>
										</div>
									</div>
								</Fieldset>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12"> &nbsp;</div>
						</div>

						<div
							className="row card"
						
						>
							<div className="col-md-12 card-header">
								<Fieldset
									legend="Rider Transfer"
									toggleable
									collapsed={true}
									className={this.fieldSetLegendClassName}
								>
									<hr />
									
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Rider</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue("collection", "payeeId", e.value);
												}}
												options={this.getLocalMerchants()}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Amount</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Topup amount"
												value={this.state.maxisManager.transferAmount}
												onChange={(val) =>
													this.setInputValue(
														"maxisManager",
														"transferAmount",
														val
													)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-12">
											<ButtonComponent
												text="Sell to Maxis Manager"
												onClick={() => {
													this.setState({
														disableMaxisManagerTopupButton: true,
													});
													this.disableMaxisManagerTopupButton = true;
													this.maxisManagerTopup();
												}}
												disabled={this.state.disableMaxisManagerTopupButton}
											/>
										</div>
									</div>
								</Fieldset>
							</div>
						</div>
					</div >
					) : (
						<div></div>
					)
				}
				{
					AuthUtil.getRolePresence(["Merchant"]) === true? 
						<div className="card-form-body-home">
							<div className="col card-header">
								<Fieldset
									legend="Pull"
									toggleable
									collapsed={true}
									className={this.fieldSetLegendClassName}
								>
									<hr />
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Payee</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue("merchantPull", "payeeId", e.value);
												}}
												options={this.state.merchantPayeeDropDown}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Wallet type</b>
											</div>
										</div>
										<div className="col-md-9">
											<Select
												onChange={(e) => {
													this.setInputValue("merchantPull", "currency", e.value);
												}}
												options={this.getWalletTypes()}
												className="dropdown-bottom-margin"
												styles={customStyles}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Amount</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Pull amount"
												value={this.state.merchantPull.transferAmount}
												onChange={(val) =>
													this.setInputValue("merchantPull", "transferAmount", val)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-3">
											<div className="form-input-label">
												<b>Comment</b>
											</div>
										</div>
										<div className="col-md-9">
											<InputFieldComponent
												className="form-input"
												type="text"
												placeholder="Comment"
												value={this.state.merchantPull.comment}
												onChange={(val) =>
													this.setInputValue("merchantPull", "comment", val)
												}
											/>
										</div>
									</div>
									{
										this.state.disableMerchantPullOTPRequestButton === false && 
										<div className="row">
											<div className="col-md-12">
												<ButtonComponent
													text="OTP Request"
													onClick={() => {
														this.merchantPullOTPRequest();
													}}
													disabled={this.state.disableMerchantPullOTPRequestButton}
												/>
											</div>
										</div>
									}
									{
										this.state.disableMerchantPullOTPSubmitButton === false && 
										<div className="row">
											<div className="col-md-3">
												<div className="form-input-label">
													<b>OTP</b>
												</div>
											</div>
											<div className="col-md-9">
												<InputFieldComponent
													className="form-input"
													type="text"
													placeholder="OTP"
													value={this.state.merchantPull.merchantPullOTP}
													onChange={(val) =>
														this.setInputValue("merchantPull", "merchantPullOTP", val)
													}
												/>
											</div>
										</div>
									}
									{
										this.state.disableMerchantPullOTPSubmitButton === false && 
										<div className="row">
											<div className="col-md-12">
												<ButtonComponent
													text="OTP Submit"
													onClick={() => {
														this.merchantPullOTPSubmit();
													}}
													disabled={this.state.disableMerchantPullOTPSubmitButton}
												/>
											</div>
										</div>
									}
								</Fieldset>
							</div>
						</div>
						:
						<div></div>
				}
				{
					(	AuthUtil.getRolePresence(["Maxis-Collection-Territory-Manager"]) === true ||
						AuthUtil.getRolePresence(["Maxis-Collection-Area-Manager"]) === true ||
						AuthUtil.getRolePresence(["Maxis-Collection-Region-Manager"]) ===true
					) ? 
					(
						<div className="card-form-body-home">
							<div
								className="row card"
							
							>
								<div className="col-md-12 card-header">
									<Fieldset
										legend="Business House Credit Transfer"
										toggleable
										collapsed={true}
										className={this.fieldSetLegendClassName}
									>
										<hr />
										
										<div className="row">
											<div className="col-md-3">
												<div className="form-input-label">
													<b>Business House</b>
												</div>
											</div>
											<div className="col-md-9">
												<Select
													onChange={(e) => {
														this.setInputValue("collection", "merchantId", e.value);
													}}
													options={this.getMotherMerchants()}
													className="dropdown-bottom-margin"
													styles={customStyles}
												/>
											</div>
										</div>

										<div className="row">
											<div className="col-md-3">
												<div className="form-input-label">
													<b>Amount</b>
												</div>
											</div>
											<div className="col-md-9">
												<InputFieldComponent
													className="form-input"
													type="text"
													placeholder="Topup amount"
													value={this.state.collection.amount}
													onChange={(val) =>
														this.setInputValue("collection", "amount", val)
													}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-md-12">
												<ButtonComponent
													text="Topup Business House"
													onClick={() => {
														this.setState({ disableCollectButton: true });
														this.disableCollectButton = true;
														this.maxisBusinessHouseTopup();
													}}
													disabled={this.state.disableCollectButton}
												/>
											</div>
										</div>
									</Fieldset>
								</div>
							</div>
						</div>
					) : 
					(
						<div></div>
					)
				}
			</div >
		);
		return componentDesign;
	}

	componentDidMount() {
		this.showLoadingText();
		this.prepareHomePage();
	}

	render() {
		let componentDesign = this.getComponentDesign();

		return <MainComponent component={componentDesign} />;
	}
}

export default withRouter(HomeComponent);
