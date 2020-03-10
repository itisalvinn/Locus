import React from 'react'
import {StyleSheet, Text, TextInput, View, Button, Alert, AsyncStorage} from 'react-native'
import {authSignUp} from "../../firebase";
import {Input} from 'react-native-ui-kitten';
import registerForPushNotificationsAsync from "../QuietHours/SilenceYourselfThot";


export default class SignUp extends React.Component {
  state = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    errorMessage: null
  }

  handleSignUp = async () => {
    if (!this.state.email || !this.state.password) {
      Alert.alert("Error", "No email or password");
      return;
    }

    authSignUp(
      this.state.email,
      this.state.firstName,
      this.state.lastName,
      this.state.password,
      (uid) => {
        // Generate unique push notification token for user
        registerForPushNotificationsAsync(uid);
        this.props.navigation.navigate('LoadingScreen')
      },
      (err) => {
        console.log(err)
        this.setState({
          errorMessage: "Sign up didn't work..."
        })
      }
    );
    await AsyncStorage.setItem('userEmail', this.state.email);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage &&
        <Text style={{color: 'red'}}>
          {this.state.errorMessage}
        </Text>}

        <Input
          placeholder="First Name"
          autoCapitalize
          style={styles.textInput}
          onChangeText={firstName => this.setState({firstName})}
          value={this.state.firstName}
        />

        <Input
          placeholder="Last Name"
          autoCapitalize
          style={styles.textInput}
          onChangeText={lastName => this.setState({lastName})}
          value={this.state.lastName}
        />

        <Input
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({email})}
          value={this.state.email}
        />

        <Input
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({password})}
          value={this.state.password}
        />

        <Button title="Submit Sign Up" onPress={this.handleSignUp}/>

        <Button
          title="Already have an account? Login"
          style={styles.bottom}
          onPress={() => this.props.navigation.navigate('LoginScreen')}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    // height: 40,
    width: '80%',
    // borderColor: 'gray',
    // borderWidth: 1,
    marginTop: 8
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  }
})