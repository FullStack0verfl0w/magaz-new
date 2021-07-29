import React, { useState } from "react";
import { View } from "react-native";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import OurTextField from "~/components/OurTextField";
import OurIconButton from "~/components/OurIconButton";
import styles from "~/components/OurPasswordField/styles";

const OurPasswordField = (props) => {
	const { model } = props;

	const [toggleSecure, setToggleSecure] = useState(true);

	const validateForm = (value) => {
		return value.trim() !== "";
	};

	const changeSecure = () => {
		setToggleSecure(value => !value);
	};

	return (
		<View style={styles.mainContainer}>
			<OurTextField   placeholder="registerPageFormPassword"
							autoCapitalize="none"
							autoCompleteType="password"
							secureTextEntry={toggleSecure}
							onValidate={validateForm}
							model={model} />
			<OurIconButton style={styles.eye} onPress={changeSecure} size={32} icon={toggleSecure ? faEyeSlash : faEye} />
		</View>
	);
};

export default OurPasswordField;