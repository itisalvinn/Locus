import React, {Component} from 'react';
import { StyleSheet, Text, TextInput, View, Button, AsyncStorage, Alert } from 'react-native';
import {authDetect, authLogin, authSignUp} from "../firebase";

class LoginScreen extends Component {
  state = {
    email: '',
    password: '',
  };

  componentDidMount() {
    AsyncStorage.getItem('userEmail').then(val => {
      if (val) {
        this.setState({ email: val });
      }
    });
  }

  onLoginPress = async () => {
    if (!this.state.email || !this.state.password) {
      Alert.alert("Error", "No email or password");
      return;
    }
    authLogin(
      this.state.email,
      this.state.password, (x) => x,
      (err) => alert(`Could not login :(`)
    );
    authDetect(this.onLoginSuccess);
    await AsyncStorage.setItem('userEmail', this.state.email);
  }

  onSignUpPress = async () => {
    if (!this.state.email || !this.state.password) {
      Alert.alert("Error", "No email or password");
      return;
    }
    authSignUp(
      this.state.email,
      this.state.password, this.onLoginSuccess,
      (err) => alert(`Could not sign up with ${this.state.email}`)
    );
    await AsyncStorage.setItem('userEmail', this.state.email);
  }

  onLoginSuccess = () => {
    alert("Successfully logged in!!!");
  }

  onSignUpPress = () => {
    alert("Successfully signed up!!!");
  }

  handleChange = key => val => {
    this.setState({ [key]: val });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
            placeholder="Email"
            style={styles.input}
            value={this.state.email}
            onChangeText={this.handleChange('email')}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={this.state.password}
            onChangeText={this.handleChange('password')}
          />
        <Button onPress={this.onLoginPress} title="Login" />
        <Button onPress={this.onSignUpPress} title="Sign up" />
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: '90%',
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
  }
});