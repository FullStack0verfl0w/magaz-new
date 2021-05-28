import React, { useState } from "react";
import { View, Dimensions, Animated, TouchableOpacity } from "react-native";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AddProductToCart } from "~/redux/CartReducer/actions";

import { STORE_ADDRESS } from "~/utils/config";
import { HTML_PATTERN }  from "~/utils/patterns";
import { ListAnimation } from "./animation";

import OurText from "~/components/OurText";
import OurImage from "~/components/OurImage";
import OurTextButton from "~/components/OurTextButton";
import OurActivityIndicator from "~/components/OurActivityIndicator";
import GalleryImg from "~/components/Gallery";
import OurPicker from "~/components/OurPicker";
import OurCounter from "~/components/OurCounter";
import OurImageSlider from "~/components/OurImageSlider";
import styles from "./styles";
import client from "~/apollo";
import { MUTATION_UPDATE_ITEM_QUANTITY } from "~/apollo/queries";
import SyncStorage from "sync-storage";
import { ShowLoginModal } from "~/redux/ModalReducer/actions";
import OurIconButton from "~/components/OurIconButton";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons/faCartPlus";


const totalHeight = Dimensions.get("window").height;
const itemWidth = Dimensions.get("window").width;
const itemHeight = totalHeight / 2 + 16;
const itemHeight2 = itemHeight + 16;

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999;

/** Список товаров той или иной категории */
const ProductsItem = (props) => {
    const { data, y, index, name, imageUrl, navigation } = props;
    const { t } = useTranslation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(MIN_QUANTITY);

    const [gradStart, gradEnd] = ['#499eda', '#2454e5'];

    const state = useSelector(state=>state);
    const dispatch = useDispatch();

    const url = data?.image?.sourceUrl;

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Обрабатываем нажатие на кнопку "Купить"
    const buyProduct = (e) => {
        const auth = SyncStorage.get("auth");
        const refresh = SyncStorage.get("refresh-auth");

        if ( !refresh && !auth ) {
            ShowLoginModal(dispatch, navigation);
            return;
        }
        //                                               Обрабатываем количество
        dispatch(AddProductToCart(data.databaseId, name, Math.clamp(quantity, MIN_QUANTITY, MAX_QUANTITY), setLoading));
    };

    const onQuantityChange = (quantity) => {
        if ( typeof quantity === "string" )
            quantity = Number(quantity.replace(/[^0-9]/g, ''));

        setQuantity(Math.clamp(quantity, MIN_QUANTITY, MAX_QUANTITY));
    };

    const [translate, scale, opacity] = ListAnimation(y, totalHeight, itemHeight2, itemWidth, index);

    return (
        <Animated.View style={[styles.mainContainer]}>
            <TouchableOpacity onPress={() => navigation.navigate("ProductInfo", { name, imageUrl: url, id: data.databaseId })}>
            <View style={styles.titleContainer}>
                <OurText style={styles.title}>{name}</OurText>
            </View>
            </TouchableOpacity>
            <View style={styles.infoContainer}>
                <View style={styles.infoTopContainer}>
                    <OurImage url={url} disabled={true} />
                </View>
                <View style={styles.infoMiddleContainer}>
                    <View style={styles.counterContainer}>
                        <OurText style={styles.infoPrice} translate={true}>productQuantity</OurText>
                        <OurCounter maxLength={3} onChange={onQuantityChange} value={quantity} color={gradStart}/>
                    </View>
                </View>
                <View style={styles.infoBottomContainer}>
                    <OurText style={styles.infoPrice}
                             params={{
                                 price: ( data.price === 0 || !data.price ) ? t("productFree") : data.price
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
