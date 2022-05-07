import { StyleSheet } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export const styles = StyleSheet.create({
    formContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: heightPercentageToDP('60%'),
        width: widthPercentageToDP('80%'),
    },
    image: {
        width: 250,
        height: 250,
        alignSelf: 'center'
    },
    inputTransparent: {
        backgroundColor: '#515FD97F'
    },
    buttonLogIn: {
        width: 130,
        height: 130,
        alignSelf: 'center',
        backgroundColor: '#D354547F',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'NotoSans_400Regular',
        color: '#000000FF',
    }
})