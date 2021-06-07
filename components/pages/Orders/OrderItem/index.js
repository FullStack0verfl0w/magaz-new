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
    const opacity = useRef(new Animated.Value(1)).current;
    const [height, setHeight] = useState(null);

    // const images = Array.from(data.products.values()).map( (v, i) => {
    //     return `${STORE_ADDRESS}wp-content/uploads/${v.imageLink}`;
    // });

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = (e) => {
        setModalVisible(!isModalVisible);
    };

    const viewInfo = (e) => {
        navigation.navigate("DeliveryDetailsCheck", { data: data.deliveryDetails, isOrderMade: true });
    }
    const cancelOrder = (e) => {
        // dispatch(ChangeOrderStatus(data.uuid, ORDER_STATUS_CANCELED));
    };
    const deleteOrder = (e) => {
        LayoutAnimation.configureNext(linear);
        Animated.timing(opacity, {
            toValue: 0,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
        }).start(() => dispatch(DeleteOrder(data.uuid)));
        setHeight(ORDER_MIN_HEIGHT);
    };

    const [gradStart, gradEnd] = ["#931DC4", "#F33BC8"];

    return (
        <Animated.View style={[styles.mainContainer, { opacity, height }]}>
            <TouchableOpacity onPress={() => navigation.navigate("OrderInfo", { id: data.databaseId, status: data.status })}>
                <View style={styles.orderInfoContainer}>
                    <View style={styles.orderMainInfo}>
                        <View style={styles.infoContainer}>
                            <OurText style={styles.textField} translate={true} params={{id: data.databaseId}}>orderNumber</OurText>
                        </View>
                        <View style={styles.infoContainer}>
                            <OurText style={styles.textField} translate={true} params={{total: data.total}}>cartTotal</OurText>
                        </View>
                    </View>
                    <View style={styles.orderStatusContainer}>
                        <OurText style={styles.textField} translate={true}>orderStatus</OurText>
                        <OurText style={styles.orderStatus} translate={true}>{`orderStatus_${data.status}`}</OurText>
                    </View>
                </View>
                <View style={styles.borderContainer}>
                    <View style={styles.itemBorder}/>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default React.memo(OrderItem); 