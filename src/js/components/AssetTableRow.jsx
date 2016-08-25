'use strict';

import React from "react";
import RowControlButtons from "../components/controls/RowControlButtons";


export default class AssetTableRow extends React.Component {

	constructor(props) {
		super(props);
		let {_id}  = props.asset;
		this.state = {
			editing: !_id
		};
	}

	onChange(event) {
		switch (event.target.id) {
			case "name":
				this.props.asset.name = event.target.value;
				break;
			case "type":
				this.props.asset.type = event.target.value;
				break;
			case "size":
				this.props.asset.size = event.target.value;
				break;
			case "url":
				this.props.asset.url = event.target.value;
				break;
		}
	}

	edit() {
		this.setState({
			editing: true
		})
	}

	save() {
		this.props.saveAsset(this.props.asset);
		this.setState({
			editing: false
		});
	}

	remove() {
		this.props.deleteAsset(this.props.asset)
	}

	render() {
		let {editing}                           = this.state;
		let {name, type, size, url}             = this.props.asset;

		let nameTd = editing ?
				<td><input id="name" type="text" defaultValue={name} onChange={this.onChange.bind(this)}/></td> :
				<td>{name}</td>;
		let typeTd = editing ?
				<td><input id="type" type="text" defaultValue={type} onChange={this.onChange.bind(this)}/></td> :
				<td>{type}</td>;
		let sizeTd = editing ?
				<td><input id="size" type="number" defaultValue={size} onChange={this.onChange.bind(this)}/></td> :
				<td>{size}</td>;
		let urlTd  = editing ?
				<td><input id="url" type="url" defaultValue={url} onChange={this.onChange.bind(this)}/></td> :
				<td>{url}</td>;
		return (
				<tr>
					{nameTd}
					{typeTd}
					{sizeTd}
					{urlTd}
					<td>
						<RowControlButtons editing={editing} edit={this.edit.bind(this)} save={this.save.bind(this)}
						                   remove={this.remove.bind(this)}/>
					</td>
				</tr>
		);
	}
}