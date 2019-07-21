import * as React from 'react';
import { StyleSheet, AsyncStorage, View, TouchableOpacity} from 'react-native';
import { Button, Layout, Text, List, ListItem, ListItemProps, ListProps, CheckBox } from 'react-native-ui-kitten';
import { RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import {authSignOut} from '../firebase';

export default class TodoList extends React.Component {
  state = {
    addClicked: false,
    editClicked: false,
    editItemKey: null,
  }

  rows = {};

  toggleItemComplete(key) {
    this.props.toggleItemComplete(key);
  }

  onSuccess = () => {
    return this.props.navigation.navigate('LoginScreen');
  }

  render() {
    return (
      <Layout style={styles.container}>
        <Layout style={styles.header}>
          <Text style={styles.text} category='h5'>Settings</Text>
        </Layout>
        <Text style={styles.text} category='h6'> User Info </Text>
        <Text> First Name: </Text>
        <Text> Last Name: </Text>
        <Text> Roommates: </Text>
        <Text> Quiet Hours </Text>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(218,224,235,.6)',
  },
  container: {
    // height: '100%',
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  text: {
    padding: 20,
    flex: 1,
  },
  listItem: {
    borderBottomColor: '#f4f4f6',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  lastListItem: {
    marginBottom: 80,
  },
  checkbx: {
    width: 30,
    padding: 20,
  },
  listItemTitle: {
    fontSize: 16
  },
  listContainer: {
    width: "100%",
    backgroundColor: '#ffffff',
  },
  todoRow: {
    flex: 1,
    padding: 20,
    paddingLeft: 10,
  },
  rowText: {
    fontWeight: '500',
  },
  checkedText: {
    color: "#c6cee0"
  },
  radioText: {
    color: '#394159'
  },
  btnWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: 100,
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  editBtnWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  editBtn: {
    marginRight: 10,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '500'
  },
  iconBtnContainer: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: 20,
  },
});
