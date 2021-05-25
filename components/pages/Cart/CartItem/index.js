import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { ShowModal } from "~/redux/ModalReducer/actions";
import { ChangeProductQuantity, DeleteProductFromCart } from "~/redux/CartReducer/actions";
import { Animated, View, LayoutAnimation } from "react-native";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { STORE_ADDRESS } from "~/utils/config";

import OurText from "~/components/OurText";
import OurIconButton from "~/components/OurIconButton";
import OurImage from "~/components/OurImage";
import OurImageSlider from "~/components/OurImageSlider";
import OurCounter from "~/components/OurCounter";
import styles from "./styles";

const ANIMATION_DURATION = 200;
const PRODUCT_MIN_HEIGHT = 0.0001;

const linear = LayoutAnimation.create(
    ANIMATION_DURATION,
    LayoutAnimation.Types.linear,
    LayoutAnimation.Properties.scaleY,
);

const MIN_QUANTITY = 1;
const MAX_QUANTITY = Infinity;

const QUANTITY_CHANGE_DELAY = 1000;

/** Компонент товара в корзине */
const CartItem = (props) => {
    const { id, productId, name, price, productQuantity, imageLink } = props;
    const [isModalVisible, setModalVisible] = useState(false);
    const [quantity, setQuantity] = useState(productQuantity || MIN_QUANTITY);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(null);
    const opacity = useRef(new Animated.Value(1)).current;
    const dispatch = useDispatch();

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const onQuantityChange = (quantity) => {
        if ( typeof quantity === "string")
            quantity = Number(quantity.replace(/[^0-9]/g, ''));

        setQuantity(Math.clamp(quantity, MIN_QUANTITY, MAX_QUANTITY));

        if ( timer ) {
            clearTimeout(timer);
        }
        setTimer( setTimeout( () => {
            dispatch(ChangeProductQuantity(id, quantity))
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
            <View style={styles.topContainer}>
                <OurText style={styles.itemName}>{name}</OurText>
                <OurImage style={styles.productImage} url={`${STORE_ADDRESS}wp-content/uploads/${imageLink}`} onPress={toggleModal}/>
                <OurImageSlider data={[`${STORE_ADDRESS}wp-content/uploads/${imageLink}`]} isModalVisible={isModalVisible} toggleModal={toggleModal} />
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.counterContainer}>
                    <OurCounter onChange={onQuantityChange} value={quantity} color="#E81C1C"/>
                    {/*<OurText style={[styles.itemPrice, {marginLeft: 8}]} translate={true}>productQuantity</OurText>*/}
                    <OurIconButton style={styles.deleteButton} onPress={onRemove} icon={faTrash} color="#E81C1C" />
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