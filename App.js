import React, {Component} from 'react';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { mapping, dark as darkTheme, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { StatusBar } from 'react-native';

import LoginScreen from './screens/Login/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoadingScreen from './screens/Login/LoadingScreen';
import SignUp from './screens/Login/SignUp';

export default class App extends Component {
  componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
  }
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
