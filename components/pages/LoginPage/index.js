import React, { useState, useLayoutEffect } from "react";
import { View, KeyboardAvoidingView, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

import { AddToast } from "~/redux/ToastReducer/actions";
import { MUTATION_LOGIN_USER } from "~/apollo/queries";
import SyncStorage from "sync-storage";

import { HeaderTitle, HeaderBackButton } from "~/components/Header";
import OurTextField from "~/components/OurTextField";
import OurActivityIndicator from "~/components/OurActivityIndicator";
import OurTextButton from "~/components/OurTextButton";
import styles from "./styles";
import { AUTH_TOKEN_EXPIRE_TIME } from "~/utils/config";

const LoginPage = (props) => {
    const { navigation } = props;

    const state = useSelector(state=>state);
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [gradStart, gradMiddle, gradEnd] = ["#B0E8E4", "#86A8E7","#7F7FD5"];
    const customerId = uuidv4();

    const onError = (err) => {
        const toast = {
            icon: faInfoCircle,
            text: "activityError",
            translate: true,
            duration: 3000,
            color: "#fc0341",
        };
        dispatch(AddToast(toast, "LOGIN_MUTATION_ERROR"));
        console.log("ERROR LOGINING IN CUSTOMER:", err);
    };
    const onCompleted = (data) => {
        console.log("USER LOGGED IN", data);
        SyncStorage.set("user-uuid", customerId);
        SyncStorage.set("auth", data.login.authToken);
        SyncStorage.set("refresh-auth", data.login.refreshToken);
        SyncStorage.set("auth-expires-at", Date.now() + AUTH_TOKEN_EXPIRE_TIME);
        navigation.popToTop();
    };

    const [loginCustomer, {loading, error}] = useMutation(MUTATION_LOGIN_USER, {onError, onCompleted});

    useLayoutEffect( () => {
        navigation.setOptions({
            headerLeft: (props)=><HeaderBackButton navigation={navigation}/>,
            headerCenter: (props)=><HeaderTitle navigation={navigation} title={"loginPageTitle"}/>,
            headerRight: (props)=>{},
            headerStyle: {
                backgroundColor: gradStart,
            },
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
                colors={[gradStart, gradMiddle, gradEnd]} />
            {
                loading ?
                    <OurActivityIndicator />
                :
                    <View style={styles.mainContainer}>
                        <KeyboardAvoidingView style={styles.topContainer}>
                            <ScrollView contentContainerStyle={styles.scrollContainer}>
                                <OurTextField   placeholder="registerPageFormUsername"
                                                onValidate={validateForm}
                                                autoCompleteType="username"
                                                model={[username, setUsername]}/>
                                <OurTextField   placeholder="registerPageFormPassword"
                                                autoCapitalize="none"
                                                autoCompleteType="password"
                                                secureTextEntry={true}
                                                onValidate={validateForm}
                                                model={[password, setPassword]}/>
                            </ScrollView>
                            <View style={styles.bottomContainer}>
                                <OurTextButton onPress={() => {
                                    loginCustomer({
                                        variables: {
                                            uuid: customerId,
                                            username: username,
                                            password: password,
                                        },
                                    });
                                }} style={styles.button} textStyle={{color: gradEnd, fontSize: 20}} translate={true}>welcomePageLogin</OurTextButton>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
            }
        </>
    );
};

export default LoginPage;