import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, AsyncStorage, View} from 'react-native';
import {authDetect} from "../../firebase";

class LoadingScreen extends Component {

  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    authDetect( async (user) => {
      if (user) {
        await AsyncStorage.setItem('uid', user.uid);
        return this.props.navigation.navigate('DashboardScreen');
      }else {
        return this.props.navigation.navigate('LoginScreen');
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} />
      </View>
    )
  }
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});