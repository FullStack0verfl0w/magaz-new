import React, {useState, useContext} from "react";
import { LayoutAnimation, Platform, UIManager, View, StyleSheet, TextInput, Text, Dimensions, Button, TouchableOpacity, ScrollView } from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import { stateContext, dispatchContext } from "../../contexts";


import OurText from "../OurText";

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flexDirection: "row",
    },
    textDelivery: {
        color: '#fff',
        paddingBottom: 10,
        bottom: 45,   
    },
    text: {
        color: '#fff',
        fontWeight: "normal",
        marginRight: 10,   
        left: 0,
        right: 0,
        textAlign: 'center',
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        width: 90,
        marginLeft: 16,
        opacity: 0.7,
        bottom: 42,
    },
    text_input: {
        height: 20,
        borderBottomWidth: 1,
        borderColor: "#fff",
        color: "#fff",
        maxWidth: 310,
        flexGrow: 1,
        
    },
    grad: {
        //height: Dimensions.get("window").height,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    main: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
       

    },
    data: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: 300,
    },
    header: {
        marginBottom: 20,
        bottom: 60,
    },
    Buttons: {
       top: 90,
    },
    button_back: {
        paddingHorizontal: 4,
        paddingVertical: 6,
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: '#ffffff',
        left: -110,
        width: Dimensions.get("window").width,
        marginBottom: 15,
        top: 40,
        width: 150,

    },
    button_go: {
       
        paddingHorizontal: 4,
        paddingVertical: 6,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: '#ffffff',
        //position: "absolute",
        left: 110,
        marginBottom:10,
        top: -6,
        width: 150,
    },    
    text_button: {
        color: "#961EC4",
        
    }, 
    time: {
        bottom: 18,
    }, 
    UpHeader: {
        color: '#fff',
    },
    text_info: {
        
        color: "#fff",
    }
});

const TextField = (props)=>{

    const [isFocused, setFocus] = useState(false);
    
    const [text, setText] = useState("");
    

    

    return (
                <View style={styles.container}>
                    <OurText style={{...styles.text, top: (isFocused||text)?-20:0, opacity: (isFocused||text)?0.7:1}} >{props.text}</OurText>
                    <TextInput value={text} onChangeText={(e)=>{setText(e)}} style={styles.text_input} onFocus={()=>{setFocus(true);LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);}} onBlur={()=>{setFocus(false);LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);}} ></TextInput>
                </View>
    )   

}



/** Компонент списка заказов */
const Editor = (props) =>
{

    const state = useContext(stateContext);
    const dispatch = useContext(dispatchContext);
    const { navigation } = props;

    return (
        <>
        <LinearGradient style={styles.grad} locations={[0, 1.0]} colors={["#931DC4", "#F33BC8"]}/>
        
        <View style={styles.main}>
            <View style={styles.header}>
                <OurText style={styles.textDelivery}>Редактор заказов</OurText>
                <View style={styles.line}></View>
		    </View>
            <View style={styles.data}>
                <OurText style={styles.text_info}>Имя: {state.deliveryDetails["name"]}</OurText>
                <OurText style={styles.text_info}>Телефон: {state.deliveryDetails["phone"]}</OurText>
                <OurText style={styles.text_info}>Адрес: {state.deliveryDetails["address"]}</OurText>
                <OurText style={styles.text_info}>Этаж: {state.deliveryDetails["floor"]}</OurText>
                <OurText style={styles.text_info}>Примечания: {state.deliveryDetails["notes"]}</OurText>
                <OurText style={styles.text_info}>Когда привезти: {state.deliveryDetails["when"]}</OurText>      
            </View>
            <View style={styles.Buttons}>
                   <TouchableOpacity style={styles.button_back} onPress={()=>{navigation.navigate('DeliveryDetails')}}>
                        <OurText style={styles.text_button}>Редактировать</OurText>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.button_go} onPress={()=>{navigation.navigate('Orders')}}>
                         <OurText style={styles.text_button}>разместить заказ</OurText>
                   </TouchableOpacity>
            </View>
        </View>    
        </>       
    );
}

export default Editor;