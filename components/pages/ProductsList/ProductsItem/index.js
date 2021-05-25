import React, { useState } from "react";
import { View, Dimensions, Animated } from "react-native";

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


const totalHeight = Dimensions.get("window").height;
const itemWidth = Dimensions.get("window").width;
const itemHeight = totalHeight / 2 + 16;
const itemHeight2 = itemHeight + 16;

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999;

/** Список товаров той или иной категории */
const ProductsItem = (props) => {
    const { data, y, index, name, imageUrl } = props;
    const { t } = useTranslation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(MIN_QUANTITY);

    const state = useSelector(state=>state);
    const dispatch = useDispatch();

    const itemAttributes = data?.attributes?.nodes || [];
    const url = data?.image?.mediaDetails?.file ? `${STORE_ADDRESS}wp-content/uploads/${data?.image?.mediaDetails?.file}` : null;
    const images = [url, ...(data?.galleryImages?.nodes.map((obj) => {
        return `${STORE_ADDRESS}wp-content/uploads/${obj?.mediaDetails?.file}`
    }))];

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Обрабатываем нажатие на кнопку "Купить"
    const buyProduct = (e) => {
        //                                               Обрабатываем количество
        dispatch(AddProductToCart(data.databaseId, name, Math.clamp(quantity, MIN_QUANTITY, MAX_QUANTITY), setLoading));
    };

    const onQuantityChange = (quantity) => {
        if ( typeof quantity === "string")
            quantity = Number(quantity.replace(/[^0-9]/g, ''));

        setQuantity(Math.clamp(quantity, MIN_QUANTITY, MAX_QUANTITY));
    };

    const [translate, scale, opacity] = ListAnimation(y, totalHeight, itemHeight2, itemWidth, index);

    return (
        <Animated.View style={[styles.mainContainer]}>
            <View style={styles.titleContainer}>
                <OurText style={styles.title}>{name}</OurText>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.infoTopContainer}>
                    <OurImage url={url}
                              onPress={toggleModal} />
                    <View style={styles.attributesContainer}>
                        {
                            itemAttributes.length !== 0 ?
                                itemAttributes.map( (attr, i) => {
                                    return <OurPicker data={attr} key={i}/>
                                })
                            :
                                <></>
                        }
                    </View>
                    <OurImageSlider data={images} isModalVisible={isModalVisible} toggleModal={toggleModal} />
                </View>
                <View style={styles.infoMiddleContainer}>
                    <GalleryImg data={data?.galleryImages?.nodes}/>

                    <View style={styles.counterContainer}>
                        <OurText style={styles.infoPrice} translate={true}>productQuantity</OurText>
                        <OurCounter maxLength={3} onChange={onQuantityChange} value={quantity} color="#499eda"/>
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
                            <OurTextButton style={styles.buyButton}
                                        textStyle={styles.buyButtonText}
                                        translate={true}
                                        onPress={(e) => buyProduct(e)}
                            >productBuy</OurTextButton>
                        :
                        <OurActivityIndicator oneState={true} size={48} color={"#fff"}/>
                    }
                    </View>
                </View>
            </View>
            <View style={styles.descriptionContainer}>
                <OurText numberOfLines={2} style={styles.descriptionText}>{data.description?.replace(HTML_PATTERN, "") || ""}</OurText>
            </View>
        </Animated.View>
    );
};

export default React.memo(ProductsItem);
