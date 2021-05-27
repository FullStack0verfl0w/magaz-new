import React from "react";

import { ApolloProvider } from '@apollo/client';
import client from "./apollo";

import { Provider } from "react-redux";
import store from "./redux/store";

import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";

import AppStackNavigator from "./Navigation";
import OurModal from "./components/OurModal";
import OurToast from "./components/OurToast";

enableScreens();

const Main = () => {

	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<NavigationContainer>
					<AppStackNavigator/>
				</NavigationContainer>
				<OurModal/>
				<OurToast/>
			</Provider>
		</ApolloProvider>
	);
};


export default Main;