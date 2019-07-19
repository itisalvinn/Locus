import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import { authSignOut } from "../firebase";

class DashboardScreen extends Component {

  onSuccess = () => {
    return this.props.navigation.navigate('LoginScreen');
  }

  onError = () => {
    alert("Something went wrong logging out.");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>DashboardScreen</Text>

        <Button
          title="Log out"
          onPress={ () => authSignOut(this.onSuccess, this.onError)}
        >
          Log Out
        </Button>
      </View>
    )
  }
}

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
