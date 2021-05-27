import React, { useLayoutEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import PagerView from "react-native-pager-view";
import OurText from "~/components/OurText";
import OurImage from "~/components/OurImage";
import { HeaderBackButton, HeaderCartButton, HeaderTitle } from "~/components/Header";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";
import { useQuery } from "@apollo/client";
import { QUERY_GET_PRODUCT } from "~/apollo/queries";
import OurActivityIndicator from "~/components/OurActivityIndicator";
import OurPicker from "~/components/OurPicker";
import OurTextButton from "~/components/OurTextButton";
import { useTranslation } from "react-i18next";
import SyncStorage from "sync-storage";
import { ShowLoginModal } from "~/redux/ModalReducer/actions";
import { AddProductToCart } from "~/redux/CartReducer/actions";
import { useDispatch } from "react-redux";

const ProductInfo = (props) => {
    const { navigation } = props;
    const { name, id, imageUrl } = props.route.params;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [images, setImages] = useState([imageUrl]);

    const [gradStart, gradEnd] = ["#ec65e8", "#fc67fa"];

    const { loading, error, data, refetch } = useQuery(QUERY_GET_PRODUCT, {
        variables: { id: String(id) },
        context: {
            fetchOptions: {
                //signal: abortController.signal,
            },
        },
        onCompleted: (data) => {
            const newImages = [imageUrl];
            data.product.galleryImages.nodes.forEach(node => newImages.push(node.sourceUrl));
            setImages(newImages);
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

    // Обрабатываем нажатие на кнопку "Купить"
    const buyProduct = (e) => {
        const auth = SyncStorage.get("auth");
        const refresh = SyncStorage.get("refresh-auth");

        if ( !refresh && !auth ) {
            ShowLoginModal(dispatch, navigation);
            return;
        }
        //                                               Обрабатываем количество
        dispatch(AddProductToCart(id, name, Math.clamp(quantity, MIN_QUANTITY, MAX_QUANTITY), setLoading));
    };

    const RenderProductData = () => {
        return (
            <>
                <View style={styles.descriptionContainer}>
                    <OurText style={styles.descriptionTitle}>Описание</OurText>
                    <OurText style={styles.description}>{data.product.description}</OurText>
                </View>
                <View style={styles.attributeContainer}>
                    {
                        data.product.attributes.nodes.length !== 0 ?
                            data.product.attributes.nodes.map( (attr, i) => {
                                return <OurPicker data={attr} key={attr.attributeId}/>
                            })
                            :
                            <></>
                    }
                </View>
                <View style={styles.bottomContainer}>
                    <OurText style={styles.description}
                             params={{
                                 price: ( data.price === 0 || !data.price ) ? t("productFree") : data.price
                             }}>productPrice</OurText>
                    <OurTextButton style={styles.buyButtonContanier}
                                   textStyle={{ color: gradStart }}
                                   translate={true}
                                   onPress={(e) => buyProduct(e)}
                    >productBuy</OurTextButton>
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
            <ScrollView contentContainerStyle={styles.mainContainer} >
                <View style={styles.productNameContainer}>
                    <OurText style={styles.productName}>{name}</OurText>
                    <PagerView style={styles.sliderContainer} showPageIndicator={true}>
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
                            )}
                    </PagerView>
                </View>
                <View style={styles.productInfoContainer}>
                    {
                        loading ?
                            <OurActivityIndicator containerStyle={styles.loadingIndicator}/>
                        :
                            RenderProductData()
                    }
                </View>
            </ScrollView>
        </>
    );
};

export default ProductInfo;