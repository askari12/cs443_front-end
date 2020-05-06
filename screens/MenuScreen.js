import React from 'react'
import { View, Text, BackHandler, TouchableOpacity , FlatList, Alert} from 'react-native'
import basicStyle from '../StyleSheets'
import specificStyle from '../StyleSheets/MenuStyle'

import UrlView from '../Components/UrlView'
import AnimatedLoader from 'react-native-animated-loader';

import config from '../Config/dev.json';
import window from '../Config/Base64';

import * as FileSystem from 'expo-file-system';
import axios from 'axios'

import JSONbig from 'json-bigint'

import { StackActions, NavigationActions } from 'react-navigation';

export default class MainPage extends React.Component {

    // Constructor
    constructor(props) {
        super(props);

        var randDict = [];
       
        this.state = {
            data: randDict,

            user_id: "",

            loaderVisibility: false,

            menuEmpty: true,
        }

        this.goToNewURL = this.goToNewURL.bind(this);
        this.goToURLAnalytics = this.goToURLAnalytics.bind(this);
        this.goToLogin = this.goToLogin.bind(this);
        this.goToSettings = this.goToSettings.bind(this);

        this.deleteUserId = this.deleteUserId.bind(this);
        this.readFromFile = this.readFromFile.bind(this);
    }

    // Navigation Options
    static navigationOptions = {
        headerShown: false,
    }

    // Component Life Cycle 

    onFocusFunction = () => {
        // do some stuff on every screen focus
        BackHandler.addEventListener("hardwareBackPress" , this.disableBackAction);

        this.setState({loaderVisibility: true});
        this.readFromFile().then (res => {
            
            this.setState({user_id: res});

            // Add URL data
            axios({
            	method: "get",
            	url: config.url_mapping_api + "/url/user/getAll/" + res,
                headers: { 
				    authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
			    },
                transformResponse: data => JSONbig.parse(data),
            })
            .then(res => {
                const result = res.data;
                
                var randDict = [];

                console.log(result);
                for (var i = 0 ; i < result.length ; i++) {
                    randDict.push( { 'URL': result[i].shortUrl , 'exDate': result[i].terminated_at.slice(0, 10) , 'longUrl' : result[i].longUrl , 'id' : result[i]._id , 'createdAt': result[i].created_at , 'terminatedAt': result[i].terminated_at});
                }

                var menuEmpty = this.state.menuEmpty;
                
                if (randDict.length > 0) {
                    menuEmpty = false;
                }

                this.setState({loaderVisibility: false});
                this.setState({data: randDict , menuEmpty: menuEmpty});               

                console.log(randDict);

            })
            .catch(err =>{

                console.log(err);
                
                Alert.alert(
					"Server Error",
					"We are sorry for the inconvenince...",
					[{
						text: 'Try Again'
					}],
					{ cancelable: false}
                );
                
                this.setState({loaderVisibility: false});
            });


		});    
    }

    async componentDidMount() {

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.onFocusFunction()
          })
    }

    // and don't forget to remove the listener
    componentWillUnmount () {
        this.focusListener.remove();
    }

    // Methods

    // Navigation Methods
    disableBackAction = () => {
        return true;
    }

    goToNewURL() {
        this.props.navigation.navigate('NewURL');
    }

    goToURLAnalytics() {
        this.props.navigation.navigate('UrlAnalytics');
    }

    goToLogin() {
        this.deleteUserId();
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    goToSettings() {
        this.props.navigation.navigate('Settings');
    }

    deleteUserId = async () => {
        let fileUri = FileSystem.documentDirectory + config.user_id_store;
		await FileSystem.deleteAsync(fileUri , { encoding: FileSystem.EncodingType.UTF8 });
    }

    readFromFile = async() => {
	
		let fileUri = FileSystem.documentDirectory + config.user_id_store;  
        let ans = await FileSystem.readAsStringAsync(fileUri , { encoding: FileSystem.EncodingType.UTF8 });
        return ans;
		
	}

    // Render Method
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.menuContainer}>

                    <AnimatedLoader visible={this.state.loaderVisibility}          overlayColor="rgba(255,255,255,0.75)"          animationStyle={{width: 100 , height: 100}}          speed={1}        />
                    <View style= {styles.topBar} >
                        {/* <Text style={styles.logoText}>LINKLY</Text> */}
                        
                        <TouchableOpacity style={styles.barBtn} onPress={this.goToSettings} >
                            <Text style={styles.text}>Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.barBtn} onPress={this.goToNewURL} >
                            <Text style={styles.text}>New URL</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.barBtn} onPress={this.goToLogin} >
                            <Text style={styles.text}>Sign Out</Text>
                        </TouchableOpacity>

                    </View>

                    { !this.state.menuEmpty  &&
                    <FlatList 

                        numColumns={2}
                        keyExtractor= {(item) => item.URL}
                        data= {this.state.data}
                        renderItem={({item}) => (
                            <View style={styles.menuFlatList}>
                               <UrlView URL={item.URL} exDate={item.exDate} longUrl={item.longUrl} id={item.id} createdAt={item.createdAt} terminatedAt={item.terminatedAt} userId={this.state.user_id} navigation={this.props.navigation} />
                            </View>
                        )}
                    />
                    }

                    { this.state.menuEmpty &&

                    <View style={styles.menuEmptyTextContainer}>
                        <Text style={styles.menuText}>
                            Welcome to LINKLY !
                        </Text>

                        <Text style={styles.menuText}>
                            Create a New Url to populate this page !
                        </Text>
                    </View>

                    }

                    
                </View>
            </View>
        );
    }	
} 

const styles = { ...basicStyle , ...specificStyle };