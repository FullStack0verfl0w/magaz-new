import React, { useLayoutEffect } from "react";
import { ScrollView } from "react-native";

import { MarkdownView } from "react-native-markdown-view";
import { HeaderTitle } from "~/components/Header";
import { HeaderStyle } from "~/utils/config";
import styles from "./styles";
import { LinearGradient } from "expo-linear-gradient";

const MarkdownPage = (props) => {
	const { navigation } = props;

	const { markdown, title } = props.route.params;

	const [gradStart, gradEnd] = ["#cfd9df", "#e2ebf0"];

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: () => <HeaderTitle title={title}/>,
			headerRight: null,
			headerStyle: HeaderStyle(gradStart),
		})
	}, [navigation])

	return (
		<>
			<LinearGradient
				style={styles.background}
				locations={[0, 1.0]}
				colors={[gradStart, gradEnd]}/>
			<ScrollView contentContainerStyle={styles.scrollViewContainer}>
				{
					markdown ?
						<MarkdownView>
							{markdown}
						</MarkdownView>
					:
						<></>
				}
			</ScrollView>
		</>
	);
};

export default MarkdownPage;