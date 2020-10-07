import React, {useContext, useState, useEffect} from "react";
import { View, TouchableOpacity, Dimensions, Animated } from "react-native";
import styles from "./styles";
import config from "../../../../config";
import { stateContext, dispatchContext } from "../../../../contexts";
import PickerModal from 'react-native-picker-modal-view';
import OurText from "../../../OurText";
import OurImage from "../../../OurImage";
import PickerButton from "../../../PickerButton";
import { useTranslation } from "react-i18next";
import Modal from 'react-native-modal';

import {
    AddToCart,
    ComputeTotalPrice,
} from "../../../../actions";
import OurTextButton from "../../../OurTextButton";
const address = config.getCell("StoreAddress");

const totalHeight = Dimensions.get("window").height 
export const itemHeight = totalHeight / 2;




const AttrPicker = (props) =>
{
    const {data, onValueChange} = props;
    const items = data.options.map( (v, i) => { return {Name: v, Value: v, Id: i} });
    const [selected, setSelected] = useState(items[0]);

    return (
        <>
            <OurText style={{color:  "#FFF", fontWeight: "bold", marginTop: 15,}}>{data.name}</OurText>

            <PickerModal
                renderSelectView={(disabled, sel, showModal) =>
                    <PickerButton
                        disabled={disabled}
                        onPress={showModal}>{selected.Name || ""}</PickerButton>
                }
                onSelected={(val) => {
                    if ( val && Object.keys(val).length !== 0 ) {
                        setSelected(val);

                        if (onValueChange)
                            onValueChange(val);
                    }
                }}
                items={items}
                showToTopButton={true}
                selected={selected}
                backButtonDisabled={true}
                showAlphabeticalIndex={true}
                autoGenerateAlphabeticalIndex={true}
                requireSelection={false}
                autoSort={false}
            />
        </>
    )
};

const AttrPickersParent = (props) =>
{
    const {data} = props;
    return (
        <>
            {data.map( (v, i) =>
            {
                return <AttrPicker data={v} key={i}/>
            })}
        </>
    )
};

/** Список товаров той или иной категории */
const ProductsItem = (props) =>
{
    const {data, y, index, name, galleryImg, imageUrl} = props;
    const state = useContext(stateContext);
    const dispatch = useContext(dispatchContext);
    const itemAttributes = data?.attributes?.nodes || [];
    const {t} = useTranslation();
    const url = data?.image?.mediaDetails?.file ? `${address}wp-content/uploads/${data?.image?.mediaDetails?.file}` : null;

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Обрабатываем нажатие на кнопку "Купить"
    const buyProduct = (e, data) => {
        
        const count = 1;
        const price = data.price ? data.price.match(/\d{1,5}.*\d*/)[0] : 0;
        const itemsTotalPrice = count * price;
        
        // Заносим данные
        let payload = {
            productId: data.productId,
            name: data.name,
            count: count,
            price: price,
            itemsTotalPrice: count * price,
            stockQuantity: data.stockQuantity || 99,
            selectedVariants: [
                "variantID",
            ],
            imageLink: data.image?.mediaDetails?.file,
        };
        // Добавляем в корзину
        dispatch(AddToCart(payload, dispatch, t));
        dispatch(ComputeTotalPrice());
    };

    const position = Animated.subtract(index * itemHeight, y);
    const isDisappearing = -itemHeight;
    const isTop = 0;
    const isBottom = totalHeight - itemHeight;
    const isAppearing = totalHeight;
    const translateY = Animated.add(
        Animated.add(
        y,
        y.interpolate({
            inputRange: [0, 0.00001 + index * itemHeight],
            outputRange: [0, -index * itemHeight],
            extrapolateRight: "clamp",
        })
        ),
        position.interpolate({
        inputRange: [isBottom, isAppearing],
        outputRange: [0, -itemHeight / 4],
        extrapolate: "clamp",
        })
    );
    const scale = position.interpolate({
        inputRange: [isDisappearing, isTop, isBottom, isAppearing],
        outputRange: [0.5, 1, 1, 0.5],
        extrapolate: "clamp",
    });
    const opacity = position.interpolate({
        inputRange: [isDisappearing, isTop, isBottom, isAppearing],
        outputRange: [0.5, 1, 1, 0.5],
    });


    return (
        <Animated.View style={[styles.container, {height: itemHeight}, { opacity, transform: [{ translateY }, { scale }] }]}>

            <OurText style={styles.title}>{name}</OurText>
            <View style={styles.card}>
                <View style={styles.left}>
                    <OurImage onPress={toggleModal} url={url} />
                    <Modal isVisible={isModalVisible}>
                        <OurImage
                            url={galleryImg}
                        />
                        <TouchableOpacity style={styles.modal_button} onPress={toggleModal}>
                            <OurText style={styles.text_button}>Close</OurText>
                        </TouchableOpacity>
                    </Modal>
                </View>
                    
                        <View style={styles.right}>
                            <AttrPickersParent data={itemAttributes}/>
                         </View>
            </View>
            <View style={styles.left_bottom}>
                {
                    galleryImg && galleryImg.length ?
                        <OurImage
                        style={styles.picture_bottom}
                        url={galleryImg}
                        /> : <></>
                }
            </View>
            <View style={styles.bottom}>
                <OurText style={styles.price} params={{
                    price: ( data.price === 0 || !data.price ) ? t("productFree") : data.price
                }}>productPrice</OurText>
                <OurTextButton
                    style={styles.button}
                    textStyle={styles.textButton}
                    translate={true}
                    onPress={(e) => buyProduct(e, data)}
                >productBuy</OurTextButton>
            </View>
            <View>
                <OurText style={styles.descriptionText}>{data.description?.replace(/<\/*.+?\/*>/gi, "") || ""}</OurText>
            </View>
        </Animated.View>
            

    );
};

export default React.memo(ProductsItem);