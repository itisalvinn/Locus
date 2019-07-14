import * as React from 'react';
import { StyleSheet, AsyncStorage} from 'react-native';
import { Button, Layout, Text, List, ListItem, ListItemProps, ListProps, CheckBox } from 'react-native-ui-kitten';
import {authDetect, base} from '../firebase';
import * as firebase from 'firebase';

export default class TodoList extends React.Component {
  state = {
    data: {},
    dataKeys: [],
    uid: null
  }

  componentDidMount() {
    AsyncStorage.getItem('uid').then(val => {
      if (!val) {
        authDetect(async (user) => {
            if (user) {
              // User is signed in
              const uid = user.uid;
              await AsyncStorage.setItem('uid', uid);
              this.setState({uid});
              this.synchronizeStatesWithFirebase(uid);
            } else {
              // User is signed out
              alert("not logged in");
            }
          }
        );
      } else {
        this.setState({uid: val});
        this.synchronizeStatesWithFirebase(val);
      }
  });
  }

  componentWillUnmount() {
    this.removeBindingFromFirebase()
  }

  synchronizeStatesWithFirebase(uid) {
    this.dataRef = base.syncState(`todo_list/${uid}/data`, {
      context: this,
      state: "data"
    });
    this.dataKeysRef = base.syncState(`todo_list/${uid}/dataKeys`, {
      context: this,
      state: "dataKeys"
    });
  }

  removeBindingFromFirebase() {
    base.removeBinding(this.dataRef);
    base.removeBinding(this.dataKeysRef);
  }

  onChange(checked, item) {
    const checkedItem = this.state.data[item];
    this.setState({
      data: {
        ...this.state.data,
        [item]: !checkedItem
      }
    });
    // this.updateState(this.state.uid);
  }

  renderItem = (info) => {
    const checkedItem = this.state.data[info.item];
    return (
      <CheckBox
        checked={checkedItem}
        text={info.item}
        textStyle={checkedItem ? styles.checkedText : styles.radioText}
        style={styles.listItem}
        onChange={(checked) => this.onChange(checked, info.item)}
      />
    );
  };
  render() {
    return (
  <Layout style={styles.container}>
    <Text style={styles.text} category='h5'>Todo List</Text>
    <List
  data={this.state.dataKeys}
  renderItem={this.renderItem}
  style={styles.listContainer}
/>
  </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
  },
  text: {
    marginTop: 20,
    padding: 20,
  },
  listItem: {
    padding: 20,
    borderBottomColor: '#f4f4f6',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
  },
  listItemTitle: {
    fontSize: 16
  },
  listContainer: {
    width: "100%",
    backgroundColor: '#ffffff',
  },
  checkedText: {
    color: "#c6cee0"
  },
  radioText: {
    color: '#394159'
  }
});