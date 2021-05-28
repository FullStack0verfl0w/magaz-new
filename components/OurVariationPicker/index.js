import React, { useEffect } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import OurText from "~/components/OurText";

import styles from "./styles";
import OurImage from "~/components/OurImage";


const VariationPicker = (props) => {
    const { productName, productId, data } = props;
    const [variation, setVariation] = props.model;

    useEffect(() => {
        console.log("VARIATION IS", variation)
        if ( !variation )
            setVariation({
                name: data[0].name,
                price: data[0].price,
                id: data[0].databaseId,
            });
    }, []);

    const RenderVariation = (v) => {
        const id = v.databaseId;
        const name = v.name;
        const price = v.price;
        const image = v.image.sourceUrl;
        const disabled = variation && variation.id === id;


        const onPress = (e) => {
            setVariation({
                name,
                price,
                id,
            });
        };

        return (
            <TouchableOpacity style={styles.variationContainer}
                              disabled={disabled}
                              activeOpacity={!disabled ? 0 : 1}
                              onPress={onPress}
                              key={id}>
                <OurImage style={[styles.variationImage, disabled ? styles.variationImageActive : null]}
                          url={image}
                          disabled={true} />
                <OurText style={[styles.variationName, disabled ? styles.variationNameActive : null]}>{name.replace(`${productName} - `, "")}</OurText>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <OurText style={styles.variationTitle} translate={true}>productVariations</OurText>
            <ScrollView style={{paddingBottom: 12}} contentContainerStyle={styles.variations} horizontal={true} pinchGestureEnabled={true }>
            {
                data && data.map(RenderVariation)
            }
            </ScrollView>
        </View>
    );
};

export default VariationPicker;