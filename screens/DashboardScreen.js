import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, AsyncStorage, ActivityIndicator} from 'react-native';
import { BottomNavigation, BottomNavigationTab } from 'react-native-ui-kitten';
import TodoList from './TodoList/TodoList';
import {authDetect, base, authSignOut} from '../firebase';


class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      itemKeys: [],
      uid: null,
      selectedIndex: 0,
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('uid').then(uid => {
      this.setState({uid});
      this.synchronizeStatesWithFirebase(uid);
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

  toggleItemComplete = (key) => {
    const {items} = this.state;
    items[key].completed = !items[key].completed;
    this.setState({ items });
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
      items,
      itemKeys,
    });
  }

  editItem = (newTitle, editItemKey) => {
    const {items} = this.state;
    items[editItemKey].title = newTitle;
    this.setState({
      items,
    });
  }

  deleteItem = (key) => {
    const {items} = this.state;
    let {itemKeys} = this.state;

    items[key] = null;

    itemKeys = itemKeys.filter(item => item != key);
    
    this.setState({
      items,
      itemKeys,
    });
  }

  onSuccess = () => {
    return this.props.navigation.navigate('LoginScreen');
  }

  onError = () => {
    alert("Something went wrong. Logging out.");
  }

  onSelect = (selectedIndex) => {
    this.setState({selectedIndex});
  }

  renderSelectedPage() {
    const {selectedIndex} = this.state;

    if (selectedIndex === 1) {
      return (
        <TodoList
            key='1'
            items={this.state.items}
            itemKeys={this.state.itemKeys}
            deleteItem={this.deleteItem}
            editItem={this.editItem}
            addItem={this.addItem}
            toggleItemComplete={this.toggleItemComplete}
          />
      );
    }
  }

  render() {
    if (!this.state.uid || !this.itemsRef || !this.itemKeysRef) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size={"large"} />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {this.renderSelectedPage()}
        </View>
        <View
          key='2'
          style={styles.bottomNav}>
          <BottomNavigation
            indicatorStyle={styles.indicator}
            selectedIndex = {this.state.selectedIndex}
            onSelect = {this.onSelect}>
            <BottomNavigationTab title='Home'/>
            <BottomNavigationTab title='To Do List'/>
            <BottomNavigationTab title='Grocery List'/>
            <BottomNavigationTab title='Settings'/>
          </BottomNavigation>
        </View>
      </View>
    //   <Button
    //     key='3'
    //     title="Log out"
    //     onPress={ () => authSignOut(this.onSuccess, this.onError)}
    //     style={styles.logoutBtn}
    //   >
    //   Log Out
    // </Button>
    // ]
    )
  }
}

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutBtn: {
    position: 'absolute',
    bottom: 20,
    left: 0,
  },
  bottomNav: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    height: 50,
    left: 0,
    right: 0,
  },
  content: {
    width: '100%',
    flex: 1,
    position: 'relative',
    marginBottom: 50, // must be same as height of bottomNav
  }
});
