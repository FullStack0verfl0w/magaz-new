import React, { useState, useEffect } from "react";
import { AppRegistry } from "react-native";
import { loadAsync } from "expo-font";
import { expo } from "./app.json";
import { createDBTables } from "./utils/db_handler";
import SyncStorage from "sync-storage";

import "react-native-get-random-values";
import "./i18n";
import "./utils";

import Main from "./Main";
import LoadingScreen from "./components/pages/LoadingScreen";

const fonts = {
	"Gilroy-Black": require("./assets/fonts/Gilroy-Black.ttf"),
	"Gilroy-BlackItalic": require("./assets/fonts/Gilroy-BlackItalic.ttf"),
	"Gilroy-Bold": require("./assets/fonts/Gilroy-Bold.ttf"),
	"Gilroy-BoldItalic": require("./assets/fonts/Gilroy-BoldItalic.ttf"),
	"Gilroy-ExtraBold": require("./assets/fonts/Gilroy-ExtraBold.ttf"),
	"Gilroy-ExtraBoldItalic": require("./assets/fonts/Gilroy-ExtraBoldItalic.ttf"),
	"Gilroy-Heavy": require("./assets/fonts/Gilroy-Heavy.ttf"),
	"Gilroy-HeavyItalic": require("./assets/fonts/Gilroy-HeavyItalic.ttf"),
	"Gilroy-Light": require("./assets/fonts/Gilroy-Light.ttf"),
	"Gilroy-LightItalic": require("./assets/fonts/Gilroy-LightItalic.ttf"),
	"Gilroy-Medium": require("./assets/fonts/Gilroy-Medium.ttf"),
	"Gilroy-MediumItalic": require("./assets/fonts/Gilroy-MediumItalic.ttf"),
	"Gilroy-Regular": require("./assets/fonts/Gilroy-Regular.ttf"),
	"Gilroy-RegularItalic": require("./assets/fonts/Gilroy-RegularItalic.ttf"),
	"Gilroy-SemiBold": require("./assets/fonts/Gilroy-SemiBold.ttf"),
	"Gilroy-SemiBoldItalic": require("./assets/fonts/Gilroy-SemiBoldItalic.ttf"),
	"Gilroy-Thin": require("./assets/fonts/Gilroy-Thin.ttf"),
	"Gilroy-ThinItalic": require("./assets/fonts/Gilroy-ThinItalic.ttf"),
	"Gilroy-UltraLight": require("./assets/fonts/Gilroy-UltraLight.ttf"),
	"Gilroy-UltraLightItalic": require("./assets/fonts/Gilroy-UltraLightItalic.ttf"),
};

const App = () => {
	const [loaded, setLoaded] = useState(false);

	const initApp = async () => {
		await SyncStorage.init();
		console.log("SyncStorage initialized.");
		await createDBTables();
		console.log("Database initialized.");
		await loadAsync(fonts);
		console.log("Fonts loaded.");

		setLoaded(true);
	};
	useEffect( () => {
		initApp();
	}, []);

	return (
		loaded ?
			<Main/>
		:
			<LoadingScreen />
	);
};

AppRegistry.registerComponent(expo.name, App, null);

export default App;