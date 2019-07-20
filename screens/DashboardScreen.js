import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, AsyncStorage, ActivityIndicator} from 'react-native';
import {BottomNavigation, BottomNavigationTab} from 'react-native-ui-kitten';
import TodoList from './TodoList/TodoList';
import House from './House/House';
import {authDetect, base, authSignOut} from '../firebase';

class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      itemKeys: [],
      uid: null,
      selectedIndex: 0,
      houses: null,
      user: props.navigation.state.params ? props.navigation.state.params : null,
      houseUuid: null,
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('uid').then(uid => {
      this.setState({uid});
      this.synchronizeStatesWithFirebase(uid);
    });

    const {user} = this.state;
    if (!user.houses) {
      user.houses = {};
    }
    const houseKeys = Object.keys(user.houses);
    let t = 0;
    let houseUuid = null;

    for (let i = 0; i < houseKeys.length; i++) {
      const key = houseKeys[i];
      if (user.houses[key] > t) {
        t = user.houses[key];
        houseUuid = key;
      }
    }

    this.setState({houseUuid});
  }

  componentWillUnmount() {
    this.removeBindingFromFirebase();
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
    this.userRef = base.syncState(`users/${uid}`, {
      context: this,
      state: "user"
    });
    this.housesRef = base.syncState(`houses/`, {
      context: this,
      state: "houses"
    });
  }

  removeBindingFromFirebase() {
    base.removeBinding(this.itemsRef);
    base.removeBinding(this.itemKeysRef);
    base.removeBinding(this.userRef);
    base.removeBinding(this.housesRef);
  }

  toggleItemComplete = (key) => {
    const {items} = this.state;
    items[key].completed = !items[key].completed;
    this.setState({items});
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
    alert("Something went wrong logging out.");
  }

  onSelect = (selectedIndex) => {
    this.setState({selectedIndex});
  }

  signout = async () => {
    await AsyncStorage.setItem('uid', null);
    await AsyncStorage.setItem('houseUuid', null);
    authSignOut(this.onSuccess, this.onError);
  }

  editHouse = (houseUuid, houseName) => {
    if (!houseName) {
      console.error("Please provide a name");
    }
    let {houses, user} = this.state;
    houses = {
      ...houses,
      [houseUuid]: {
        name: houseName,
        members: {
          ...members,
          [this.state.uid]: true
        }
      }
    };
    user = {
      ...user,
      houses: {
        ...user.houses,
        [houseUuid]: Date.now()
      }
    }
    const {members} = houses && houses[houseUuid] || {};
    houses[houseUuid].name = houseName;
    this.setState({houses, houseUuid, user});
  }

  leaveHouse = (targetUuid) => {
    // Delete the house from the user's houses
    let {user, houses} = this.state;
    user = {
      ...user,
      houses: {
        ...user.houses,
        [targetUuid]: null,
      }
    };
    
    const targetHouse = houses ? houses[targetUuid] : {};
    let members = targetHouse.members || {};
    members = {
      ...members,
      [this.state.uid]: null
    };

    const memberLength = Object.keys(members).filter(member => members[member] !== null).length;
    if (!memberLength) {
      houses = {
        ...houses,
        [targetUuid]: null,
      }
    } else {
      houses = {
        ...houses,
        [targetUuid]: {
          ...targetHouse,
          members,
        }
      };
    }

    this.setState({user, houses});
  }

  getNewLastHouse = (avoidHouseUuid) => {
    const {user} = this.state;
    if (!user.houses) {
      return null;
    }
    const {houses} = user;
    let latestTimestamp = 0;
    let houseUuid = null;
    const houseKeys = Object.keys(houses);
    for (let i = 0; i < houseKeys.length; i++) {
      const key = houseKeys[i];
      if (key === avoidHouseUuid) continue;
      if (houses[key] >= latestTimestamp) {
        latestTimestamp = houses[key];
        houseUuid = houseKeys[i];
      }
    }

    return houseUuid;
  }

  renderSelectedPage() {
    const {selectedIndex} = this.state;
    switch (selectedIndex) {
      case 0:
        return (
          <House
            uid={this.state.uid}
            user={this.state.user}
            editHouse={this.editHouse}
            houseInfo={this.state.houseUuid && this.state.houses ? this.state.houses[this.state.houseUuid] : {}}
            leaveHouse={this.leaveHouse}
          />
        );
      case 1:
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
      case 4:
        return (
          <Button
            title="Log out"
            onPress={async () => await this.signout()}
            style={styles.logoutBtn}
          >
          Log Out
          </Button>
        )
      default:
        return null;
    }
  }

  render() {
    if (
      !this.state.uid ||
      !this.state.user ||
      !this.itemsRef ||
      !this.itemKeysRef ||
      !this.userRef
      ) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size={"large"}/>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {this.renderSelectedPage()}
        </View>

        <View
          style={styles.bottomNav}>
          <BottomNavigation
            indicatorStyle={styles.indicator}
            selectedIndex={this.state.selectedIndex}
            onSelect={this.onSelect}>
            <BottomNavigationTab title='Home'/>
            <BottomNavigationTab title='To Do List'/>
            <BottomNavigationTab title='Grocery List'/>
            <BottomNavigationTab title='Settings'/>
            {/* Below is temporary */}
            <BottomNavigationTab title='Logout' /> 
          </BottomNavigation>
        </View>
      </View>
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
    top: 500,
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