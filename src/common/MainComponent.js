import React from 'react';
import '../App.css';
import { NotificationContainer } from 'react-notifications';
import FooterComponent from './FooterComponent';
// import HeaderComponent from './HeaderComponent';
import AuthUtil from '../auth/AuthUtil.js'
// import SidebarComponent from './SidebarComponent';
import MenuComponent from './MenuComponent';

class MainComponent extends React.Component {

    getMainComponentDesign() {
        let design = <div>
            <div className="body toggled" id="wrapper">
                {/*
                <SidebarComponent />
                <HeaderComponent />
                */}
                <MenuComponent />
                <div className="main-content">
                    {this.props.component}
                </div>
                <NotificationContainer />
            </div>

            <div className="footer">
                <FooterComponent />
            </div>

        </div>
        return design;
    }

    getMainComponentDesign2() {
        let design = <div>
            {/*   
            <div className="row">
                <div className="col-sm-12">
                    <HeaderComponent />
                </div>
            </div>
            */}
            <div className="body">
                <MenuComponent />
                NOT LOGGED IN
            </div>

            <div className="footer">
                <FooterComponent />
            </div>

        </div>
        return design;
    }

    isforgetPasswordPage() {
        let path = this.props.component._owner.pendingProps.location.pathname;
        if (path === "/submit-otp") {
            return true;
        }

        if (path === "/generate-otp") {
            return true;
        }
        return false;
    }
    render() {
        /*
        if (this.isforgetPasswordPage()) {
            return this.getMainComponentDesign();
        }

        if (AuthUtil.isTokenValid()) {
            return this.getMainComponentDesign();
        }
        return this.getMainComponentDesign2();
        */
        if (this.isforgetPasswordPage()) {
            return this.getMainComponentDesign();
        }
        if (AuthUtil.isTokenValid()) {
            return this.getMainComponentDesign();
        }
        return this.getMainComponentDesign2();

    }

}

export default MainComponent;