import React, {Component} from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { authLogin, authWithGoogle} from "../../firebase";
import { Input, Button } from 'react-native-ui-kitten';
import Constants from 'expo-constants';

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
      this.state.password,
      this.onLoginSuccess,
      (err) => alert('Could not login: '+err)
    );
    await AsyncStorage.setItem('userEmail', this.state.email);
  }

  signInWithGoogle = () => {
    authWithGoogle(
      this.onLoginSuccess,
      (err) => alert('Could not login: '+ err)
    );
  }

  onLoginSuccess = () => {
    this.props.navigation.navigate('LoadingScreen');
  }

  handleChange = key => val => {
    this.setState({ [key]: val });
  };



  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <KeyboardAvoidingView style={styles.content} behavior="padding" enabled>
            <View>
              <Image
                style={{width: 250, height: 147, marginTop: 100, backgroundColor: 'transparent'}}
                source={require('../../assets/logo_2.png')}
                />
            </View>

            <View style={styles.login}>
              <Input
                  placeholder="Email"
                  autoCapitalize="none"
                  value={this.state.email}
                  onChangeText={this.handleChange('email')}
                  keyboardType="email-address"
                  style={styles.input}
                />
              <Input
                placeholder="Password"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={this.handleChange('password')}
                style={styles.input}
              />
              <Button onPress={this.onLoginPress} style={styles.btn}>
                Log In
              </Button>

              <Button onPress={this.signInWithGoogle} style={styles.btn}>
                Sign in With Google
              </Button>

            </View>
          </KeyboardAvoidingView>

          <View style={styles.bottom}>
            <Button onPress={() => this.props.navigation.navigate('SignUpScreen')} appearance='outline'>
            Sign Up</Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  content: {
    justifyContent: 'center',
    height: "80%",
    position: "absolute",
    display: "flex",
    width: "100%",
    alignItems: 'center',
    zIndex: 10,
  },
  login: {
    flex: 6,
    // marginTop: 100
    justifyContent: 'center',
  },
  input: {
    // borderWidth: 1,
    // borderColor: "#ccc",
    width: '80%',
    paddingBottom: 10,
    // marginTop: 2,
    // marginBottom: 2,
  },
  bottom: {
    marginVertical: 20,
    position: 'absolute',
    bottom: 60,
    left: 40,
    right: 40,
    zIndex: 11,
  },
  btn: {
    marginBottom: 10,
  }
});
