import { Animated } from "react-native";

export const ListAnimation = (y, totalHeight, itemHeight, itemWidth, index) => {
	const position = Animated.subtract(index * itemHeight, y);
	const isDisappearing = -itemHeight;
	const isTop = 0;
	const isBottom = totalHeight - itemHeight;
	const isAppearing = totalHeight;
	const translate = Animated.add(
		Animated.add(
			y,
			y.interpolate({
				inputRange: [0, 0.00001 + index * itemHeight],
				outputRange: [0, -index * itemHeight],
				extrapolateRight: "clamp",
			})
		),
		position.interpolate({
			inputRange: [isBottom, isAppearing],
			outputRange: [0, -itemHeight / 4],
			extrapolate: "clamp",
		})
	);
	const scale = position.interpolate({
		inputRange: [isDisappearing, isTop, isBottom, isAppearing],
		outputRange: [0.5, 1, 1, 0.5],
		extrapolate: "clamp",
	});
	const opacity = position.interpolate({
		inputRange: [isDisappearing, isTop, isBottom, isAppearing],
		outputRange: [0.0, 1, 1, 0.0],
	});

	return [translate, scale, opacity]
};