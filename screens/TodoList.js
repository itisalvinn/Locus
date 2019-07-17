import * as React from 'react';
import { StyleSheet, AsyncStorage, View, TouchableOpacity} from 'react-native';
import { Button, Layout, Text, List, ListItem, ListItemProps, ListProps, CheckBox } from 'react-native-ui-kitten';
import {authDetect, base} from '../firebase';
import EditModal from './EditModal';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default class TodoList extends React.Component {
  state = {
    items: {},
    itemKeys: [],
    uid: null,
    addClicked: false,
    editClicked: false,
    editItemKey: null,
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

  onCloseModalPress = () => {
    this.setState({
      addClicked: false,
      editClicked: false,
      editItemKey: null,
    });
  }

  onEditPress = (key) => {
    this.setState({
      editClicked: true,
      editItemKey: key,
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
      editClicked: false,
      items,
      itemKeys,
    });
  }

  editItem = (newTitle) => {
    const {items, editItemKey} = this.state;
    items[editItemKey].title = newTitle;
    this.setState({
      addClicked: false,
      editClicked: false,
      items,
    });
  }

  deleteItem = (key) => {
    const {items} = this.state;
    let {itemKeys} = this.state;

    items[key] = null;

    itemKeys = itemKeys.filter(item => item != key);
    
    this.setState({
      addClicked: false,
      editClicked: false,
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
        <View style={[styles.listItem, lastItem ? styles.lastListItem : null]}>
        <CheckBox
          checked={checkedItem.completed}
          style={styles.checkbx}
          onChange={(checked) => this.toggleItemComplete(info.item)}
        />
        <TouchableOpacity style={styles.todoRow} onPress={() => this.onEditPress(info.item)}>
          <Text style={[styles.rowText, checkedItem.completed ? styles.checkedText : styles.radioText]}>{checkedItem.title}</Text>
        </TouchableOpacity>
      </View>
      </Swipeable>
    );
  };

  renderEditModal() {
    if (this.state.addClicked) {
      return (
        <EditModal
          title={'Add Item'}
          btnText={'Add Item'}
          onClose={this.onCloseModalPress}
          onSubmit={this.addItem} />
      );
    } else if (this.state.editClicked) {
      return (
        <EditModal
          title={'Edit Item'}
          btnText={'Edit Item'}
          onClose={this.onCloseModalPress}
          onSubmit={this.editItem}
          text={this.state.items[this.state.editItemKey].title} />
      );
    }
    return null;
  }

  render() {
    return (
  <Layout style={styles.container}>
    <Layout style={styles.header}>
      <Text style={styles.text} category='h5'>Todo List</Text>
      <View style={styles.editBtnWrapper}>
        {/* <Button
        style={styles.editBtn}
        textStyle={styles.btnText}
        onPress={this.onEditPress}
        appearance='ghost'>
          Filter
        </Button> */}
      </View>
    </Layout>

<Layout style={styles.content}>
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
  </Layout>

{this.renderEditModal()}
{this.state.addClicked || this.state.editClicked ? (
  <View style={styles.overlay} />
): null}
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