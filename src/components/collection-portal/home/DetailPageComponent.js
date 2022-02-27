import React from 'react'
import InputFieldComponent from '../../widgets/InputFieldComponent'
import ButtonComponent from '../../widgets/ButtonComponent'
import MainComponent from '../../../common/MainComponent'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import '../../../App.css'
class DetailPageComponent extends React.Component {

    constructor(props) {
        super(props);
        let data = this.props.location.state;

        if (data === undefined) {
            this.props.history.push("/home");
        }

        this.state = {
            id: data.row._original.id,
            name: data.row._original.name,
            occupation: data.row._original.occupation,
            date: new Date("12-21-2020")
        }

        console.log("received: ", data.row._original);
    }
    handleDateSelect(value) {
        console.log("handleDateSelect ", value.toString())
        this.setState({
            date: value
        })
    }
    handleDateChange(value) {

        let date = value.getDate();
        let month = value.getMonth() + 1;
        let year = value.getFullYear();

        let fullDate = date + "-" + month + "-" + year;

        console.log(fullDate);

        this.setState({
            date: value
        })


    }
    getComponentDesign() {

        let design = <div className="detail">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-2">
                            Id
            </div>
                        <div className="col-sm-4">
                            <InputFieldComponent
                                type='text'
                                placeholder='input value here'
                                value={this.state.id ? this.state.id : ''}
                                onChange={(val) => this.setInputValue('id', val)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-2">
                            Name
            </div>
                        <div className="col-sm-4">
                            <InputFieldComponent
                                type='text'
                                placeholder='input value here'
                                value={this.state.name ? this.state.name : ''}
                                onChange={(val) => this.setInputValue('name', val)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-2">
                            Occupation
            </div>
                        <div className="col-sm-4">
                            <InputFieldComponent
                                type='text'
                                placeholder='input value here'
                                value={this.state.occupation ? this.state.occupation : ''}
                                onChange={(val) => this.setInputValue('occupation', val)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-2">
                            Date
            </div>
                        <div className="col-sm-4">

                            <DatePicker
                                dateFormat='dd-MM-yyyy'
                                selected={this.state.date}
                                onChange={e => this.handleDateChange(e)}
                            />

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-4">
                        </div>
                        <div className="col-sm-2">
                            <ButtonComponent
                                text='Save'
                                onClick={() => this.save()}
                            />
                        </div>

                    </div>
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

    save() {
        console.log(this.state);
    }

    render() {
        let componentDesign = this.getComponentDesign();
        return <MainComponent component={componentDesign} />;
    }

}

export default DetailPageComponent;