import React, { useEffect } from "react";
import SyncStorage from "sync-storage";
import { StatusBar } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';

import CategoryList from "./components/pages/CategoryList";
import Cart from "./components/pages/Cart";
import ProductList from "./components/pages/ProductsList";
import DeliveryDetails from "./components/pages/DeliveryDetails";
import DeliveryDetailsCheck from "./components/pages/DeliveryDetailsCheck";
import RegisterPage from "./components/pages/RegisterPage";
import LoginPage from "./components/pages/LoginPage";
import Orders from "./components/pages/Orders";
import ProductInfo from "~/components/pages/ProductInfo";
import OrderInfo from "~/components/pages/OrderInfo";
import { isIOS } from "./utils";
import { HeaderBackButton, HeaderCartButton, HeaderTitle } from "./components/Header";
import { HeaderStyle } from "~/utils/config";
import { expo } from "~/app.json";
import { ShowLoginModal, ShowModal } from "~/redux/ModalReducer/actions";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import OurIconButton from "~/components/OurIconButton";
import MarkdownPage from "~/components/pages/MarkdownPage";

import termsAndConditions from "./TermsAndConditions";
import privacyPolicy from "./PrivacyPolicy";
import { LinearGradient } from 'expo-linear-gradient';

const { Navigator, Screen } = createStackNavigator();

const showAppInfo = (navigation, dispatch) => {
	const data = {
		title: { text: expo.name, params: {} },
		text: { text: "appInfo", params: { version: expo.version } },
		animationIn: "bounceInDown",
		animationOut: "bounceOutUp",
		bottomStyle: {
			flexDirection: "column",
			justifyContent: "center",
			alignSelf: "center",
		},
		buttons: [
			{
				onPress: () => {
					navigation.navigate("MarkdownPage", { markdown: termsAndConditions, title: "termsAndConditions" })
				},
				text: "termsAndConditions",
			},
			{
				onPress: () => {
					navigation.navigate("MarkdownPage", { markdown: privacyPolicy, title: "privacyPolicy" })
				},
				text: "privacyPolicy",
			},
			{
				text: "close",
			},
		]
	};
	dispatch(ShowModal(data));
};

/**
 * Стэк навигация
 */
const AppStackNavigator = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		StatusBar.setBarStyle("light-content", true);
	}, []);
	const [gradStart, gradEnd] = ["#cfd9df", "#e2ebf0"];

	return (
		<Navigator
			initialRouteName="CategoryList"
			backBehavior="history"
			mode="modal"
			screenOptions={{
				headerLeftContainerStyle: {
					marginLeft: 16,
				},
				headerLeft: (props) => {
					const { canGoBack } = props;
					const navigation = useNavigation();

					return (
						<>
							{
								SyncStorage.get("auth") || canGoBack ?
									<HeaderBackButton/>
									:
									<HeaderTitle onPress={() => showAppInfo(navigation, dispatch)} title={"CategoryListTitle"}/>
							}
						</>
					);
				},
				headerTitleAlign: "center",
				headerTitle: (props) => {
					const navigation = useNavigation();
					const state = navigation.dangerouslyGetState();
					const currentScreen = state.routes[state.index];

					return (
						<>
							{
								!SyncStorage.get("auth") && !navigation.canGoBack() ?
									<></>
									:
									<HeaderTitle onPress={!navigation.canGoBack() ? () => { showAppInfo(navigation, dispatch) } : null} title={currentScreen?.params?.currentCategory ? currentScreen.params.currentCategory.name : `${currentScreen.name}Title`}/>
							}
						</>
					)
				},
				headerRightContainerStyle: {
					marginRight: 20
				},
				headerRight: () => {
					const navigation = useNavigation();

					return (
						<>
							{
								SyncStorage.get("auth") ?
									<HeaderCartButton/>
									:
									<OurIconButton icon={faSignInAlt} size={50}
												   onPress={() => ShowLoginModal(dispatch, navigation)}/>
							}
						</>
					);
				},
				headerStyle: HeaderStyle(),
			}}
			headerMode={isIOS ? "float" : "screen"}
			defaultNavigationOptions={{
				tabBarVisible: true,
				headerHideShadow: true,
			}}>
			<Screen
				name="RegisterPage"
				component={RegisterPage}/>
			<Screen
				name="LoginPage"
				component={LoginPage}/>
			<Screen
				name={"MarkdownPage"}
				component={MarkdownPage}/>
			<Screen
				name="CategoryList"
				component={CategoryList}/>
			<Screen
				name="Cart"
				component={Cart}/>
			<Screen
				name="ProductList"
				component={ProductList}/>
			<Screen
				name="ProductInfo"
				component={ProductInfo}/>
			<Screen
				name="DeliveryDetails"
				component={DeliveryDetails}/>
			<Screen
				name="DeliveryDetailsCheck"
				component={DeliveryDetailsCheck}/>
			<Screen
				name="Orders"
				component={Orders}/>
			<Screen
				name="OrderInfo"
				component={OrderInfo}/>
		</Navigator>
	);
};

export default AppStackNavigator;