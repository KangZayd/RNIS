import React from 'react'
import {View,Text, AsyncStorage} from 'react-native'
import {Actions} from 'react-native-router-flux'

const onLogout = () => {
  AsyncStorage.setItem('token', '')
  Actions.login()
}

export default class Main extends React.Component{
  render(){
    return(
      <View style={{flex:1}} >
        <Text  onPress={onLogout.bind(this)} >Logout</Text>
      </View>
    )
  }
}
