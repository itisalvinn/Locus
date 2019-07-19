import React, {Component} from 'react';
import { firebaseInit } from './firebase';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';

import LoginScreen from './screens/Login/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoadingScreen from './screens/Login/LoadingScreen';
import SignUp from './screens/Login/SignUp';

// firebaseInit();

export default class App extends Component {
  render() {
    return (
      <ApplicationProvider
        mapping={mapping}
        theme={lightTheme}>
        {/* <Layout style={{flex: 1}}/> */}
        <AppNavigator />
      </ApplicationProvider>
    );
  }
}

const AppSwitchNavigator = createSwitchNavigator(
  {
    LoadingScreen: LoadingScreen,
    LoginScreen: LoginScreen,
    SignUpScreen: SignUp,
    DashboardScreen: DashboardScreen
  },
  {
    initialRouteName: 'LoadingScreen'
  }
);

const AppNavigator = createAppContainer(AppSwitchNavigator);
