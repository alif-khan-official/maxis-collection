import React from 'react'
import '../App.css';
class FooterComponent extends React.Component {
    render() {
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <span>Maxis Collection Portal</span>
                </div>
                <div className="d-flex justify-content-end">
                    <span>&#169;</span>2022
                </div>
            </div>
        );
    }

}

export default FooterComponent;