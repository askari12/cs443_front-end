import { StyleSheet } from 'react-native'

const style = StyleSheet.create({
    
    // Container
    urlContainer: {
        alignItems:"center",
        justifyContent:"center",
        padding: 10, 
        borderWidth: 5,
        borderColor: "#0d47a1",
        backgroundColor: "white",
    },

    // Views
    urlBtnView: {
        flexDirection: "row",
        width: "90%",
        justifyContent: "center"
    },

    // Text
	text:{
        color:"black",
    }, 
    
    // Button
    urlShareBtn: {
        width:"60%",
		backgroundColor:"#428bca",
		borderRadius:25,
		height:30,
		alignItems:"center",
		justifyContent:"center",
		marginTop:10,
		marginBottom:5
    },
});

export default style;