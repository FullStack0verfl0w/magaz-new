import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, ActivityIndicator, View, Animated, Dimensions, Easing } from "react-native";
import OurText from "~/components/OurText";
import OurTextButton from "~/components/OurTextButton";
import styles from "./styles";

const ANIMATION_DURATION = 500;

const OurActivityIndicator = (props) => {
    const { error, abortControllerModel, doRefresh, buttonTextColor, size, oneState, color, style, containerStyle } = props;
    const [abortController, setAbortController] = abortControllerModel || [null, null];
    const opacity = useRef(new Animated.Value(0)).current;
    const posX = useRef(new Animated.Value(Dimensions.get("screen").width)).current;

    const textAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.timing(textAnim, {
                toValue: 1,
                easing: Easing.easeIn,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }).start();
        }, 1500);

    }, []);

    useEffect(() => {
        if ( oneState ) return;

        Animated.timing(opacity, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
        }).start();

        Animated.timing(posX, {
            toValue: 0,
            easing: Easing.bounce,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
        }).start();
    }, [error, abortController?.signal?.aborted])

    const onLongPress = (e) => {
        if ( abortController && !abortController?.signal?.aborted && !oneState ) {
            abortController.abort();
        }
    };

    const textPosY = textAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [64, 0],
        extrapolate: "clamp",
    });

    return (
        <View style={[styles.container, containerStyle]}>
            {
                abortController?.signal?.aborted && !oneState ?
                    <Animated.View style={{opacity, transform: [{ translateX: posX }]}}>
                        <OurText translate={true} style={styles.abortText}>activityAborted</OurText>
                        <OurTextButton onPress={(e)=>{
                            if ( setAbortController )
                                setAbortController(new AbortController());
                            doRefresh();
                        }} translate={true} textStyle={{color: buttonTextColor, paddingHorizontal: 32}}>activityRefresh</OurTextButton>
                    </Animated.View>
                    : error && !oneState ?
                    <Animated.View style={{opacity, transform: [{ translateX: posX }]}}>
                        <OurText translate={true} style={styles.abortText}>activityError</OurText>
                        <OurTextButton onPress={(e)=>{
                            if ( setAbortController )
                                setAbortController(new AbortController());
                            doRefresh();
                        }} translate={true} textStyle={{color: buttonTextColor, paddingHorizontal: 32}}>activityRefresh</OurTextButton>
                    </Animated.View>
                    :
                        <View style={style}>
                            <TouchableOpacity onLongPress={onLongPress} delayLongPress={100}>
                                <ActivityIndicator size={size || 64} style={styles.indicator} color={color || "#fff"}/>
                                {
                                    !oneState ?
                                        <Animated.View style={{ opacity: textAnim, transform: [ { translateY: textPosY } ] }}>
                                            <OurText style={styles.abortText} translate={true}>activityLoading</OurText>
                                        </Animated.View>
                                    :
                                        <></>
                                }
                            </TouchableOpacity>
                        </View>
            }
        </View>
    );
};

export default React.memo(OurActivityIndicator);