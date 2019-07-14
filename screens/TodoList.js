import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {authDetect} from "../firebase";

export default class TodoList extends Component {
  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.header}>Todo List</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "pink"
  },
  header: {
    padding: 20,
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    fontSize: 20,
    width: '100%',
  }
});