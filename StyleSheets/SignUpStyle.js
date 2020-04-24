import { StyleSheet } from 'react-native'

const style = StyleSheet.create({
    
    //  Container
    SignUpContainer: {

        width: "100%",
        height: "100%",

        alignItems: "center",
        justifyContent: "center",
    },
    
    // Logo
    SignUpLogo: {
        fontWeight:"bold",
        fontSize:50,
        color:"#b71c1c",
        marginBottom:40
    },

    // View
    SignUpPasswordView: {
        flexDirection: 'row',
        justifyContent: "space-between"
    }

});

export default style;