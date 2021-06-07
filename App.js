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
	"Gilroy-ExtraBold": require("./assets/fonts/Gilroy-ExtraBold.ttf"),
	"Gilroy-Light": require("./assets/fonts/Gilroy-Light.ttf"),
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