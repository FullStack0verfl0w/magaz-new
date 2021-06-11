import React, { useState, useLayoutEffect } from "react";
import { View, KeyboardAvoidingView, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import { useSelector, useDispatch } from "react-redux";
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

import { AddToast } from "~/redux/ToastReducer/actions";
import { MUTATION_REGISTER_USER } from "~/apollo/queries";
import { EMAIL_PATTERN, PASSWORD_PATTERN } from "~/utils/patterns";

import { HeaderTitle, HeaderBackButton } from "~/components/Header";
import OurTextField from "~/components/OurTextField";
import OurActivityIndicator from "~/components/OurActivityIndicator";
import OurTextButton from "~/components/OurTextButton";
import styles from "./styles";
import SyncStorage from "sync-storage";
import { AUTH_TOKEN_EXPIRE_TIME } from "~/utils/config";

const USERNAME_MIN_LENGTH = 4;

const ERROR_TO_STRING = {
    "A username was not provided.": "registerPageErrorNoUsername",
    "A email was not provided.": "registerPageErrorNoEmail",
    "A password was not provided.": "registerPageErrorNoPassword",
    "This email is already registered, please choose another one.": "registerPageErrorEmailRegistered",
    "This username is already registered. Please choose another one.": "registerPageErrorUsernameRegistered",
};

const RegisterPage = (props) => {
    const { navigation } = props;

    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameValid, setUsernameValid] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordRetype, setPasswordRetype] = useState("");
    const [passwordRetypeValid, setPasswordRetypeValid] = useState(false);

    const [gradStart, gradMiddle, gradEnd] = ["#B0E8E4", "#86A8E7","#7F7FD5"];

    const customerId = uuidv4();

    const onError = (err) => {
        let errorMessage = "";
        Object.keys(ERROR_TO_STRING).forEach((v) => {
            if ( err.toString().search(v) !== -1 )
                errorMessage = v;
        });
        const toast = {
            icon: faInfoCircle,
            text: ERROR_TO_STRING[errorMessage] || "activityError",
            translate: true,
            duration: 3000,
            color: "#fc0341",
        };
        dispatch(AddToast(toast, "REG_MUTATION_ERROR"));
        console.log("ERROR REGISTERING CUSTOMER:", err);
    };
    const onCompleted = (data) => {
        SyncStorage.set("user-uuid", customerId);
        SyncStorage.set("auth", data.registerUser.user.jwtAuthToken);
        SyncStorage.set("refresh-auth", data.registerUser.user.jwtRefreshToken);
        SyncStorage.set("auth-expires-at", Date.now() + AUTH_TOKEN_EXPIRE_TIME);

        navigation.popToTop();
    };

    const [regCustomer, {loading, error}] = useMutation(MUTATION_REGISTER_USER, {onError, onCompleted});

    useLayoutEffect( () => {
        navigation.setOptions({
            headerLeft: (props)=><HeaderBackButton navigation={navigation}/>,
            headerCenter: (props)=><HeaderTitle navigation={navigation} title={"registerPageTitle"}/>,
            headerRight: (props)=>{},
            headerStyle: {
                backgroundColor: gradStart,
            },
        });
    }, [navigation]);

    const validateFormEmail = (value) => {
        if ( value.trim() !== "" ) {
            if ( value.toLowerCase().match(EMAIL_PATTERN) ) {
                setEmailValid(true);
                return true;
            }
        }
        setEmailValid(false);
    };
    const validateFormUsername = (value) => {
        if ( value.length < USERNAME_MIN_LENGTH ) {
            const toast = {
                icon: faInfoCircle,
                text: "registerPageErrorUsernameShort",
                translate: true,
                duration: 3000,
                color: gradEnd,
            };
            dispatch(AddToast(toast, "REG_USERNAME_TOAST"));
            setUsernameValid(false);
            return false;
        }
        setUsernameValid(true);
        return true;
    }
    const validateFormPassword = (value) => {
        if ( value.trim() !== "" ) {
            if ( value.toLowerCase().match(PASSWORD_PATTERN) ) {
                setPasswordRetype("");
                setPasswordValid(true);
                return true;
            } else {
                const toast = {
                    icon: faInfoCircle,
                    text: "registerPageErrorPasswordNotValid",
                    translate: true,
                    duration: 3000,
                    color: gradEnd,
                };
                dispatch(AddToast(toast, "REG_PASSWORD_TOAST"));
                setPasswordValid(false);
            }
        }
    };
    const validateFormRetypePassword = (value) => {
        if ( value.trim() !== "" ) {
            if ( password === value ) {
                setPasswordRetypeValid(true);
                return true;
            } else {
                const toast = {
                    icon: faInfoCircle,
                    text: "registerPageErrorPasswordsDontMatch",
                    translate: true,
                    duration: 3000,
                    color: gradEnd,
                };
                dispatch(AddToast(toast, "REG_RETYPE_PASSWORD_TOAST"));
                setPasswordRetypeValid(false);
            }
        }
    };

    return (
        <>
            <LinearGradient
                style={styles.background}
                locations={[0, .8, 1]}
                colors={[gradStart, gradMiddle, gradEnd]} />
            {
                loading ?
                    <OurActivityIndicator />
                :
                    <View style={styles.mainContainer}>
                        <KeyboardAvoidingView style={styles.topContainer}>
                            <ScrollView contentContainerStyle={styles.scrollContainer}>
                                <OurTextField   placeholder="registerPageFormEmail"
                                                onValidate={validateFormEmail}
                                                autoCompleteType="email"
                                                keyboardType="email-address"
                                                model={[email, setEmail]}/>
                                <OurTextField   placeholder="registerPageFormUsername"
                                                autoCompleteType="username"
                                                onValidate={validateFormUsername}
                                                model={[username, setUsername]}/>
                                <OurTextField   placeholder="registerPageFormPassword"
                                                autoCapitalize="none"
                                                autoCompleteType="password"
                                                secureTextEntry={true}
                                                onValidate={validateFormPassword}
                                                model={[password, setPassword]}/>
                                <OurTextField   placeholder="registerPageFormPasswordRetype"
                                                autoCapitalize="none"
                                                autoCompleteType="password"
                                                secureTextEntry={true}
                                                onValidate={validateFormRetypePassword}
                                                model={[passwordRetype, setPasswordRetype]}/>
                            </ScrollView>
                            <View style={styles.bottomContainer}>
                                <OurTextButton disabled={!(
                                    emailValid &&
                                    usernameValid &&
                                    passwordValid &&
                                    passwordRetypeValid)} onPress={() => {
                                    regCustomer({
                                        variables: {
                                            uuid: customerId,
                                            username: username,
                                            email: email,
                                            password: password,
                                        },
                                    });
                                }} style={styles.button} textStyle={{color: gradEnd, fontSize: 20}} translate={true}>welcomePageRegister</OurTextButton>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
            }
        </>
    );
};

export default RegisterPage;