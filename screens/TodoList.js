import * as React from 'react';
import { StyleSheet, AsyncStorage, View} from 'react-native';
import { Button, Layout, Text, List, ListItem, ListItemProps, ListProps, CheckBox } from 'react-native-ui-kitten';
import {authDetect, base} from '../firebase';
import AddModal from './AddModal';

export default class TodoList extends React.Component {
  state = {
    data: {},
    dataKeys: [],
    uid: null,
    addClicked: false,
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
  }

  onAddPress = () => {
    const {addClicked} = this.state;
    this.setState({
      addClicked: !addClicked
    });
  }

  addItem = (item) => {
    const {data, dataKeys} = this.state;
    this.setState({
      addClicked: false,
      data: {...data, [item]: false},
      dataKeys: [...dataKeys, item]
    });
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
<View style={styles.btnWrapper}>
<Button
style={styles.addBtn}
textStyle={styles.btnText}
onPress={this.onAddPress}>
  Add
  </Button>
</View>
<AddModal
visible={this.state.addClicked}
onClose={this.onAddPress}
addItem={this.addItem} />
{this.state.addClicked ? <View style={styles.overlay} />: null}
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
    backgroundColor: 'rgba(218,224,235,.6)'
  },
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
    paddingBottom: 100,
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
    paddingBottom: 20,
    paddingRight: 20,
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    fontSize: 15,
    fontWeight: '500'
  }
});