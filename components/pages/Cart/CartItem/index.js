import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { ShowModal } from "~/redux/ModalReducer/actions";
import { ChangeProductQuantity } from "~/redux/CartReducer/actions";
import { Animated, View, LayoutAnimation, TouchableOpacity } from "react-native";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import OurActivityIndicator from "~/components/OurActivityIndicator";
import OurText from "~/components/OurText";
import OurIconButton from "~/components/OurIconButton";
import OurImage from "~/components/OurImage";
import OurCounter from "~/components/OurCounter";
import styles from "./styles";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999;

const QUANTITY_CHANGE_DELAY = 1500;

/** Компонент товара в корзине */
const CartItem = (props) => {
    const { id, productId, name, price, productQuantity, imageLink, variationName, navigation } = props;
    const [isModalVisible, setModalVisible] = useState(false);
    const [quantity, setQuantity] = useState(productQuantity || MIN_QUANTITY);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(null);
    const opacity = useRef(new Animated.Value(1)).current;
    const dispatch = useDispatch();

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const onQuantityChange = (newQuantity) => {

        if ( newQuantity !== 0 )
            setQuantity(newQuantity);

        if ( timer )
            clearTimeout(timer);

        setTimer( setTimeout( () => {
            if ( typeof newQuantity === "string")
                newQuantity = Number(newQuantity.replace(/[^0-9]/g, ''));

            newQuantity = Math.clamp(newQuantity, MIN_QUANTITY, MAX_QUANTITY);

            if ( newQuantity === quantity )
                return;

            setQuantity(newQuantity);
            dispatch(ChangeProductQuantity(id, newQuantity));
        }, QUANTITY_CHANGE_DELAY) );
    };

    const onRemove = () => {
        const modal = {
            title: { text: "cartDeleteTitle", params: {} },
            text: { text: "cartDeleteMessage", params: {} },
            animationIn: "fadeInUp",
            animationOut: "fadeOutDown",
            buttons: [
                {
                    text: "cancel",
                    textStyle: {
                        color: "#383838",
                    },
                },
                {
                    text: "ok",
                    onPress: (e) => {
                        setLoading(true);
                        dispatch(ChangeProductQuantity(id, 0));
                    },
                },
            ],
        };
        dispatch(ShowModal(modal));

    };

    const total = price.match(/(\d{0,99})\.(\d{0,99})(\D)/);
    const newPrice = total[1] + total[3];

    return (
        <Animated.View style={[styles.mainContainer, { opacity }]}>
            <TouchableOpacity style={styles.topContainer}  onPress={() => navigation.navigate("ProductInfo", { name, imageUrl: imageLink, id: productId })}>
                <OurText style={styles.itemName}>{variationName || name}</OurText>
                <OurImage style={styles.productImage} url={imageLink} disabled={true}/>
            </TouchableOpacity>
            <View style={styles.bottomContainer}>
                <View style={styles.counterContainer}>
                    <OurCounter onChange={onQuantityChange} value={quantity} color="#E81C1C"/>
                    {
                        loading ?
                            <OurActivityIndicator size={32} oneState={true} containerStyle={{position: null}} />
                        :
                            <OurIconButton style={styles.deleteButton} disabled={loading} onPress={onRemove} icon={faTrash} color="#E81C1C" />
                    }
                </View>
                <OurText style={styles.itemPrice} translate={true} params={{total: price}}>cartTotal</OurText>
            </View>
            <View style={styles.borderContainer}>
                <View style={styles.itemBorder}/>
            </View>
        </Animated.View>
    );
};

export default React.memo(CartItem); 