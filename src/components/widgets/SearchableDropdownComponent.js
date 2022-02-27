import React		from "react"				;
import Searchable from "react-searchable-dropdown";
import "../../App.css";
//import "./css/searchablestyles.scss";

class SearchableDropdownComponent extends React.Component
{
	constructor(props) 
	{
		super(props);
		
		let filter			= this.props.filter			;
		let value			= this.props.value			; 
		let context			= this.props.context		;
		let onChange		= this.props.onChange		;
		let placeholder		= this.props.placeholder	;
		let fieldComponent	= this.props.fieldComponent	;
		let rootComponent	= this.props.rootComponent	;
		const readOnly= this.props.readOnly	;

		console.log("design test: source - " + fieldComponent.source);
		console.log("design test: rootComponent - ");
		console.log(rootComponent.state);
		let list = rootComponent.state.meta[fieldComponent.source];
		let data = list;
		let name = fieldComponent.code;

		let selectedItemLabel = "";
		let selectedItem = {};
		if (value !== undefined)
		{
			
			for (let i = 0; list !== undefined && i < list.length; i++)
			{
				if (list[i].value === value)
				{
					selectedItem = list[i];
					selectedItemLabel = selectedItem.label;
					break;
				}
			}
		}

		if (filter === true)
		{
			data = [];
			
			let masterValue = rootComponent.state.dropDownValues[fieldComponent.sourceFilter];
			for(let i = 0; masterValue !== undefined && list !== undefined && list !== null && i < list.length; i++)
			{
				if (list[i][fieldComponent.filterField] === masterValue)
				{
					data.push(list[i]);
				}
			}
			rootComponent.saveDropDownDependencies(fieldComponent.sourceFilter, this);
		}
		else
		{
		}

		this.state =	{	"code"			: name			,
							"data"			: data			,
							"list"			: list			,
							"value"			: value			,
							"filter"		: filter		,

							"context"		: context		,
							"onChange"		: onChange		,
							"placeholder"	: placeholder	,

							"readOnly"		: readOnly		,
							"rootComponent"	: rootComponent	,
							"fieldComponent": fieldComponent,
							
							"selectedItemLabel"	:	selectedItemLabel
						}
		;
		
		this.setInputValue = this.setInputValue.bind(this);
		this.resetOptions = this.resetOptions.bind(this);
	}

	resetOptions(val) 
	{
		this.setState({"value": ""});
		let list = this.state.list;
		let data = [];
		for(let i = 0; list !== undefined && list !== null && i <list.length; i++)
		{
			if (list[i][this.state.fieldComponent.filterField] === this.state.rootComponent.state.dropDownValues[this.state.fieldComponent.sourceFilter])
			{
				data.push(list[i]);
			}
		}
		this.setState({"data": data});
	}

	setInputValue(val) 
	{
		this.setState({"value": val});
		this.state.context.setDropDownFieldValue(this.state.code, val);
	}

	componentDidMount()
	{
	}
	
	render() 
	{
		if (this.state.data === undefined) return (<div>No data</div>);
		let val = "";
		if (this.state.value !== undefined && this.state.value !== null)	val = this.state.value;
		
		
		if (this.state.readOnly)
		{
			return (<div>{this.state.selectedItemLabel}</div>);
		}
		else
		{
			return	(
						<Searchable 
							value={val} 
							placeholder={this.state.placeholder}
							options={this.state.data} 
							onSelect={(value) => { this.setInputValue(value) }}  
						/>
					)
			;
		}
	}
}

export default SearchableDropdownComponent;