import * as React from 'react';
import { StyleSheet, AsyncStorage, View, TouchableOpacity} from 'react-native';
import { Button, Layout, Text, List, ListItem, ListItemProps, ListProps, CheckBox } from 'react-native-ui-kitten';
import {authDetect, base} from '../firebase';
import AddModal from './AddModal';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default class TodoList extends React.Component {
  state = {
    items: {},
    itemKeys: [],
    uid: null,
    addClicked: false,
  }

  rows = {};

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
    this.itemsRef = base.syncState(`todo_list/${uid}/items`, {
      context: this,
      state: "items"
    });
    this.itemKeysRef = base.syncState(`todo_list/${uid}/itemKeys`, {
      context: this,
      state: "itemKeys"
    });
  }

  removeBindingFromFirebase() {
    base.removeBinding(this.itemsRef);
    base.removeBinding(this.itemKeysRef);
  }

  toggleItemComplete(key) {
    const {items} = this.state;
    items[key].completed = !items[key].completed;
    this.setState({ items });
  }

  onAddPress = () => {
    const {addClicked} = this.state;
    this.setState({
      addClicked: !addClicked
    });
  }

  addItem = (key) => {
    const {items} = this.state;
    const timestamp = Date.now();

    items[`item-${timestamp}`] = {
      title: key,
      completed: false,
      timestamp,
    };

    let itemKeys = Object.keys(items).reduce((acc, cur) => {
      return [...acc, {title: cur, timestamp: items[cur].timestamp}];
    }, []);
    itemKeys.sort((a, b) => b.timestamp - a.timestamp);
    itemKeys = itemKeys.map(item => item.title);

    this.setState({
      addClicked: false,
      items,
      itemKeys,
    });
  }

  deleteItem = (key) => {
    const {items} = this.state;
    let {itemKeys} = this.state;

    items[key] = null;

    itemKeys = itemKeys.filter(item => item != key);
    
    this.setState({
      addClicked: false,
      items,
      itemKeys,
    });

    this.rows[key].close();
  }

  swipeRightAction = (key) => {
    return (
      <RectButton style={styles.iconBtnContainer} onPress={() => this.deleteItem(key)}>
        <Ionicons name="ios-trash" size={32} color="#ffffff" />
      </RectButton>
    );
  }

  renderItem = (info) => {
    if (!this.state.itemKeys || !this.state.itemKeys.length) return null;
    const checkedItem = this.state.items[info.item];
    const lastItem = info.item === this.state.itemKeys[this.state.itemKeys.length - 1];
    return (
      <Swipeable
      ref={(row) => this.rows[info.item] = row}
      renderRightActions={() => this.swipeRightAction(info.item)}>
        <CheckBox
        checked={checkedItem.completed}
        text={checkedItem.title}
        textStyle={checkedItem.completed ? styles.checkedText : styles.radioText}
        style={lastItem ? styles.lastListItem : styles.listItem}
        onChange={(checked) => this.toggleItemComplete(info.item)}
      />
      </Swipeable>
    );
  };

  render() {
    return (
  <Layout style={styles.container}>
    <Text style={styles.text} category='h5'>Todo List</Text>


    <List
  data={this.state.itemKeys && this.state.itemKeys.length ? this.state.itemKeys : []}
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
    backgroundColor: 'rgba(218,224,235,.6)',
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
    height: 70,
  },
  lastListItem: {
    padding: 20,
    borderBottomColor: '#f4f4f6',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    marginBottom: 80,
    height: 70,
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
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    fontSize: 15,
    fontWeight: '500'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  iconBtnContainer: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  }
});