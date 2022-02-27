import React from "react";
import { withRouter, Link } from "react-router-dom";
import AuthUtil from "../auth/AuthUtil";
import "../App.css";
class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  render() {
    let menu = AuthUtil.getMenu();
    let name = AuthUtil.getUsername();
    let role = AuthUtil.getRoleList();
    return (
      <div>
        {/*
        <div className="d-flex justify-content-end navbar">
          <div className="navbar-content">
            <div className="mydiv">
              {AuthUtil.isTokenValid() && (
                <div>
                  {name} ({role[0].displayName})
                </div>
              )}
            </div>
          </div>

          <div className="navbar-content">
            <div className="mydiv">
              {AuthUtil.isTokenValid() && (
                <Link
                  to={{
                    pathname: "/home",
                  }}
                >
                  Home
                </Link>
              )}
            </div>
          </div>

          {menu &&
            menu.map((value, index) => {
              return (
                <div className="navbar-content" key={index}>
                  {value.name !== "root" && (
                    <div className="mydiv" key={index}>
                      <Link
                        to={{
                          pathname: value.name,
                        }}
                      >
                        {value.displayName}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}

          <div className="navbar-content">
            <div className="mydiv">
              {AuthUtil.isTokenValid() && (
                <Link
                  to={{
                    pathname: "/update-password",
                  }}
                >
                  Update Password
                </Link>
              )}
            </div>
          </div>

          <div className="navbar-content">
            <div className="mydiv">
              {AuthUtil.isTokenValid() && (
                <Link
                  to={{
                    pathname: "/",
                  }}
                  onClick={() => AuthUtil.resetTokenDetail()}
                >
                  Logout
                </Link>
              )}
            </div>
          </div>

          <div className="navbar-content">
            <div className="mydiv">
              {!AuthUtil.isTokenValid() && (
                <Link
                  to={{
                    pathname: "/",
                  }}
                >
                  Back To Login
                </Link>
              )}
            </div>
          </div>
        </div>
        <br />
*/}
        <div className="navbar">
          <div class="row no-gutters">
            <div class="col">
              <div class="row no-gutters">
                <div class="col-1 align-self-start">
                  <div className="mydivnew">
                    {AuthUtil.isTokenValid() && (
                      <div
                        onClick={() => this.open()}
                      >
                        &#9776;
                      </div>
                    )}
                  </div>
                </div>
                <div class="col-11 align-self-start">
                  <div className="mydivnew">
                    {AuthUtil.isTokenValid() && (
                      <div>
                        {name} ({role[0].displayName})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div class="col align-self-end right-align-text">
              <div className="mydivnew">
                {AuthUtil.isTokenValid() && (
                  <Link
                    to={{
                      pathname: "/",
                    }}
                    onClick={() => AuthUtil.resetTokenDetail()}
                  >
                    Logout
                  </Link>
                )}ß
                {!AuthUtil.isTokenValid() && (
                  <Link
                    to={{
                      pathname: "/",
                    }}
                  >
                    Back To Login
                  </Link>
                )}å
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(HeaderComponent);

// {value.subMenu.length === 0 &&
//     <div className="mydiv">
//         <Link
//             to={{
//                 pathname: value.route,
//             }}
//         >
//             {value.displayName}

//         </Link>
//     </div>

// }
// {value.subMenu.length > 0 &&
//     <div className="mydiv">

//         <div className="dropdown">
//             {value.subMenu.length > 0 &&
//                 value.displayName
//             }
//             <div className="dropdown-content">
//                 {value.subMenu.map((subMenu, i) => {
//                     return (
//                         <Link
//                             to={
//                                 {
//                                     pathname: subMenu.route
//                                 }
//                             }
//                         >
//                             {subMenu.displayName}
//                         </Link>
//                     );
//                 })}
//             </div>
//         </div>
//     </div>
// }
