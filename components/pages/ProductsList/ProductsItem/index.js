import React, { useState } from "react";
import { Animated, Dimensions, TouchableOpacity, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AddProductToCart } from "~/redux/CartReducer/actions";
import { ListAnimation } from "./animation";

import OurText from "~/components/OurText";
import OurImage from "~/components/OurImage";
import OurActivityIndicator from "~/components/OurActivityIndicator";
import OurCounter from "~/components/OurCounter";
import styles from "./styles";
import SyncStorage from "sync-storage";
import { ShowLoginModal } from "~/redux/ModalReducer/actions";
import OurIconButton from "~/components/OurIconButton";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons/faCartPlus";


const totalHeight = 570;
const itemWidth = Dimensions.get("window").width;

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999;

const QUANTITY_CHANGE_DELAY = 1500;

/** Список товаров той или иной категории */
const ProductsItem = (props) => {
    const { data, y, index, name, imageUrl, navigation } = props;
    const { t } = useTranslation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [quantityTimer, setQuantityTimer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(MIN_QUANTITY);

    const [gradStart, gradEnd] = ['#499eda', '#2454e5'];

    const state = useSelector(state=>state);
    const dispatch = useDispatch();

    const url = data?.image?.sourceUrl;

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const navigateToProductInfo = () => {
        navigation.navigate("ProductInfo", { name, imageUrl: url, id: data.databaseId, quant: quantity });
    };

    const validateQuantity = (quantity) => {
        if ( typeof quantity === "string" )
            quantity = Number(quantity.replace(/[^0-9]/g, ''));

        quantity = Math.clamp(quantity, MIN_QUANTITY, data.stockQuantity || MAX_QUANTITY)
        setQuantity(quantity);
        return quantity;
    };

    // Обрабатываем нажатие на кнопку "Купить"
    const buyProduct = (e) => {
        const auth = SyncStorage.get("auth");
        const refresh = SyncStorage.get("refresh-auth");

        if ( !refresh && !auth ) {
            ShowLoginModal(dispatch, navigation);
            return;
        }

        if ( data.variations ) {
            navigateToProductInfo();
            return;
        }
        //                                               Обрабатываем количество
        dispatch(AddProductToCart(data.databaseId, name, validateQuantity(quantity), setLoading));
    };


    const onQuantityChange = (quantity) => {
        if ( quantity !== 0 )
            setQuantity(quantity);

        if ( quantityTimer )
            clearTimeout(quantityTimer);

        setQuantityTimer(setTimeout(() => validateQuantity(quantity), QUANTITY_CHANGE_DELAY));
    };

    return (
        <Animated.View style={styles.mainContainer}>
            <TouchableOpacity onPress={navigateToProductInfo}>
            <View style={styles.titleContainer}>
                <OurText style={styles.title}>{name}</OurText>
                <OurImage style={styles.productImage} url={url} disabled={true} />
            </View>
            </TouchableOpacity>
            <View style={styles.infoContainer}>
                <View style={styles.infoMiddleContainer}>
                    <View style={styles.counterContainer}>
                        <OurText style={styles.infoPrice} translate={true}>productQuantity</OurText>
                        <OurCounter maxLength={3} onChange={onQuantityChange} value={quantity} color={gradStart}/>
                    </View>
                </View>
                <View style={styles.infoBottomContainer}>
                    <OurText style={styles.infoPrice}
                             params={{
                                 price: ( data.price === 0 || !data.price ) ? t("productFree") : (parseFloat(data.price) * parseInt(quantity)) + data.price.substr(-1)
                             }}>productPrice</OurText>
                    <View style={styles.buy} >
                    {
                        !loading ?
                            <OurIconButton style={styles.buyButton}
                                           translate={true}
                                           icon={faCartPlus}
                                           color={gradStart}
                                           size={24}
                                           onPress={(e) => buyProduct(e)} />
                        :
                        <OurActivityIndicator containerStyle={{
                            position: null,
                            paddingHorizontal: 32,
                            paddingVertical: 12,
                        }} oneState={true} size={48} color={"#fff"}/>
                    }
                    </View>
                </View>
            </View>
            <View style={styles.descriptionContainer}>
                <OurText numberOfLines={2} style={styles.descriptionText}>{data.shortDescription}</OurText>
            </View>
        </Animated.View>
    );
};

export default React.memo(ProductsItem);
