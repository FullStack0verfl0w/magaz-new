import React, { useState, useRef } from "react";
import { Animated, View, TouchableOpacity, LayoutAnimation } from "react-native";
import { useDispatch } from "react-redux";

// import { ChangeOrderStatus, DeleteOrder } from "~/redux/OrdersReducer/actions";
import { statusToText, ORDER_STATUS_CANCELED } from "../orderStates";
import { STORE_ADDRESS } from "~/utils/config";

import OurText from "~/components/OurText";
import OurTextButton from "~/components/OurTextButton";
import OurImage from "~/components/OurImage";
import OurImageSlider from "~/components/OurImageSlider";
import styles from "./styles";

const MAX_IMAGES = 4;
const ANIMATION_DURATION = 200;
const ORDER_MIN_HEIGHT = .00001;

const linear = LayoutAnimation.create(
    ANIMATION_DURATION,
    LayoutAnimation.Types.linear,
    LayoutAnimation.Properties.scaleY,
);

const OrderItem = (props) => {
    const dispatch = useDispatch();
    const { data, navigation } = props;

    const [gradStart, gradEnd] = ["#931DC4", "#F33BC8"];

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("OrderInfo", { id: data.data.databaseId, status: data.status.order_status })}>
                <View style={styles.orderInfoContainer}>
                    <View style={styles.orderMainInfo}>
                        <View style={styles.infoContainer}>
                            <OurText style={styles.textField} translate={true} params={{id: data.data.databaseId}}>orderNumber</OurText>
                        </View>
                        <View style={styles.infoContainer}>
                            <OurText style={styles.textField} translate={true} params={{total: data.data.total}}>cartTotal</OurText>
                        </View>
                    </View>
                    <View style={styles.orderStatusContainer}>
                        <OurText style={styles.textField} translate={true}>orderStatus</OurText>
                        <OurText style={styles.orderStatus} translate={true}>{`orderStatus_${data.status.order_status}`}</OurText>
                    </View>
                </View>
                <View style={styles.borderContainer}>
                    <View style={styles.itemBorder}/>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default React.memo(OrderItem); 