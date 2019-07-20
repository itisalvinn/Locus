import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, AsyncStorage, View} from 'react-native';
import {authDetect} from "../../firebase";
import * as firebase from 'firebase';

class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    authDetect( async (user) => {
      if (user) {
        await AsyncStorage.setItem('uid', user.uid);
        return firebase.database().ref('/users/' + user.uid)
        .once('value')
        .then((snapshot) => {
          return this.props.navigation.navigate(
            'DashboardScreen',
            snapshot.val()
          );
        });
      } else {
        await AsyncStorage.setItem('uid', null);
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