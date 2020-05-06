import { StyleSheet } from 'react-native'

const style = StyleSheet.create({
    
    // Container
    settingsContainer: {
        width: "100%",
        height: "100%",
    },
    settingsInputContainer: {
        width: "100%",
        height: "100%",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
                
    },
    settingsBtnContainer: {
        flexDirection: "row",
    },

    // LOGO
    settingsLogo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#b71c1c",
        marginBottom:40
    },

    // View
    settingsPasswordView: {
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    
    // Button
    settingsBtn: {
        width:"45%",
		backgroundColor:"#428bca",
		borderRadius:25,
		height:50,
		alignItems:"center",
		justifyContent:"center",
    },
});

export default style;