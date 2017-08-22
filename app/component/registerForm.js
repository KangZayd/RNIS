import React from 'react'

import {
  View, StyleSheet,
  Text, TextInput,
  TouchableNativeFeedback,
  TouchableOpacity, Platform,
  ActivityIndicator, AsyncStorage
} from 'react-native'
import {graphql, gql, compose} from 'react-apollo'
const createUser = gql`
  mutation($email: String!, $password: String!, $name: String!){
    createUser(authProvider:{email:{email: $email, password:$password}},
    name:$name){
      id
    }
  }
`
const signinUser = gql`
  mutation($email:String!,$password:String!){
    signinUser(email:{email:$email,password:$password}){
      token
    }
  }
`
const isEmpty = (value) => value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0)

class RegisterForm extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      name:'',
      email:'',
      password:''
    }
  }
  render(){
    const Button = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity
    const animating = this.state.loading
    if (this.state.loading) {
      return(
      <ActivityIndicator
        animating={animating}
        size='large'
        style={{flex:1,justifyContent:'center', alignItems:'center',height:90}}/>
        )
    }
    return (
      <View style={styles.container} >
        <Text style={styles.textContent}>InstaReact</Text>
        <View style={styles.containerForm}>

            <TextInput
              style={styles.inputForm}
              placeholder='Username'
              placeholderTextColor='black'
              underlineColorAndroid={'rgba(0,0,0,0)'}
              onChangeText={(name)=>this.setState({name:name})}/>

            <TextInput
              style={styles.inputForm}
              keyboardType='email-address'
              placeholder='Email'
              placeholderTextColor='black'
              underlineColorAndroid={'rgba(0,0,0,0)'}
              onChangeText={(email)=>this.setState({email:email})}/>

            <TextInput
              style={styles.inputForm}
              secureTextEntry
              placeholder='Password'
              placeholderTextColor='black'
              underlineColorAndroid={'rgba(0,0,0,0)'}
              onChangeText={(password)=>this.setState({password:password})}/>

            <Button
              accessibilityComponentType='button'
              accessibilityLabel='Login'
              disabled={false}
              onPress={this._onLoginClicked.bind(this)}>
              <View style={styles.btnLogin}><Text>Register</Text></View>
            </Button>
        </View>
      </View>
    )
  }

  _onLoginClicked(){
    const { name, email, password } = this.state
    if (isEmpty(name)) {
      alert('Please input your username.')
    }else if (isEmpty(email)) {
      alert('Please input your email.')
    }else if (isEmpty(password)) {
      alert('Please input your password.')
    }else{
      this.setState({loading:true })
      this.props.createUser({variables:{email,password, name}})
          .then((response)=>{
            this.props.signinUser({variables:{email, password}})
                .then((response)=>{
                  AsyncStorage.setItem('token', response.data.signinUser.token)
                  this.setState({loading:false})
                  alert('User register is success and have loggedin.')
                }).catch((e) =>{
                  this.setState({loading:false})
                  console.error(e)
                  alert('User login is failed.')
                })
          }).catch((e) => {
              this.setState({loading:false})
              console.error(e)
              alert('User register is failed.')
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
const Register = compose(graphql(createUser, {name:'createUser'}),
  graphql(signinUser,{name:'signinUser'})
)(RegisterForm)
export default Register
