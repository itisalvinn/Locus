import React from 'react'
import {StyleSheet, TextInput, View, Alert, AsyncStorage, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native'
import {authSignUp} from "../../firebase";
import {Input, Button, Text} from 'react-native-ui-kitten';
import registerForPushNotificationsAsync from "../QuietHours/NotificationRegistration";
import Constants from 'expo-constants';

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
<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
    <KeyboardAvoidingView style={styles.content} behavior="padding" enabled>
        <Text category='h3' style={styles.text}>Sign Up</Text>
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

        <Button onPress={this.handleSignUp} style={styles.btn}>Sign Up</Button>

        </KeyboardAvoidingView>
          <View style={styles.bottom}>
            <Button
              appearance='outline'
              style={styles.bottom}
              onPress={() => this.props.navigation.navigate('LoginScreen')}
            >Already have an account? Login</Button>
          </View>
        </View>
        </TouchableWithoutFeedback>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  content: {
    justifyContent: 'center',
    height: "100%",
    position: "absolute",
    display: "flex",
    width: "100%",
    alignItems: 'center',
    zIndex: 10,
  },
  textInput: {
    // height: 40,
    width: '80%',
    // borderColor: 'gray',
    // borderWidth: 1,
    marginTop: 8
  },
  bottom: {
    marginVertical: 20,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 11,
  },
  text: {
    marginBottom: 20,
  },
  btn: {
    width: "80%",
  }
})