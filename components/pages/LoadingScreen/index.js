import React from "react";
import { View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import OurActivityIndicator from "~/components/OurActivityIndicator";
import styles from "./styles";

const LoadingScreen = (props) => {
	const [gradStart, gradEnd] = ["#cbc903", "#ff0042"];

	return (
		<>
			<LinearGradient
				style={styles.background}
				locations={[0, 1]}
				colors={[gradStart, gradEnd]}/>
			<View style={styles.mainContainer}>
				<OurActivityIndicator/>
			</View>
		</>
	);
};

export default LoadingScreen;