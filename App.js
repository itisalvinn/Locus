import React, {Component} from 'react';
import { firebaseInit } from './firebase';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider, Layout } from 'react-native-ui-kitten';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoadingScreen from './screens/LoadingScreen';
import TodoList from './screens/TodoList';

// firebaseInit();

export default class App extends Component {
  render() {
    return (
      <ApplicationProvider
      mapping={mapping}
      theme={lightTheme}>
        {/* <Layout style={{flex: 1}}/> */}
        {/* <AppNavigator /> */}
        <TodoList />
      </ApplicationProvider>
    );
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen
});

const AppNavigator = createAppContainer(AppSwitchNavigator);
