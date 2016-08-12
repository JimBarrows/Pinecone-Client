"use strict";
import axios from "axios";
import dispatcher from "../Dispatcher";
import {UserEventNames} from "../constants";

export function addFacebookUserId(accessToken, email, expiresIn, name, signedRequest, userId) {
	axios.put("/api/user/facebookId", {accessToken, email, expiresIn, name, signedRequest, userId})
			.then(() =>
					dispatcher.dispatch({
						type: UserEventNames.USER_FACEBOOK_ID_ADDED,
						accessToken, email, expiresIn, name, signedRequest, userId
					}))
			.catch((error) => dispatcher.dispatch({
				type: UserEventNames.USER_FACEBOOK_ID_ADD_ERROR,
				error: error.data ? error.data : error
			}));

}

export function addTwitterAccount() {
	axios.get("/api/user/twitterAccount")
			.then(function (response) {
				console.log("UserActions.addTwitterAccount response: ", response);
			})
			.catch(function (error) {
				console.log("UserActions.addTwitterAccount", error);
			});
}

export function login(username, password) {
	axios.post("/api/user/login", {
				username
				, password
			})
			.then(function (response) {
				dispatcher.dispatch({
					type: UserEventNames.USER_LOGGED_IN
					, content: response.data
				})
			})
			.catch(function (error) {
				console.log("Error logging in: ", error);
				let errorMessage = "Unknown error";
				if (error.data) {
					errorMessage = error.data;
				} else if (error.status > 299) {
					errorMessage = error.status + " - " + error.statusText;
				}
				dispatcher.dispatch({
					type: UserEventNames.USER_LOGIN_FAILURE
					, username
					, error: errorMessage
				})
			})
}

export function logout() {
	axios.get("/api/user/logout")
			.then(function () {
				dispatcher.dispatch({
					type: UserEventNames.USER_LOGGED_OUT
				});
			})
			.catch(function (error) {
				dispatcher.dispatch({
					type: UserEventNames.USER_LOGOUT_FAILURE
					, error: error.data
				})
			})
}

export function registerUser(username, password) {
	axios.post("/api/user/register", {username, password})
			.then(function (response) {
				if (response.data.error) {
					dispatcher.dispatch({
						type: UserEventNames.REGISTER_USER_FAILURE
						, username
						, error: {
							data: response.data.error
						}
					})
				} else {
					dispatcher.dispatch({
						type: UserEventNames.REGISTER_USER_SUCCESS
						, content: response.data
					})
				}
			})
			.catch(function (error) {
				dispatcher.dispatch({
					type: UserEventNames.REGISTER_USER_FAILURE
					, username
					, error
				})
			})
}

