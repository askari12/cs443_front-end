import { StyleSheet } from 'react-native'

const style = StyleSheet.create({

    // Container
    LoginContainer: {
        height: "100%",
        width: "100%",

        alignItems: "center",
        justifyContent: "center",
    },

    // Logo
    LoginLogo:{
        fontWeight:"bold",
        fontSize:50,
        color:"#b71c1c",
        marginBottom:40
    },

    // Button
    LoginSignUpBtn:{
		width:"80%",
		backgroundColor:"#bf1e2e",
		borderRadius:25,
		height:50,
		alignItems:"center",
		justifyContent:"center",
		marginTop:40,
        marginBottom:10
	}

});

export default style;