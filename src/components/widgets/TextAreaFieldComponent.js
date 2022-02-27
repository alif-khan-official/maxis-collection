import React from 'react'
import '../../App.css'
class TextAreaFieldComponent extends React.Component {
    render() {
        return (
            <div className="inputField">
                {   this.props.readOnly === true?
                        <textarea
	                        className={this.props.className}
	                        readOnly
	                        type={this.props.type}
	                        pattern={this.props.format}
	                        placeholder={this.props.placeholder}
	                        value={this.props.value}
	                        onChange={(e) => this.props.onChange(e.target.value)}
							rows={this.props.rows}
							cols={this.props.cols}
	                    >
	                    </textarea>
                :
	                    <textarea
	                        className={this.props.className}
	                        type={this.props.type}
	                        pattern={this.props.format}
	                        placeholder={this.props.placeholder}
	                        value={this.props.value}
	                        onChange={(e) => this.props.onChange? this.props.onChange(e.target.value) : {}}
	                        onKeyDown={(e) => this.props.onKeyDown? this.props.onKeyDown(e): {} }
							rows={this.props.rows}
							cols={this.props.cols}
	                    >
	                    </textarea>
                }
            </div>
        );
    }

}

export default TextAreaFieldComponent;