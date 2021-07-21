import React, { useEffect } from "react";
import SyncStorage from "sync-storage";
import { useDispatch, useSelector } from "react-redux";

import { LayoutAnimation, TouchableOpacity, View } from "react-native";
import { faBoxOpen, faChevronLeft, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { Badge } from 'native-base';
import { ShowModal } from "~/redux/ModalReducer/actions";

import OurActivityIndicator from "~/components/OurActivityIndicator";
import OurText from "~/components/OurText";
import OurIconButton from "~/components/OurIconButton";
import styles from "./styles.js";
import { useNavigation } from "@react-navigation/core";

export const HeaderBackButton = (props) => {
	const navigation = useNavigation();
	const dispatch = useDispatch();

	const goBack = (e) => {
		if ( !navigation.canGoBack() && SyncStorage.get("auth") ) {
			const data = {
				title: { text: "logoutTitle", params: {} },
				text: { text: "", params: {} },
				animationIn: "bounceInDown",
				animationOut: "bounceOutUp",
				buttons: [
					{
						text: "cancel",
						textStyle: {
							color: "#383838",
						},
					},
					{
						text: "ok",
						onPress: () => {
							SyncStorage.set("user-uuid", null);
							SyncStorage.set("auth", null);
							SyncStorage.set("refresh-auth", null);
							SyncStorage.set("auth-expires-at", null);
							navigation.navigate("LoginPage");
						},
					},
				]
			};
			dispatch(ShowModal(data));
		} else
			navigation.goBack();
	};

	return (
		<View style={styles.container}>
			<OurIconButton icon={faChevronLeft} size={49} onPress={goBack}/>
		</View>
	);
};

export const HeaderTitle = (props) => {
	const { title, onPress, style } = props;

	const doPress = (e) => {
		if ( onPress )
			onPress(e);
	};

	return (
		<View style={styles.container}>
			<View style={styles.titleContainer}>
				<TouchableOpacity activeOpacity={onPress ? 0.2 : 1} onPress={doPress}>
					<OurText style={[styles.title, style]} translate={true}>{title}</OurText>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const easeInEaseOut = LayoutAnimation.create(
	200,
	LayoutAnimation.Types.easeInEaseOut,
	LayoutAnimation.Properties.scaleY,
);

export const HeaderCartButton = (props) => {
	const navigation = useNavigation();
	const state = useSelector(state => state.cartReducer);

	const goToCart = (e) => {
		navigation.navigate("Cart");
	};

	useEffect(() => {
		// LayoutAnimation.configureNext(easeInEaseOut);
	}, [state.total]);

	return (
		<View style={styles.container}>
			<View style={styles.cartContainer}>
				<View style={styles.iconCart}>
					<OurIconButton icon={faShoppingBasket} size={50} onPress={goToCart}>
						{
							state.productList?.size || state.loading ?
								<Badge success style={styles.badge}>
									{
										state.loading ?
											<OurActivityIndicator size={20} oneState={true}/>
											:
											<OurText style={styles.badgeText}>
												{
													state?.productList?.size ?
														(() => {
															if ( state.productList.size < 19 )
																return state.productList.size;
															else
																return "99+";
														})()
														: <></>
												}
											</OurText>
									}
								</Badge>
								: <></>
						}
					</OurIconButton>
					{
						state.total ?
							<OurText style={styles.priceText}>
								{state.total}
							</OurText>
							:
							<></>
					}
				</View>
			</View>
		</View>
	);
};

export const HeaderOrdersButton = (props) => {
	const navigation = useNavigation();
	const state = useSelector(state => state);

	const goToOrders = (e) => {
		navigation.navigate("Orders");
	};

	return (
		<View style={styles.container}>
			<View style={styles.cartContainer}>
				<View style={styles.iconCart}>
					<OurIconButton icon={faBoxOpen} size={50} onPress={goToOrders}>
						{
							state?.orders?.size ?
								<Badge success style={styles.badge}>
									<OurText style={styles.badgeText}>
										{
											state?.orders?.size ?
												(() => {
													if ( state.orders.size < 10 )
														return state.orders.size;
													else
														return "9+";
												})()
												: <></>
										}
									</OurText>
								</Badge>
								: <></>
						}
					</OurIconButton>
				</View>
			</View>
		</View>
	);
};


/** Шапочка приложения с навигацией*/
const Header = (props) => {
	const navigation = useNavigation();
	const navState = navigation.dangerouslyGetState()
	const currentScreen = navState.routes[navState.index];

	return (
		<View style={styles.mainContainer}>
			{
				SyncStorage.get("auth") ?
					<HeaderBackButton/>
					:
					<HeaderTitle title={"categoryListTitle"}/>
			}
			{
				SyncStorage.get("auth") ?
					<HeaderTitle title={navigation.canGoBack() ? `${currentScreen.name}Title` : "categoryListTitle"}/>
					:
					<></>
			}
			<HeaderCartButton/>
		</View>
	);
};

export default React.memo(Header);