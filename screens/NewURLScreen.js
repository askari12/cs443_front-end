import React from 'react'
import { View , Text, TextInput , TouchableOpacity , Alert } from 'react-native'

import basicStyle from '../StyleSheets/'
import specificStyle from '../StyleSheets/NewURLStyle'

import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import config from '../Config/dev.json';
import window from '../Config/Base64';
import axios from 'axios';

export default class NewURL extends React.Component {

    constructor(props) {
        super(props);

        const DAYS_AHEAD = 14; 

        var date = new Date();
        date.setDate(date.getDate() + DAYS_AHEAD);

        var max_date = new Date();
        max_date.setFullYear(max_date.getFullYear() + 1);

        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
       
        this.readFromFile().then(res=> {
            this.setState({user_id: res});
        });

        this.state = {        
            longUrl: "",
            shortUrl: "",
            expirationDate: date,

            max_date: max_date,
            months: months,

            user_id: "",
            
            show: false
        }

        // Bind Methods
        this.goBackToMenu = this.goBackToMenu.bind(this);

        this.readFromFile = this.readFromFile.bind(this);
        this.handleInputs = this.handleInputs.bind(this);
        this.openDatePicker = this.openDatePicker.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    // Navigation Options
    static navigationOptions = {
        headerShown: false,
    }

    // Methods

    // Navigation Methods
    goBackToMenu(){
        this.props.navigation.navigate("Menu");
    }

    // Handle Inputs
    handleInputs(btnType) {

        var userId = this.state.user_id;

        var longUrl = this.state.longUrl;
        var shortUrl = this.state.shortUrl;
        var expirationDate = this.state.expirationDate;
        var currentDate = new Date();

        var expirationDate = expirationDate.getFullYear() + "-" +
                        ("00" + (expirationDate.getMonth() + 1)).slice(-2) + "-" +
                        ("00" + expirationDate.getDate()).slice(-2) + " " +
                        
                        ("00" + expirationDate.getHours()).slice(-2) + ":" +
                        ("00" + expirationDate.getMinutes()).slice(-2) + ":" +
                        ("00" + expirationDate.getSeconds()).slice(-2);

    
        var currentDate = currentDate.getFullYear() + "-" +
                        ("00" + (currentDate.getMonth() + 1)).slice(-2) + "-" +
                        ("00" + currentDate.getDate()).slice(-2) + " " +
                        
                        ("00" + currentDate.getHours()).slice(-2) + ":" +
                        ("00" + currentDate.getMinutes()).slice(-2) + ":" +
                        ("00" + currentDate.getSeconds()).slice(-2);

        
        // Inputs are empty
        if (longUrl === "" || (btnType === "custom" && shortUrl === "")) {
            Alert.alert(
                "Creating Failed",
                "Inputs Should not be empty.",
                [{
                    text: 'Try Again'
                }],
                { cancelable: false}
            );
            return;
        } 
        
        // Check if Short URL is 10 characters Long
        if (btnType !== "random" && shortUrl.length != 10) {
            Alert.alert(
                "Creating Failed",
                "Short URL should be 10 characters long.",
                [{
                    text: 'Try Again'
                }],
                { cancelable: false}
            );
            return;
        }

        if (btnType === "random"){
            shortUrl = "";
        }

        // Call the Server
        axios({
			method: "post",
			url: config.url_mapping_api + "/url/create",
			headers: { 
				authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
			},
			data: {
				shortUrl: shortUrl,
                longUrl: "http://" + longUrl,
                user_id: userId,
                created_at: currentDate,
                terminated_at: expirationDate
			}
		})
		.then(res => {
            const result = res.status;
            
            // Success !
            Alert.alert(
				"SUCCESS !",
				"Link Created !",
				[{
					text: 'LINKLY'
				}],
				{ cancelable: false}
            );
            
            this.goBackToMenu();
        })
        .catch(error => {
            
            // Display Alert error
            Alert.alert(
				"Failed",
				"The Short URL is already Taken",
				[{
					text: 'Try Again'
				}],
				{ cancelable: false}
			);

        });
        


    }

    // Read from file
    readFromFile = async() => {	
		let fileUri = FileSystem.documentDirectory + config.user_id_store;
        let ans = await FileSystem.readAsStringAsync(fileUri , { encoding: FileSystem.EncodingType.UTF8 });
        return ans; 
	}

    // Date Picker Methods
    openDatePicker() {
        this.setState({show: true});
    }
    
    onChange(event, selectedDate) {
        const currentDate = selectedDate || this.state.expirationDate;
        this.setState({expirationDate: currentDate, show: false});
    }


    // Render Method
    render() {
        return (
            <View style={styles.container} >

                <View style={styles.newUrlContainer} >

                    <View style= {styles.topBar} >
                            <Text style={styles.logoText}>LINKLY</Text>

                            <TouchableOpacity style={styles.barBtn} onPress={this.goBackToMenu}>
                                <Text style={styles.text}>Go Back</Text>
                            </TouchableOpacity>

                    </View>

                    <View style={styles.newUrlBottomContainer} >
                        <View style= {styles.longURLInput} >

                            <Text style={styles.newUrltext}>
                                HTTP://
                            </Text>

                            <TextInput  
                                    style={styles.newURLInputText}
                                    placeholder="Enter The Long URL..." 
                                    placeholderTextColor="#003f5c"
                                    onChangeText={text => this.setState({longUrl:text})}
                                    />

                        </View>

                        <View style={styles.shortURLInput} >

                            <TextInput  
                                style={styles.newURLInputText}
                                placeholder="Enter A Short URL..." 
                                placeholderTextColor="#003f5c"
                                maxLength={10}
                                onChangeText={text => this.setState({shortUrl:text})}
                                />

                            <TouchableOpacity style={styles.newURLBtn} onPress={() =>{this.handleInputs("custom")}} >
                                <Text style={styles.text}>Generate Custom URL</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.datePickerInput} >

                            <View style={styles.displayDate}>

                                <Text style={styles.newUrltext}>
                                    {this.state.expirationDate.getDate()}
                                </Text>

                                <Text style={styles.newUrltext}>
                                    {this.state.months[this.state.expirationDate.getMonth()]}
                                </Text>

                                <Text style={styles.newUrltext}>
                                    {this.state.expirationDate.getFullYear()}
                                </Text>


                            </View>

                            <TouchableOpacity style={styles.newURLBtn} onPress={this.openDatePicker}>
                                <Text style={styles.text}>Select Expiry Date</Text>
                            </TouchableOpacity>

                        </View>

                        { this.state.show &&
                        
                        <DateTimePicker
                            testID="dateTimePicker"
                            timeZoneOffsetInMinutes={0}
                            value={this.state.expirationDate}
                            mode={"date"}
                            is24Hour={true}
                            display="default"
                            onChange={this.onChange}
                            minimumDate={new Date()}
                            maximumDate={this.state.max_date}
                            />
                        }
                        
                        <TouchableOpacity style={styles.newURLBtn} onPress={() => { this.handleInputs("random")}}>
                            <Text style={styles.text}>Generate Random URL</Text>
                        </TouchableOpacity>

                    </View>
                    

                </View>

            </View>
        );
    }

}

const styles = { ...basicStyle , ...specificStyle };