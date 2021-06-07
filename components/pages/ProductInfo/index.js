import React, { useLayoutEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useDispatch } from "react-redux";
import { ShowLoginModal } from "~/redux/ModalReducer/actions";
import { AddProductToCart } from "~/redux/CartReducer/actions";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { QUERY_GET_PRODUCT } from "~/apollo/queries";

import { faCartPlus } from "@fortawesome/free-solid-svg-icons/faCartPlus";
import { HeaderBackButton, HeaderCartButton } from "~/components/Header";
import OurActivityIndicator from "~/components/OurActivityIndicator";
import OurText from "~/components/OurText";
import OurImage from "~/components/OurImage";
import OurIconButton from "~/components/OurIconButton";
import OurCounter from "~/components/OurCounter";
import OurVariationPicker from "~/components/OurVariationPicker";
import OurPagerView from "~/components/OurPagerView";

import SyncStorage from "sync-storage";
import styles from "./styles";
import { PRICE_PATTERN } from "~/utils/patterns";


const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999;
const QUANTITY_CHANGE_DELAY = 1500;

const ProductInfo = (props) => {
    const { navigation } = props;
    const { name, id, imageUrl, quant } = props.route.params;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [buyLoading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(quant || MIN_QUANTITY);
    const [quantityTimer, setQuantityTimer] = useState(null);
    const [variation, setVariation] = useState(null);
    const [abortController, setAbortController] = useState(new AbortController());

    const [images, setImages] = useState([imageUrl]);

    const [gradStart, gradEnd] = ["#ff6a00", "#ee0979"];

    const { loading, error, data, refetch, networkStatus } = useQuery(QUERY_GET_PRODUCT, {
        variables: { id: String(id) },
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: true,
        context: {
            fetchOptions: {
                signal: abortController.signal,
            },
        },
        onCompleted: (data) => {
            const newImages = [imageUrl];
            data.product.galleryImages.nodes.forEach(node => newImages.push(node.sourceUrl));
            setImages(newImages);
            setQuantity(Math.clamp(quantity, MIN_QUANTITY, variation?.stockQuantity || data?.product?.stockQuantity || MAX_QUANTITY));
        },
        onError: (err) => {
            console.log("Error while fetching product data", error)
        }
    });

    useLayoutEffect( () => {
        navigation.setOptions({
            headerLeft: ()=><HeaderBackButton navigation={navigation}/>,
            headerCenter: ()=>null,
            headerRight: ()=><HeaderCartButton navigation={navigation}/>,
            headerStyle: {
                backgroundColor: gradStart,
            },
        });
    }, [navigation]);

    const validateQuantity = (quantity) => {
        if ( typeof quantity === "string" )
            quantity = Number(quantity.replace(/[^0-9]/g, ''));

        quantity = Math.clamp(quantity, MIN_QUANTITY, variation?.stockQuantity || data?.product?.stockQuantity || MAX_QUANTITY);
        setQuantity(quantity);
        return quantity;
    };

    // Обрабатываем нажатие на кнопку "Купить"
    const buyProduct = (e) => {
        if ( loading || buyLoading ) return;

        const auth = SyncStorage.get("auth");
        const refresh = SyncStorage.get("refresh-auth");

        if ( !refresh && !auth ) {
            ShowLoginModal(dispatch, navigation);
            return;
        }
        //                                   Обрабатываем количество
        dispatch(AddProductToCart(id, name, validateQuantity(quantity), setLoading, variation));
    };

    const onQuantityChange = (quantity) => {
        if ( quantity !== 0 )
            setQuantity(quantity);

        if ( quantityTimer )
            clearTimeout(quantityTimer);

        setQuantityTimer(setTimeout(() => validateQuantity(quantity), QUANTITY_CHANGE_DELAY));
    };

    const productPrice = data?.product?.price?.split(PRICE_PATTERN);
    const variationPrice = variation?.price?.split(PRICE_PATTERN);

    const RenderProductData = () => {
        return (
            <>
                <View style={styles.descriptionContainer}>
                    <OurText style={styles.descriptionTitle} translate={true}>productDescription</OurText>
                    <OurText style={styles.description}>{data?.product?.description || t("productNoDescription")}</OurText>
                </View>
                <View style={styles.attributeContainer}>
                {
                    data?.product?.variations ?
                        <OurVariationPicker productName={name} productId={id} data={data?.product?.variations?.nodes} model={[variation, setVariation]} />
                    :
                        <></>
                }
                </View>
                <View style={styles.counterContainer}>
                    <OurText style={styles.quantity} translate={true}>productQuantity</OurText>
                    <OurCounter maxLength={3} onChange={onQuantityChange} value={quantity} color={gradEnd}/>
                </View>
                <View style={styles.bottomContainer}>
                    <OurText style={styles.price}
                             params={{
                                 price: ( !data?.product?.price && !variation ) ? t("productFree") : variation ? (parseFloat(variationPrice && variationPrice[1] || productPrice[1]) * parseInt(quantity)) + ( variationPrice && variationPrice[4] || productPrice[4]) : (parseFloat(productPrice[1]) * parseInt(quantity) ) + productPrice[4]
                             }}>productPrice</OurText>
                    <OurIconButton style={styles.buyButtonContanier}
                                   icon={faCartPlus}
                                   color={gradEnd}
                                   size={32}
                                   textStyle={{ color: gradStart }}
                                   onPress={buyProduct} />
                </View>
            </>
        );
    };

    return (
        <>
            <LinearGradient
                style={styles.background}
                locations={[0, 1.0]}
                colors={[gradStart, gradEnd]} />
            <ScrollView contentContainerStyle={styles.mainContainer}>
                <View style={styles.productNameContainer}>
                    <OurText style={styles.productName}>{name}</OurText>
                    <OurPagerView style={styles.sliderContainer}
                                  horizontal={true}>
                        {
                            images.map(url =>
                                <View style={styles.productImageContainer}
                                      key={url}>
                                    <OurImage
                                        url={url}
                                        style={styles.productImage}
                                        disabled={true}
                                    />
                                </View>
                            )
                        }
                    </OurPagerView>
                </View>
                <View style={styles.productInfoContainer}>
                    {
                        loading || buyLoading || error || networkStatus.refetch ?
                            <OurActivityIndicator abortControllerModel={[abortController, setAbortController]} error={error} doRefresh={refetch} containerStyle={styles.loadingIndicator}/>
                        :
                            RenderProductData()
                    }
                </View>
            </ScrollView>
        </>
    );
};

export default ProductInfo;