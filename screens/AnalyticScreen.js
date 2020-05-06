import React from 'react'
import { View , Text , TouchableOpacity , Alert } from 'react-native'
import { AreaChart, LineChart, XAxis, Grid , YAxis} from 'react-native-svg-charts'

import basicStyle from '../StyleSheets'
import specificStyle from '../StyleSheets/AnalyticStyle'
import { ScrollView, TextInput } from 'react-native-gesture-handler'

import axios from 'axios';
import config from '../Config/dev.json';
import window from '../Config/Base64';

import * as scale from 'd3-scale'

import { StackActions, NavigationActions } from 'react-navigation';

export default class Analytics extends React.Component {

    constructor(props) {
        super(props);

        const weeklydataX = [];
        const weeklydataY = [];
        const monthlyDataX = [];
        const monthlyDataY = [];

        for (var i = 0; i <= 14 ; i++) {
            weeklydataY[i] = 0;
            weeklydataX[i] = "";
            if (i <= 12) {
                monthlyDataX[i] = 0;
                monthlyDataY[i] = "";
            }
        }
        const contentInset = { top: 10, bottom: 10 }

        this.state = {
            longUrl: this.props.navigation.getParam('longUrl').substring(7),
            shortUrl: this.props.navigation.getParam('shortUrl'),
            expirationDate: this.props.navigation.getParam('expirationDate'),
            terminatedAt: this.props.navigation.getParam('terminatedAt'),
            id: this.props.navigation.getParam('id'),
            createdAt: this.props.navigation.getParam('createdAt'),
            totalClicks: "0",

            userId: this.props.navigation.getParam('userId'),

            contentInset: contentInset,

            dataX: weeklydataX,
            weeklyDataX: weeklydataX,
            monthlyDataX: monthlyDataX,
            
            dataY: weeklydataY,
            weeklyDataY: weeklydataY,
            monthlyDataY: monthlyDataY,
            
            weeklyBtn: true,
            monthlyBtn: false,

            prevLongUrl: this.props.navigation.getParam('longUrl').substring(7),
            prevShortUrl: this.props.navigation.getParam('shortUrl'),

            edit: false
        }

        // Bind Methods
        this.goBackToMenu = this.goBackToMenu.bind(this);
        this.toggleEditMode = this.toggleEditMode.bind(this); 
        this.deleteMapping = this.deleteMapping.bind(this);   
        this.toggleData = this.toggleData.bind(this);
        this.cancelButton = this.cancelButton.bind(this);   
    }

    // Navigation Options
    static navigationOptions = {
        headerShown: false,
    }

    // Methods
    componentDidMount() {
        this.getData();
    }

    // Navigation Methods
    goBackToMenu(){
        this.props.navigation.navigate("Menu");
    }

