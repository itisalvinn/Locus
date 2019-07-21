import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, AsyncStorage, View} from 'react-native';
import {authDetect} from "../../firebase";
import * as firebase from 'firebase';

class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    authDetect( async (authUser) => {
      if (authUser) {
        await AsyncStorage.setItem('uid', authUser.uid);
        return firebase.database().ref('/users/' + authUser.uid)
        .once('value')
        .then((snapshot) => {
          const user = snapshot.val();
          if (!user.houses) {
            user.houses = {};
          }
          const houseKeys = Object.keys(user.houses);
          let t = 0;
          let houseUuid = null;
      
          for (let i = 0; i < houseKeys.length; i++) {
            const key = houseKeys[i];
            if (user.houses[key] > t) {
              t = user.houses[key];
              houseUuid = key;
            }
          }
          // TODO: Get the houseInfo and then navigate to it
          return this.props.navigation.navigate(
            'DashboardScreen',
            {user, houseUuid, uid: authUser.uid}
          );
        });
      } else {
        await AsyncStorage.setItem('uid', '');
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