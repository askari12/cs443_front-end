import React from 'react'
import { View , Text , TouchableOpacity } from 'react-native'
import { LineChart, XAxis, Grid , YAxis} from 'react-native-svg-charts'

import basicStyle from '../StyleSheets'
import specificStyle from '../StyleSheets/AnalyticStyle'
import { ScrollView, TextInput } from 'react-native-gesture-handler'

import axios from 'axios'
import config from '../Config/dev.json'

export default class Analytics extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            longUrl: this.props.navigation.getParam('longUrl'),
            shortUrl: this.props.navigation.getParam('shortUrl'),
            expirationDate: this.props.navigation.getParam('expirationDate'),
            id: this.props.navigation.getParam('id'),

            edit: false
        }

        // Bind Methods
        this.goBackToMenu = this.goBackToMenu.bind(this);
        this.toggleEditMode = this.toggleEditMode.bind(this);
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

    // Toggle Edit Mode
    toggleEditMode() {        
        
        // Previously the state was Set To edit
        // Try to save the edit Values here
        if (this.state.edit) {
            axios({
            	method: "put",
            	url: config.url_mapping_api + "/url/update/" + this.state.id,
            	headers: {},
            })
            .then(res => {
                const result = res.data;
                
            })
            .catch( err => {
                
            });
        }

        this.setState({edit: !this.state.edit});
    }

    // Render Method
    render() {

        const data = [ 50, 10, 40, 95, 4, 24, 85, 91, 35, 53, 53, 24, 50, 20, 80 ];
        const contentInset = { top: 10, bottom: 10 }

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
                                    Long URL : 
                                </Text>

                            

                                <ScrollView horizontal={true}>
                                    { !this.state.edit && 
                                    <Text style={styles.anaylticsText} >
                                        {" " + this.state.longUrl}
                                    </Text>
                                    }   


                                    { this.state.edit && 
                                    <TextInput style={styles.anaylticsTextInput}
                                        value={this.state.longUrl}
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
                                        value={this.state.shortUrl}
                                    />
                                    }
                                </ScrollView>

                            
                            </View>


                            <Text style={styles.anaylticsText} >
                                Expiration Date : {this.state.expirationDate}
                            </Text>

                            <TouchableOpacity style={styles.analyticsBtn} onPress={this.toggleEditMode} >
                                
                                { !this.state.edit &&
                                <Text style={styles.text}>Edit</Text>
                                }

                                { this.state.edit &&
                                <Text style={styles.text}>Save</Text>
                                }
                            </TouchableOpacity>


                        </View>

                        <View style={styles.analyticsGraphContainer}>
                            <YAxis
                                data={ data }                 
                                contentInset={ contentInset }
                                svg={{
                                    fill: 'black',
                                    fontSize: 10,
                                }}
                                style={{marginLeft: 5}}
                                numberOfTicks={ 10 }
                                formatLabel={ value => `${value}` }
                            />

                            <View style= {styles.analyticsGraphXContainer}>
                                
                                <LineChart
                                    style={{ flex: 1, marginLeft: 16 }}
                                    data={ data }
                                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                                    contentInset={ contentInset }
                                >
                                    <Grid/>
                                </LineChart>
                                <XAxis
                                    data={ data }
                                    min={1}
                                    formatLabel={ (value, index) => index }
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