    // Toggle Edit Mode
    toggleEditMode() { 
        
        var longUrl = this.state.longUrl;
        var shortUrl = this.state.shortUrl;
        var terminatedAt = this.state.terminatedAt;
        var createdAt = this.state.createdAt;
        var userId = this.state.userId;
        var repeatedShortUrl = false;

        if (shortUrl === this.state.prevShortUrl) {
            repeatedShortUrl = true;
        }    

        // Previously the state was Set To edit
        // Try to save the edit Values here

        if (this.state.edit) {
            axios({
            	method: "put",
            	url: config.url_mapping_api + "/url/update/" + this.state.id,
                headers: { 
				    authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
			    },
            	data: {
                    "_id": 0,
                    "shortUrl": shortUrl,
                    "longUrl": "http://" + longUrl,
                    "user_id": userId,
                    "created_at": createdAt,
                    "terminated_at": terminatedAt
                }
            })
            .then(res => {
                const result = res.data;
                Alert.alert(
                    "Updated Successfully !",
                    "Way To Go !",
                    [{
                        text: 'LINKLY'
                    }],
                    { cancelable: false}
                );

                if (repeatedShortUrl) {
                    
                    var longUrl = this.state.longUrl;
                    var shortUrl = this.state.shortUrl;
                    var terminatedAt = this.state.terminatedAt;
                    var createdAt = this.state.createdAt;
                    var userId = this.state.userId;
                    
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
                            created_at: createdAt,
                            terminated_at: terminatedAt
                        }
                    })
                    .then(res=> {
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Menu' })],
                        });
                        this.props.navigation.dispatch(resetAction);

                    });
                }

                else {
                    axios({
                        method: "put",
                        url: config.analytics_api + "/analytics/update/" + this.state.prevShortUrl,
                        headers: { 
                            authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
                        },
                        data: {
                            shortURL: this.state.shortUrl,   
                        }
                    })
                    .then(res=> {
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Menu' })],
                        });
                        this.props.navigation.dispatch(resetAction);
                    });
                }        
            })
            .catch( err => {

                console.log(err);

                Alert.alert(
                    "Update Failed",
                    "It seems this URL is already taken..",
                    [{
                        text: 'LINKLY'
                    }],
                    { cancelable: false}
                );
            });
        }

        this.setState({edit: !this.state.edit});
    }

    // Delete the Mapping
    deleteMapping() {

        axios({
            method: "delete",
            url: config.url_mapping_api + "/url/delete/" + this.state.id,
            headers: { 
				authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
			}
        })
        .then(res => {
            const result = res.data;

            console.log(result);

            Alert.alert(
                "Deleted Successfully !",
                "Make More Links !",
                [{
                    text: 'LINKLY'
                }],
                { cancelable: false}
            );

            // Delete the Analytics URL
            axios({
            method: "delete",
                url: config.analytics_api + "/analytics/delete/" + this.state.shortUrl,
                headers: { 
                    authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
                }
            })
            .then(res=> {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Menu' })],
                });
                this.props.navigation.dispatch(resetAction);
            });
        })
        .catch( err => {

            console.log(err);

            Alert.alert(
                "Delete Failed",
                "Try Again..",
                [{
                    text: 'LINKLY'
                }],
                { cancelable: false}
            );
        });
        this.setState({edit: !this.state.edit});
    }

    // Get Analytics Data
    getData(){
        axios({
            method: "get",
            url: config.analytics_api + "/analytics/biweekly/" + this.state.shortUrl,
            headers: { 
				authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
			}
        })
        .then(res=> {
            var result = res.data;

            if (typeof(result) === "string") {
                // Data is still Null
                console.log(result);
            } else {
                var tempDataY = [];
                var tempDataX = [];

                const startDate = new Date(result.date_from);

                for (var i = 0 ; i < 14 ; i++) {

                    var d = new Date(startDate)
                    d.setDate(startDate.getDate() + i );

                    tempDataY[i] = result.data[i];

                    if (i % 5 == 0)
                        tempDataX[i] = d.toLocaleDateString() ;
                    else 
                        tempDataX[i] = "";
                }
                this.setState({dataX: tempDataX, dataY: tempDataY, weeklyDataY: tempDataY ,weeklyDataX: tempDataX})
            }
        });

        axios({
            method: "get",
            url: config.analytics_api + "/analytics/monthly/" + this.state.shortUrl,
            headers: { 
				authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
			}
        })
        .then(res=> {
            var result = res.data;
            if (typeof(result) === "string") {
                // Data is still Null
                console.log(result);
            } else {

                var tempDataY = [];
                var tempDataX = [];
    
                const startDate = new Date(result.date_from);
    
                for (var i = 0 ; i < 12 ; i++) {
    
                    var d = new Date(startDate)
                    d.setDate(startDate.getDate() + i );
    
                    tempDataY[i] = result.data[i];
    
                    if (i % 5 == 0)
                        tempDataX[i] = d.toLocaleDateString() ;
                    else 
                        tempDataX[i] = "";
                }
    
                this.setState({monthlyDataX: tempDataX , monthlyDataY: tempDataY})
            }
        });

        axios({
            method: "get",
            url: config.analytics_api + "/analytics/all/" + this.state.shortUrl,
            headers: { 
				authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
			}
        })
        .then(res=> {
            var result = res.data;
            console.log(result);

            if (typeof(result) === "string") {
                // Data is still Null
                console.log(result);
            } else {
                
                this.setState({totalClicks: result})
            }
        });
    }

    toggleData(btn) {
        if (btn === "w") {
            this.setState({weeklyBtn: true , monthlyBtn: false , dataX: this.state.weeklyDataX , dataY: this.state.weeklyDataY});
        } else {
            this.setState({weeklyBtn: false , monthlyBtn: true , dataX: this.state.monthlyDataX , dataY: this.state.monthlyDataY});
        }
    }

    cancelButton() {
        this.setState({shortUrl: this.state.prevShortUrl , longUrl: this.state.prevLongUrl , edit: !this.state.edit});
    }

    // Render Method
    render() {

        return (
            <View style={styles.container}>

                <View style={styles.analyticsContainer}>

                    <View style= {styles.topBar} >
                        <Text style={styles.logoText}>LINKLY</Text>

                        <TouchableOpacity style={styles.barBtn} onPress={this.goBackToMenu}>
                            <Text style={styles.text}>Go Back</Text>
                        </TouchableOpacity>

                    </View>


                    
                    <View style={styles.analyticsBottomContainer} >
                        <View style= {styles.urlInfoText} >


                            <View style={styles.analyticsTextScrollView}>

                                <Text style={styles.anaylticsText}>
                                    Long URL : http://
                                </Text>

                                <ScrollView horizontal={true}>
                                    { !this.state.edit && 
                                    <Text style={styles.anaylticsText} >
                                        {" " + this.state.longUrl}
                                    </Text>
                                    }   

                                    { this.state.edit && 
                                    <TextInput style={styles.anaylticsTextInput}
                                        value={this.state.longUrl} onChangeText={text => this.setState({longUrl:text})}
                                    />
                                    }
                                </ScrollView>

                            
                            </View>

                            <View style={styles.analyticsTextScrollView}>

                                <Text style={styles.anaylticsText}>
                                    Short URL : 
                                </Text>

                            

                                <ScrollView horizontal={true} >
                                    { !this.state.edit && 
                                    <Text style={styles.anaylticsText} >
                                        {" " + this.state.shortUrl}
                                    </Text>
                                    }   


                                    { this.state.edit && 
                                    <TextInput maxLength={10} style={styles.anaylticsTextInput}
                                        value={this.state.shortUrl} onChangeText={text => this.setState({shortUrl:text})} 
                                    />
                                    }
                                </ScrollView>

                            
                            </View>


                            <Text style={styles.anaylticsText} >
                                Expiration Date : {this.state.expirationDate}
                            </Text>

                            <Text style={styles.anaylticsText} >
                                Total Clicks : {this.state.totalClicks}
                            </Text>
                            
                            <View style={styles.analyticsBtnContainer}>
                                <TouchableOpacity style={styles.analyticsBtn} onPress={() => { this.toggleEditMode() }} >
                                    
                                    { !this.state.edit &&
                                    <Text style={styles.text}>Edit</Text>
                                    }

                                    { this.state.edit &&
                                    <Text style={styles.text}>Save</Text>
                                    }
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.analyticsBtn} onPress={() => { if (!this.state.edit) {this.deleteMapping()} else {this.cancelButton()} }} >

                                    { !this.state.edit &&    
                                    <Text style={styles.text}>Delete</Text>
                                    }

                                    { this.state.edit &&    
                                    <Text style={styles.text}>Cancel</Text>
                                    }
                                    
                                </TouchableOpacity>
                            </View>


                        </View>

                        <View style= {styles.analyticsDataBtnContainer} >
                                { this.state.weeklyBtn &&
                                <TouchableOpacity style={styles.analyticsBtnPressed} onPress={() => {this.toggleData("w")}} >
                                    
                                    <Text style={styles.text}>Weekly</Text>
                                    
                                </TouchableOpacity>
                                }

                                { !this.state.weeklyBtn &&
                                <TouchableOpacity style={styles.analyticsBtn} onPress={() => {this.toggleData("w")}} >
                                    
                                    <Text style={styles.text}>Weekly</Text>
                                    
                                </TouchableOpacity>
                                }

                                { this.state.monthlyBtn && 
                                <TouchableOpacity style={styles.analyticsBtnPressed} onPress={() => {this.toggleData("m")}} >
                                    
                                    <Text style={styles.text}>Monthly</Text>
                                    
                                </TouchableOpacity>
                                }

                                { !this.state.monthlyBtn && 
                                <TouchableOpacity style={styles.analyticsBtn} onPress={() => {this.toggleData("m")}} >
                                    
                                    <Text style={styles.text}>Monthly</Text>
                                    
                                </TouchableOpacity>
                                }

                        </View>
                        
                        <View style={styles.analyticsGraphContainer}>
                            <YAxis
                                data={ this.state.dataY }                 
                                contentInset={ this.state.contentInset }
                                svg={{
                                    fill: 'black',
                                    fontSize: 10,
                                }}
                                style={{marginLeft: 5}}
                                numberOfTicks={ 10 }
                                formatLabel={ (value, index) => value }
                            />

                            <View style= {styles.analyticsGraphXContainer}>
                                
                                <LineChart
                                    style={{ flex: 1, marginLeft: 16 }}
                                    data={ this.state.dataY }
                                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                                    contentInset={ this.state.contentInset }
                                >
                                    <Grid/>
                                </LineChart>
                                <XAxis
                                    data={ this.state.dataX }
                                    min={-2}
                                    formatLabel={ (value, index) => this.state.dataX[index] }
                                    scale={ scale.scaleTime }
                                    contentInset={{ left: 10, right: 10 }}
                                    svg={{ fontSize: 10, fill: 'black' }}
                                /> 

                            </View>
                
                           
                        </View>

                    </View>
                </View>

            </View>
        );
    }

}

const styles = { ...basicStyle , ...specificStyle };