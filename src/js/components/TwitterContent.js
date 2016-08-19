'use strict';
import React from "react";
import TextFormGroup from "bootstrap-react-components";
import Panel from "bootstrap-react-components";
import CheckboxFormGroup from "bootstrap-react-components";

export default class TwitterContent extends React.Component {


	render() {
		let {status, useTitle, statusError} = this.props.twitter;
		return (
				<Panel title="Twitter">
					<CheckboxFormGroup name="twitterUseTitle" label="Use content  title" onChange={this.props.onChange}
					                   value={useTitle} error=""/>
					<TextFormGroup name="twitterStatus" label="Status" placeholder="Status"
					               onChange={this.props.onChange} value={status} error={statusError} disabled={useTitle}/>
				</Panel>
		);
	}
}