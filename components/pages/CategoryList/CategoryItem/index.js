import React from "react";
import { View } from "react-native";

import { STORE_ADDRESS } from "~/utils/config";

import OurImage from "~/components/OurImage";
import styles from "./styles";


/**Компонент категории */
const CategoryItem = (props) =>
{
    // Получаем имя, url картинки, навигацию и id из props
    const { name, imageUrl, navigation, id, cached } = props;
    const url = imageUrl ? `${STORE_ADDRESS}wp-content/uploads/${imageUrl}` : null;

    // Переходим к списку продуктов
    const onPress = (e) => {
        navigation.navigate("ProductList", {currentCategory:{id, name} });
    };

    return (
        <View style={styles.view}>
            <OurImage
                style={styles.picture}
                titleStyle={styles.title}
                url={url}
                title={name}
                onPress={onPress}
                disabled={cached}
            />
        </View>
    );
};

export default CategoryItem;