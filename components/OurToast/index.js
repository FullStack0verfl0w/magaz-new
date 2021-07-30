import React from "react";
import { KeyboardAvoidingView, LayoutAnimation, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";

import ToastItem from "./ToastItem";
import styles from "./styles";

const easeInEaseOut = LayoutAnimation.create(
    200,
    LayoutAnimation.Types.easeInEaseOut,
    LayoutAnimation.Properties.scaleY,
);

const OurToast = (props) => {
    const state = useSelector(state=>state);
    const toasts = Array.from(state.toastReducer.toastList.values());

    const postDelete = () => {
        LayoutAnimation.configureNext(easeInEaseOut);
    };

    return (
        <KeyboardAvoidingView behavior={"padding"} pointerEvents="box-none" style={styles.mainContainer}>
            <SafeAreaView>
            {
                toasts.map( (toast, index) => 
                    <ToastItem postDelete={postDelete} duration={toast.duration} id={toast.id} text={toast.text} translate={toast.translate} color={toast.color} icon={toast.icon} key={toast.id} />
                )
            }
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default OurToast;