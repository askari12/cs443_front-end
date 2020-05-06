import { StyleSheet } from 'react-native'

const style = StyleSheet.create({ 

    // Containers
    analyticsContainer: {
        width: "100%",
        height: "100%",
    },
    analyticsBottomContainer: {
        width: "100%",
        height: "100%",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
                
    },
    analyticsGraphContainer: {
        height: "40%",
        flexDirection: "row" ,
        width:"90%" ,
        backgroundColor: "white" ,
        borderWidth: 5,
        borderRadius: 25,
        borderColor: "#0d47a1",
        padding: 10
    },
    analyticsGraphXContainer: {
        flexDirection: "column" , 
        width: "90%" , 
        height: "100%" ,
    },
    analyticsBtnContainer:{
        flexDirection: "row",
    },
    analyticsDataBtnContainer:{
        flexDirection: "row",
        width: "90%",
        height: 50,
        alignItems: "center",

    },

    // Views
    urlInfoText: {
        backgroundColor: "white",
        width: "90%",
        height: 150,
        borderRadius: 25,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 5,
        borderColor: "#0d47a1",
        justifyContent: "space-evenly"

    },
    analyticsTextScrollView: {
        height: 20, 
        flexDirection: "row",
        width: "95%",        
    },
    analyticsTextInputView:{
        height: 20,
        flexDirection: "row",
    },
    urlBtnView: {
        width: "90%",
    },
    
    // Text
    anaylticsText: {
        fontWeight: "bold"
    },

    // Text Input
    anaylticsTextInput: {
    },

    // Button
    analyticsBtn: {
        width:"50%",
		backgroundColor:"#428bca",
		borderRadius:25,
		height:25,
		alignItems:"center",
		justifyContent:"center",
    },
    analyticsBtnPressed: {
        width:"50%",
		backgroundColor:"red",
		borderRadius:25,
		height:25,
		alignItems:"center",
		justifyContent:"center",
    },

});

export default style;