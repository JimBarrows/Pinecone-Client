/**
 * Created by JimBarrows on 10/8/19.
 */

import React, {Component}          from 'react'
import {Route, Switch, withRouter} from 'react-router'
import Header                      from './components/Header'
import CampaignAdd                 from './pages/CampaignAdd'
import CampaignEdit                from './pages/CampaignEdit'
import Campaigns                   from './pages/Campaigns'
import EditBlogPost                from './pages/EditBlogPost'
import FinishTwitter               from './pages/FinishTwitter'
import Login                       from './pages/Login'
import NewBlogPost                 from './pages/NewBlogPost'
import Register                    from './pages/Register'
import Settings                    from './pages/Settings'
import UserStore                   from './stores/UserStore'

function requireAuth (nextState, replace) {
	if (!UserStore.user()) {
		replace({
							pathname: '/login',
							state   : {nextPathname: nextState.location.pathname}
						})
	}
}

export default withRouter(class App extends Component {

	static getDerivedStateFromError (error) {
		console.log('error: ', error)
		return {hasError: true}
	}


	gotoIndex=() => this.props.history.push('/')

	render () {
		return (
			<div className = "container" role = {"main"} >
				<Header id = {'app'} indexLinkClicked = {this.gotoIndex} />
				<div id = {"layout"} >
					<Switch >
						<Route exact path="/campaign" >
							<CampaignAdd />
						</Route >
						<Route exact path={"/campaign/:campaignId"} >
							<CampaignEdit />
						</Route >
						<Route path="/campaign/:campaignId/blogPosts/new" name="newBlogPost" onEnter={requireAuth} >
							<NewBlogPost />
						</Route >
						<Route path="/campaign/:campaignId/blogPosts/:blogPostId" name="editBlogPost" onEnter={requireAuth} >
							<EditBlogPost />
						</Route >
						<Route path="/finish/twitter" name="finishTwitter" onEnter={requireAuth} >
							<FinishTwitter />
						</Route >
						<Route path="/settings" >
							<Settings />
						</Route >
						<Route path="/register" >
							<Register />
						</Route >
						<Route path="/login" >
							<Login />
						</Route >
						<Route path="/" >
							<Campaigns />
						</Route >
					</Switch >
				</div >
			</div >
		)
	}
})
