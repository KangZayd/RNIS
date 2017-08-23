import React from 'react'

import {
  View, StyleSheet,
  Text, TextInput,
  TouchableNativeFeedback,
  TouchableOpacity, Platform,
  ActivityIndicator, AsyncStorage
} from 'react-native'

import {graphql, gql} from 'react-apollo'
import {Actions} from 'react-native-router-flux'

const isEmpty = (value) => value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0)

const signinUser = gql`
  mutation($email:String!,$password:String!){
    signinUser(email:{email:$email,password:$password}){
      token
    }
  }
`

const email = ''
const password = ''

class LoginForm extends React.Component{
  constructor(props){
    super(props)
    this.state ={
      loading: false
    }
  }

  render(){
    const Button = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity
    const animating = this.state.loading

    AsyncStorage.getItem('token').then((value) => {
      if (!isEmpty(value)) {
        Actions.main()
      }
    }).done()

    if (this.state.loading) {
      return(
      <ActivityIndicator
        animating={animating}
        size='large'
        style={{flex:1,justifyContent:'center', alignItems:'center',height:80}}/>
        )
    }
    return (
      <View style={styles.container} >
        <Text style={styles.textContent}>InstaReact</Text>
        <View style={styles.containerForm}>
            <TextInput
              style={styles.inputForm}
              keyboardType='email-address'
              placeholder='Email'
              placeholderTextColor='black'
              underlineColorAndroid={'rgba(0,0,0,0)'}
              onChangeText={(text) => email = text}/>
            <TextInput
              style={styles.inputForm}
              secureTextEntry
              placeholder='Password'
              placeholderTextColor='black'
              underlineColorAndroid={'rgba(0,0,0,0)'}
              onChangeText={(text) => password = text}/>
            <Button
              accessibilityComponentType='button'
              accessibilityLabel='Login'
              disabled={false}
              onPress={this._onLoginClicked.bind(this)}>
              <View style={styles.btnLogin}><Text>Login</Text></View>
            </Button>
            <Button
              accessibilityComponentType='button'
              accessibilityLabel='Register'
              disabled={false}
              onPress={()=>Actions.register()}>
              <View style={styles.btnLogin}><Text>REGISTER</Text></View>
            </Button>
        </View>
      </View>
    )
  }

  _onLoginClicked(){
    if (isEmpty(email)) {
      alert('Email is empty.')
    }else if (password) {
      alert('Password is empty.')
    }else{
      this.setState({loading:true })
      this.props.signinUser({variables:{email, password}})
          .then((response)=>{
            AsyncStorage.setItem('token', response.data.signinUser.token)
            this.setState({loading:false})
            Actions.home()
          }).catch((e) =>{
            this.setState({loading:false})
            console.error(e)
            alert('User login is failed.')
          })
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#673AB7',
    justifyContent:'center'
  },
  textContent:{
    color:'white',
    fontSize:35,
    textAlign:'center',
    marginBottom:15
  },
  containerForm:{
    flex:0,
    paddingLeft:25,
    paddingRight:25
  },
  inputForm:{
    color:'black',
    backgroundColor:'white',
    marginBottom:10
  },
  btnLogin:{
    backgroundColor:'#FF9800',
    padding:10,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10
  }
})

const Login = graphql(signinUser,{name:'signinUser'})(LoginForm)
export default Login
