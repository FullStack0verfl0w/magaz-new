import React, { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import { useDispatch } from "react-redux";
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

import { AddToast } from "~/redux/ToastReducer/actions";
import { MUTATION_LOGIN_USER } from "~/apollo/queries";
import SyncStorage from "sync-storage";
import OurTextField from "~/components/OurTextField";
import OurText from "~/components/OurText";
import OurActivityIndicator from "~/components/OurActivityIndicator";
import OurTextButton from "~/components/OurTextButton";
import styles from "./styles";
import { AUTH_TOKEN_EXPIRE_TIME, HeaderStyle } from "~/utils/config";
import { isIOS } from "~/utils";

const ERROR_TO_TRANSLATE = {
	"invalid_username": "loginPageErrorWrongData",
	"incorrect_username": "loginPageErrorWrongData",
	"incorrect_password": "loginPageErrorWrongData",
	"empty_username": "loginPageEmptyUsername",
	"empty_password": "loginPageEmptyPassword",
};

const LoginPage = (props) => {
	const { navigation } = props;

	const dispatch = useDispatch();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [gradStart, gradMiddle, gradEnd] = ["#B0E8E4", "#86A8E7", "#7F7FD5"];
	const customerId = uuidv4();

	const onError = (err) => {
		const errorMessage = err.toString().match(/^Error: (.*)$/)[1];
		const toast = {
			icon: faInfoCircle,
			text: ERROR_TO_TRANSLATE[errorMessage] || "activityError",
			translate: true,
			duration: 3000,
			color: "#fc0341",
		};
		dispatch(AddToast(toast, "LOGIN_MUTATION_ERROR"));
		console.log("ERROR LOGINING IN CUSTOMER:", err);
		SyncStorage.set("user-uuid", null);
		SyncStorage.set("user-id", null);
		SyncStorage.set("auth", null);
		SyncStorage.set("refresh-auth", null);
		SyncStorage.set("auth-expires-at", null);
	};
	const onCompleted = (data) => {
		SyncStorage.set("user-uuid", customerId);
		SyncStorage.set("user-id", data?.login?.user.databaseId);
		SyncStorage.set("auth", data.login.authToken);
		SyncStorage.set("refresh-auth", data.login.refreshToken);
		SyncStorage.set("auth-expires-at", Date.now() + AUTH_TOKEN_EXPIRE_TIME);
		navigation.popToTop();
	};

	const [loginCustomer, { loading, error }] = useMutation(MUTATION_LOGIN_USER, { onError, onCompleted });

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: null,
			headerStyle: HeaderStyle(gradStart),
		});
	}, [navigation]);

	const validateForm = (value) => {
		return value.trim() !== "";
	};

	return (
		<>
			<LinearGradient
				style={styles.background}
				locations={[0, .8, 1]}
				colors={[gradStart, gradMiddle, gradEnd]}/>
			{
				loading ?
					<OurActivityIndicator/>
					:
					<View style={styles.mainContainer}>
						<KeyboardAvoidingView style={styles.topContainer} behavior={isIOS() ? "padding" : null}
											  keyboardVerticalOffset={isIOS() ? 52 : 0}>
							<ScrollView contentContainerStyle={styles.scrollContainer}>
								<OurTextField placeholder="registerPageFormUsername"
											  onValidate={validateForm}
											  autoCompleteType="username"
											  model={[username, setUsername]}/>
								<OurTextField placeholder="registerPageFormPassword"
											  autoCapitalize="none"
											  autoCompleteType="password"
											  secureTextEntry={true}
											  onValidate={validateForm}
											  model={[password, setPassword]}/>
							</ScrollView>
							<View style={styles.bottomContainer}>
								<View style={styles.bottomSignInContainer}>
									<OurText translate={true}
											 style={styles.bottomSignInText}>loginPageRegisterText</OurText>
									<OurText style={[styles.bottomSignInText, styles.bottomSignInButton]}
											 onPress={() => {
												 navigation.navigate("RegisterPage");
											 }} translate={true}>loginPageRegisterButton</OurText>
								</View>
								<OurTextButton onPress={() => {
									loginCustomer({
										variables: {
											uuid: customerId,
											username: username,
											password: password,
										},
									});
								}} style={styles.button} textStyle={{ color: gradEnd, fontSize: 20 }}
											   translate={true}>welcomePageLogin</OurTextButton>
							</View>
						</KeyboardAvoidingView>
					</View>
			}
		</>
	);
};

export default LoginPage;