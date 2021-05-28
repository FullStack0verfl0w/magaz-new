import React from "react";
import { FlatList } from "react-native";

const OurPagerView = (props) => {
    const { style, contentContainerStyle, children, horizontal } = props;

    const renderItem = ({ item }) => {
        return item;
    };

    return (
        <FlatList style={style}
                  contentContainerStyle={contentContainerStyle}
                  horizontal={horizontal}
                  pagingEnabled={true}
                  persistentScrollbar={true}
                  data={children?.length ? children : [children]}
                  renderItem={renderItem}/>
    )
};

export default OurPagerView;