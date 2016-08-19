'use strict';
import React from "react";
import PageHeader from "bootstrap-react-components";
import TextFormGroup from "bootstrap-react-components";
import TextAreaFormGroup from "bootstrap-react-components";
import DatePickerFormGroup from "bootstrap-react-components";
import SelectFormGroup from "bootstrap-react-components";
import * as Actions from "../actions/ContentActions";
import {withRouter} from "react-router";
import ContentStore from "../stores/ContentStore";
import {ContentEventNames} from "../constants";
import moment from "moment";
import TwitterContent from "../components/TwitterContent";
import FacebookContent from "../components/FacebookContent";
import WordpressContent from "../components/WordPressContent";

export default withRouter(class ContentEdit extends React.Component {

	constructor(props) {
		super(props);
		this.saveSucces                                                                                = this.saveSucces.bind(this);
		this.saveFailure                                                                               = this.saveFailure.bind(this);
		let {contentId}                                                                                = props.location.query;
		let {_id, body, campaign, createDate, owner, publishDate, title, wordpress, facebook, twitter} = contentId ? ContentStore.findById(contentId) : {
			_id: '',
			body: '',
			campaign: '',
			createDate: moment(),
			publishDate: moment(),
			title: '',
			wordpress: {
				excerpt: '',
				status: 'publish',
				format: '',
				useBody: true,
				count: 140,
				typeToCount: 'characters'
			},
			twitter: {
				status: '',
				useTitle: true
			},
			facebook: {
				post: '',
				useBody: true
			}
		};
		this.state                                                                                     = {
			_id, body, campaign, createDate, owner, publishDate, title, wordpress, facebook, twitter
		}
	}

	componentWillMount() {
		ContentStore.on(ContentEventNames.CONTENT_CREATE_SUCCESS, this.saveSucces);
		ContentStore.on(ContentEventNames.CONTENT_CREATE_FAILURE, this.saveFailure);
		Actions.load();
	}

	componentWillUnmount() {
		ContentStore.removeListener(ContentEventNames.CONTENT_CREATE_SUCCESS, this.saveSucces);
		ContentStore.removeListener(ContentEventNames.CONTENT_CREATE_FAILURE, this.saveFailure);
	}

	excerpt(count, typeToCount, body) {
		let excerpt = '';
		switch (typeToCount) {
			case 'characters':
				excerpt = body.substring(0, count);
				break;
			case 'words':
				excerpt = body.split(' ').splice(0, count).join(' ');
				break;
			case 'sentences':
				excerpt = body.split('.').splice(0, count).join('.') + ".";
				break;
		}
		return excerpt;
	}

	fieldChange(event) {
		let {facebook, twitter, wordpress} = this.state;
		switch (event.target.id) {
			case "facebookPost" :
				facebook.post = event.target.body;
				this.setState({
					facebook
				});
				break;
			case "facebookUseBody" :
				facebook.useBody = !facebook.useBody;
				if (facebook.useBody) {
					facebook.post = this.state.body;
				}
				this.setState({
					facebook
				});
				break;
			case "body" :
				let body = event.target.value;
				if (facebook.useBody) {
					facebook.post = body;
				}
				if (wordpress.useBody) {
					wordpress.excerpt = this.excerpt(wordpress.count, wordpress.typeToCount, body);
				}
				this.setState({
					body,
					facebook,
					wordpress
				});
				break;
			case "campaign" :
				this.setState({
					campaign: event.target.value
				});
				break;
			case "title" :
				if (twitter.useTitle) {
					twitter.status = event.target.value;
				}
				this.setState({
					title: event.target.value,
					twitter
				});
				break;
			case "twitterUseTitle" :
				twitter.useTitle = !twitter.useTitle;
				if (twitter.useTitle) {
					twitter.status = this.state.title
				}
				this.setState({
					twitter
				});
				break;
			case "twitterStatus" :
				twitter.status = event.target.value;
				this.setState({
					twitter
				});
				break;
			case "wordpressCount" :
				wordpress.count   = event.target.value;
				wordpress.excerpt = this.excerpt(wordpress.count, wordpress.typeToCount, this.state.body);
				this.setState({
					wordpress
				});
				break;
			case "wordpressTypeToCount" :
				console.log("ContentEdit.fieldChange ", event.target);
				wordpress.typeToCount = event.target.value;
				wordpress.excerpt     = this.excerpt(wordpress.count, wordpress.typeToCount, this.state.body);
				this.setState({
					wordpress
				});
				break;
			case "wordpressUseBody" :
				wordpress.useBody = !wordpress.useBody;
				if (wordpress.useBody) {
					wordpress.excerpt = this.excerpt(wordpress.count, wordpress.typeToCount, this.state.body);
				}
				this.setState({
					wordpress
				});
				break;
			case "wpExcerpt" :
				wordpress.excerpt = event.target.value;
				this.setState({
					wpFields: this.state.wpFields
				});
				break;
			case "wpStatus":
				wordpress.status = event.target.value;
				this.setState({
					wordpress
				});
				break;
			case"wpFormat" :
				wordpress.format = event.target.value;
				this.setState({
					wordpress
				});
				break;
		}
	};

	publishDateChange(publishDate) {
		this.setState({
			publishDate
		})
	}

	save() {
		let {_id, body, campaign, createDate, owner, publishDate, title, wordpress, twitter, facebook} = this.state;
		let valid                                                                                      = true;
		if (!body) {
			this.setState({
				bodyError: "Content must have a body"
			});
			valid = false;
		}
		if (!campaign) {
			this.setState({
				channelError: "Content must have a campaign"
			});
			valid = false;
		}

		if (!publishDate) {
			this.setState({
				publishDateError: "Content must have a publish date"
			});
			valid = false;
		}
		if (!title) {
			this.setState({
				titleError: "Content must have a title"
			});
			valid = false;
		}

		if (valid) {
			if (this.state._id) {
				Actions.update(_id, {body, campaign, createDate, owner, publishDate, title, wordpress, facebook, twitter});
			} else {
				Actions.create({body, campaign, createDate, owner, publishDate, title, wordpress, facebook, twitter});
			}
		}
	}

	saveSucces() {
		this.props.router.push('/content');
	}

	saveFailure() {
		this.setState({
			error: ContentStore.error()
		})
	}

	cancel() {
		this.props.router.push('/content');
	}

	render() {
		let {_id, body, campaign, createDate, owner, publishDate, title, wordpress, facebook, twitter}       = this.state;
		let {titleError, bodyError, publishDateError, excerptError, statusError, campaignError, formatError} = this.state;
		let campaignOptions                                                                                  = [];
		return (
				<div class="contentEdit">
					<PageHeader title="Edit Content"/>
					<TextFormGroup name="title" label="Title" placeholder="10 ways to do something cool"
					               onChange={this.fieldChange.bind(this)} value={title} error={titleError}/>
					<TextAreaFormGroup name="body" label="Body"
					                   onChange={this.fieldChange.bind(this)} value={body} error={bodyError}/>
					<DatePickerFormGroup name="publishDate" label="Publish Date" type="date"
					                     onChange={this.publishDateChange.bind(this)} value={publishDate}
					                     error={publishDateError}/>
					<SelectFormGroup name="campaign" label="Campaign"
					                 onChange={this.fieldChange.bind(this)} value={campaign} options={campaignOptions}
					                 error={campaignError}/>
					<FacebookContent facebook={facebook} onChange={this.fieldChange.bind(this)}/>
					<TwitterContent twitter={twitter} onChange={this.fieldChange.bind(this)}/>
					<WordpressContent wordpress={wordpress} onChange={this.fieldChange.bind(this)}/>
					<button id='saveButton' type="button" class="btn btn-primary" onClick={this.save.bind(this)}>Save
					</button>
					<button type="button" class="btn btn-default" onClick={this.cancel.bind(this)}>Cancel</button>
				</div>
		);
	}
})