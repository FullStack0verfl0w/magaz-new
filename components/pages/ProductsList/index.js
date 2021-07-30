import React, { useLayoutEffect, useRef } from "react";
import { Animated, FlatList, SafeAreaView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import { useQuery } from "@apollo/client";
import { QUERY_PRODUCT_LIST } from "~/apollo/queries";
import OurActivityIndicator from "~/components/OurActivityIndicator";
import ProductsItem from './ProductsItem/index';
import styles from "./styles";
import { HeaderStyle } from "~/utils/config";


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const LocallyAnimatedFlatList = ({ data, refreshing, onRefresh, navigation }) => {
	const y = useRef(new Animated.Value(0)).current;
	const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
		useNativeDriver: true,
	});

	const renderProductItem = ({ item, index }) => {
		return (
			<ProductsItem y={y}
						  index={index}
						  id={item.databaseId}
						  data={item}
						  navigation={navigation}
						  name={item.name}
						  imageUrl={item.image?.mediaDetails?.file}/>
		);
	};

	return (
		<AnimatedFlatList
			contentContainerStyle={{ paddingTop: 12 }}
			initialNumToRender={2}
			data={data}
			refreshing={refreshing}
			onRefresh={onRefresh}
			renderItem={renderProductItem}
			keyExtractor={item => String(item.databaseId)}

			{...{ onScroll }}
		/>
	)
};

const MemoedLocallyAnimatedFlatList = React.memo(LocallyAnimatedFlatList);

/**Список товаров той или иной категории */
const ProductsList = (props) => {
	const { navigation } = props;
	const { currentCategory } = props.route.params;
	const abortController = new AbortController();

	const [gradStart, gradEnd] = ['#499eda', '#2454e5'];

	useLayoutEffect(() => {
		navigation.setOptions({
			headerStyle: HeaderStyle(gradStart),
		});
	}, [navigation]);

	const { loading, error, data, refetch } = useQuery(QUERY_PRODUCT_LIST, {
		variables: { categoryId: currentCategory.id },
		context: {
			fetchOptions: {
				signal: abortController.signal,
			}
		},
		onError: (err) => {
			console.log(`Error while fetching products in category ${currentCategory.id}`, error)
		}
	});

	return (
		<>
			<LinearGradient
				style={styles.productList}
				locations={[0, 1.0]}
				colors={[gradStart, gradEnd]}/>
			<SafeAreaView>
			{
				(loading || error || abortController.signal.aborted) ?
					<OurActivityIndicator error={error} abortController={abortController} doRefresh={refetch}
										  buttonTextColor={gradStart}/>
					:
					<MemoedLocallyAnimatedFlatList navigation={navigation} data={data?.products?.nodes}
												   refreshing={loading} onRefresh={() => {
						refetch()
					}}/>
			}
		</SafeAreaView>
		</>
	);
};

export default React.memo(ProductsList);