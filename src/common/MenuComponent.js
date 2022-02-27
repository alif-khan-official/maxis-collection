import React from "react";
import { withRouter, Link } from "react-router-dom";
import AuthUtil from "../auth/AuthUtil";
import "../App.css";
// import logo from "../logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

class MenuComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: null,
			path: "",
		};

		this.changeMenu = this.changeMenu.bind(this);
	}

	open() {
		if (!this.state.isOpen) {
			document.getElementsByClassName("body")[0]["style"].marginLeft = "0";
			// document.getElementsByClassName("footer")[0]["style"].marginLeft = "250px";
			// document.getElementsByClassName("footer")[0]["style"].paddingRight = "250px";
			this.setState({
				isOpen: true,
			});
		} else {
			document.getElementsByClassName("body")[0]["style"].marginLeft = "-250px";
			// document.getElementsByClassName("footer")[0]["style"].marginLeft = "";
			// document.getElementsByClassName("footer")[0]["style"].paddingRight = "250px";
			this.setState({
				isOpen: false,
			});
		}
	}

	async changeMenu() {
		let p = window.location.pathname;
		this.setState({ path: p });
	}

	componentDidMount() {
		let p = window.location.pathname;
		this.setState({ path: p });

		let viewportWidth = window.innerWidth;
		if (viewportWidth <= 576) {
			this.setState({ isOpen: false });
		}
		else {
			this.setState({ isOpen: true });
		}
	}

	render() {
		let menu = AuthUtil.getMenu();
		let name = AuthUtil.getUsername();
		let role = AuthUtil.getRoleList();
		return (
			<div>
				<div id="sidebar-wrapper">
					<ul className="sidebar-nav">
						<div className="sidebar-brand">
							<Link
								to={
									"/home"
								}
							>
								{/* <img src={logo} alt="Logo" className="width-30-pixel" /> COLLECTION */}
								<img src="65332127.png" alt="Logo" className="width-30-pixel" /> COLLECTION
							</Link>
						</div>

						<li className={(this.state.path === "/home") ? "active-menu" : ""}
							id="sidebar-nav-first-li"
							onClick={() => this.changeMenu()}>
							<Link
								to={
									"/home"
								}
							>
								Home
							</Link>
						</li>

						{menu &&
							menu.map((value, index) => {
								return (
									<div key={index}>
										{value.name !== "root" && (
											<li
												className={(this.state.path === "/" + value.name) ? "active-menu" : ""}
												onClick={() => this.changeMenu()}>
												<Link
													to={{
														pathname: value.name,
													}}
												>
													{value.displayName}
												</Link>
											</li>
										)}
									</div>
								);
							})}
						{/*
						<li className={(this.state.path === "/update-password") ? "active-menu" : ""}
							onClick={() => this.changeMenu()}>
							<Link
								to={{
									pathname: "/update-password",
								}}
							>
								Update Password
							</Link>
						</li>
						*/}
					</ul>
				</div >
				<div className="navbar">
					<div className="row no-gutters">
						{AuthUtil.isTokenValid() && (
							<div className="col-sm align-self-start">
								<div className="mydivnew">
									<div>
										<span id="hamburger" onClick={() => this.open()}>
											&#9776;
										</span>
										{/*
										&emsp;
										{name} ({role[0].displayName})
										*/}
									</div>
								</div>
							</div>
						)}

						{/* <div className="col-sm align-self-end right-align-text"> */}
						<div className="col-sm align-self-end right-align-text">
							<div className="mydivnew">
								{AuthUtil.isTokenValid() && (

									<div className="dropdowns">
										<span className="dropbtn">{name} ({role[0].displayName}) <FontAwesomeIcon

											style={{
												marginLeft: "2.5px",
											}}

											icon={faCaretDown}
										/></span>
										<div className="dropdown-content">
											<Link
												to={{
													pathname: "/update-password",
												}}
											>
												Update Password
											</Link>
											<Link
												to={{
													pathname: "/",
												}}
												onClick={() => AuthUtil.resetTokenDetail()}
											>
												Logout
											</Link>
										</div>
									</div>
								)}
								{!AuthUtil.isTokenValid() && (
									<Link
										to={{
											pathname: "/",
										}}
									>
										{/* <span className="align-middle">Back to Login</span> */}
										Back to Login
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			</div >
		);
	}
}

export default withRouter(MenuComponent);