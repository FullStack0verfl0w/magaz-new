import React, { useEffect, useLayoutEffect } from "react";
import { FlatList, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from "react-redux";
import { FetchOrderList } from "~/redux/OrdersReducer/actions";

import OurText from "~/components/OurText";
import OrderItem from "./OrderItem";
import styles from "./styles"
import { HeaderStyle } from "~/utils/config";


const LocallyAnimatedFlatList = ({ data, navigation, refreshing, onRefresh }) => {
	const renderItemsBlock = ({ item, index }) => <OrderItem navigation={navigation} data={item}/>;

	return (
		<FlatList
			style={styles.flatList}
			data={data}
			renderItem={renderItemsBlock}
			refreshing={refreshing}
			onRefresh={onRefresh}
			keyExtractor={(item, index) => String(index)}
		/>
	)
};

const MemoedLocallyAnimatedFlatList = React.memo(LocallyAnimatedFlatList);

const Orders = (props) => {
	const { navigation } = props;
	const state = useSelector(state => state.ordersReducer);
	const dispatch = useDispatch();

	const [gradStart, gradEnd] = ["#931DC4", "#F33BC8"];

	useEffect(() => {
		if ( !state.loading )
			dispatch(FetchOrderList);
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerStyle: HeaderStyle(gradStart),
		});
	}, [navigation]);

	return (
		<>
			<LinearGradient style={styles.background} locations={[0, 1.0]} colors={[gradStart, gradEnd]}/>
			<View style={styles.mainContainer}>
				{
					state.orderList.size === 0 ?
						<View style={styles.emptyTextContainer}>
							<OurText style={styles.emptyText} translate={true}>ordersEmpty</OurText>
						</View>
						: <></>
				}
				<MemoedLocallyAnimatedFlatList refreshing={state.loading} onRefresh={() => dispatch(FetchOrderList)}
											   navigation={navigation} data={Array.from(state.orderList.values())}/>
			</View>
		</>
	);
};

export default Orders;