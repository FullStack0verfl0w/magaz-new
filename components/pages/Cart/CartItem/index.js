import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { ShowModal } from "~/redux/ModalReducer/actions";
import { ChangeProductQuantity, DeleteProductFromCart } from "~/redux/CartReducer/actions";
import { Animated, View, LayoutAnimation, TouchableOpacity } from "react-native";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { STORE_ADDRESS } from "~/utils/config";

import OurActivityIndicator from "~/components/OurActivityIndicator";
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
    const onQuantityChange = (quantity) => {

        if ( quantity !== 0 )
            setQuantity(quantity);

        if ( timer )
            clearTimeout(timer);

        setTimer( setTimeout( () => {
            if ( typeof quantity === "string")
                quantity = Number(quantity.replace(/[^0-9]/g, ''));

            quantity = Math.clamp(quantity, MIN_QUANTITY, MAX_QUANTITY);
            setQuantity(quantity);
            dispatch(ChangeProductQuantity(id, quantity));
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
                    {/*<OurText style={[styles.itemPrice, {marginLeft: 8}]} translate={true}>productQuantity</OurText>*/}
                    
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