import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, AsyncStorage, ActivityIndicator, Platform} from 'react-native';
import {BottomNavigation, BottomNavigationTab} from 'react-native-ui-kitten';
import TodoList from './TodoList/TodoList';
import House from './House/House';
import QuietHours from './QuietHours/QuietHours';
import Settings from './Settings/Settings';
import Grocery from './Grocery/Grocery';
import { MaterialIcons } from '@expo/vector-icons';
import {authDetect, base, authSignOut} from '../firebase';

class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      itemKeys: [],
      groceryItems: {},
      groceryItemKeys: [],
      uid: props.navigation.state.params ? props.navigation.state.params.uid : null,
      selectedIndex: 0,
      user: props.navigation.state.params ? props.navigation.state.params.user : null,
      houseUuid: props.navigation.state.params ? props.navigation.state.params.houseUuid : null,
      houseInfo: null,
    }
  }

  componentDidMount() {
    if (this.state.uid) {
      this.synchronizeStatesWithFirebase(this.state.uid);
    }
    if (this.state.houseUuid) {
      this.synchronizeHouseStatesWithFirebase(this.state.houseUuid)
    } else {
      // For the demo:
      this.editHouse('demo-housing', {name: 'Demo Housing'});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.uid !== nextState.uid) {
      this.removeBindingFromFirebase();
      this.synchronizeStatesWithFirebase(nextState.uid);
    }
    return true;
  }

  componentWillUnmount() {
    this.removeBindingFromFirebase();
    this.removeHouseBindingFromFirebase();
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
  }

  synchronizeHouseStatesWithFirebase(houseUuid) {
    this.houseInfoRef = base.syncState(`houses/${houseUuid}`, {
      context: this,
      state: "houseInfo"
    });
    this.groceryItemsRef = base.syncState(`grocery_list/${houseUuid}/items`, {
      context: this,
      state: "groceryItems"
    });
    this.groceryItemKeysRef = base.syncState(`grocery_list/${houseUuid}/itemKeys`, {
      context: this,
      state: "groceryItemKeys"
    });
  }

  removeBindingFromFirebase() {
    base.removeBinding(this.itemsRef);
    base.removeBinding(this.itemKeysRef);
    base.removeBinding(this.userRef);
  }

  removeHouseBindingFromFirebase() {
    base.removeBinding(this.houseInfoRef);
    base.removeBinding(this.groceryItemsRef);
    base.removeBinding(this.groceryItemKeysRef);
  }

  /* Grocery List */
  /* =============================== */
  participateInItem = (key) => {
    const {groceryItems, uid, user} = this.state;
    let groceryItem = groceryItems[key];
    let {participants = {}} = groceryItem;
    groceryItem = {
      ...groceryItem,
      participants: {
        ...participants,
        [uid]: user.first_name
      }
    };

    groceryItems[key] = groceryItem;
    this.setState({groceryItems});
  }

  unparticipateInItem = (key) => {
    const {groceryItems, uid, user} = this.state;
    let groceryItem = groceryItems[key];
    let {participants = {}} = groceryItem;
    participants = {
      ...participants,
      [uid]: null
    }
    groceryItem = {
      ...groceryItem,
      participants
    };

    groceryItems[key] = groceryItem;
    this.setState({groceryItems});
  }

  toggleGroceryItemComplete = (key) => {
    const {groceryItems} = this.state;
    groceryItems[key].completed = !groceryItems[key].completed;
    this.setState({groceryItems});
  }

  addGroceryItem = (key) => {
    const {groceryItems, uid, user} = this.state;
    const timestamp = Date.now();

    groceryItems[`groceryItem-${timestamp}`] = {
      title: key,
      completed: false,
      timestamp,
      participants: {
        [uid]: user.first_name
      }
    };

    let groceryItemKeys = Object.keys(groceryItems).reduce((acc, cur) => {
      return [...acc, {title: cur, timestamp: groceryItems[cur].timestamp}];
    }, []);
    groceryItemKeys.sort((a, b) => b.timestamp - a.timestamp);
    groceryItemKeys = groceryItemKeys.map(item => item.title);

    this.setState({
      groceryItems,
      groceryItemKeys,
    });
  }

  editGroceryItem = (newTitle, editItemKey) => {
    const {groceryItems} = this.state;
    groceryItems[editItemKey].title = newTitle;
    this.setState({
      groceryItems,
    });
  }

  deleteGroceryItem = (key) => {
    const {groceryItems} = this.state;
    let {groceryItemKeys} = this.state;
    groceryItems[key] = null;
    groceryItemKeys = groceryItemKeys.filter(item => item != key);

    this.setState({
      groceryItems,
      groceryItemKeys,
    });
  }

  /* Todo List */
  /* =============================== */
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
    await AsyncStorage.setItem('uid', '');
    await AsyncStorage.setItem('houseUuid', '');
    authSignOut(this.onSuccess, this.onError);
  }

  editHouse = (houseUuid, newHouseInfo /* optional */) => {
    // 1. Remove binding for the current house
    if (this.houseInfoRef) {
      this.removeHouseBindingFromFirebase();
    }

    Promise.all([
      base.fetch(`houses/${houseUuid}`, {
        context: this,
      }),
      base
        .fetch(`grocery_list/${houseUuid}`, {
          context: this,
        })
    ]).then(([data, groceryData]) => {
      this.setState({
        houseInfo: data,
      });

      // 3. Synchronize with new houseUuid
      this.synchronizeHouseStatesWithFirebase(houseUuid);

      let {user, houseInfo, uid} = this.state;
      let {members = {}} = houseInfo;
      user = {
        ...user,
        houses: {
          ...user.houses,
          [houseUuid]: Date.now()
        }
      };
      houseInfo = {
        ...newHouseInfo,
        members: {
          ...members,
          [uid]: user.first_name
        },
      };
      this.setState({houseInfo, user, houseUuid});
    })

    // 2. Update the current state with new houseUuid
    base
      .fetch(`houses/${houseUuid}`, {
        context: this,
      })
      .then(data => {
        this.setState({
          houseInfo: data
        });

        // 3. Synchronize with new houseUuid
        this.synchronizeHouseStatesWithFirebase(houseUuid);

        let {user, houseInfo, uid, groceryItems} = this.state;
        let {members = {}} = houseInfo;
        let {participants = {}} = groceryItems;
        user = {
          ...user,
          houses: {
            ...user.houses,
            [houseUuid]: Date.now()
          }
        };
        houseInfo = {
          ...newHouseInfo,
          members: {
            ...members,
            [uid]: user.first_name
          },
        };
        this.setState({houseInfo, user, houseUuid});
      })
      .catch(error => {
        console.log("[editHouse] ", error);
      });
  }

  leaveHouse = (houseUuid) => {
    const oldHouseUuid = this.state.houseUuid;

    if (this.houseInfoRef) {
      this.removeHouseBindingFromFirebase();
    }

    // 2. Update the current state with new houseUuid
    base
      .fetch(`houses/${houseUuid}`, {
        context: this,
      })
      .then(data => {
        this.setState({
          houseInfo: data
        });

        // 3. Synchronize with new houseUuid
        this.synchronizeHouseStatesWithFirebase(houseUuid);

        let {user, uid, houseInfo} = this.state;
        let {name = '', members = {}} = houseInfo;
        user = {
          ...user,
          houses: {
            ...user.houses,
            [houseUuid]: null
          }
        };
        houseInfo = {
          ...houseInfo,
          members: {
            ...members,
            [uid]: null
          },
        };

        // 4. Check if members is now empty
        const validMembersLen = Object.keys(houseInfo.members).filter(member => houseInfo.members[member] !== null).length;
        if (!validMembersLen) {
          // House has no member
          houseInfo = null;
        }
        this.setState({houseInfo, user});

        // 5. Redirect to the new houseUuid
        const newHouseUuid = this.getNewLastHouse(oldHouseUuid);
        if (newHouseUuid) {
          if (this.houseInfoRef) {
            this.removeHouseBindingFromFirebase();
          }

          base
            .fetch(`houses/${newHouseUuid}`, {
              context: this,
            })
            .then(newData => {
              this.setState({
                houseInfo: newData
              });

              // 3. Synchronize with newHouseUuid
              this.synchronizeHouseStatesWithFirebase(newHouseUuid);

              let {user: newUser, houseInfo: newHouseInfo, uid} = this.state;
              let {members: newMembers = {}} = newHouseInfo;
              newUser = {
                ...newUser,
                houses: {
                  ...newUser.houses,
                  [newHouseUuid]: Date.now()
                }
              };
              newMembers[uid] = newUser.first_name;
              this.setState({
                houseInfo: {
                  ...newHouseInfo,
                  members: newMembers
                },
                user: newUser,
                houseUuid: newHouseUuid
              });
            })
            .catch(error => {
              console.log("Couldn't find newHouseUuid")
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
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
            leaveHouse={this.leaveHouse}
            houseUuid={this.state.houseUuid}
            houseInfo={this.state.houseInfo}
          />
        );
      case 1:
        return (
          <TodoList
            items={this.state.items}
            itemKeys={this.state.itemKeys}
            deleteItem={this.deleteItem}
            editItem={this.editItem}
            addItem={this.addItem}
            toggleItemComplete={this.toggleItemComplete}
          />
        );
      case 2:
        return (
          <Grocery
            groceryItems={this.state.groceryItems}
            groceryItemKeys={this.state.groceryItemKeys}
            deleteGroceryItem={this.deleteGroceryItem}
            editGroceryItem={this.editGroceryItem}
            addGroceryItem={this.addGroceryItem}
            toggleGroceryItemComplete={this.toggleGroceryItemComplete}
            participateInItem={this.participateInItem}
            unparticipateInItem={this.unparticipateInItem}
            uid={this.state.uid}
          />
        )
      case 3:
        return (
          <QuietHours
            uid={this.state.uid}
            user={this.state.user}
            houseUuid={this.state.houseUuid}
            houseInfo={this.state.houseInfo}
          />
        );
      case 4:
        return (
          <Settings
            key='3'
            user={this.state.user}
          />
        );
      /* remove for now
      case 5:
        return (
          <View style={styles.container}>
            <Button
              title="Log out"
              onPress={async () => await this.signout()}
              style={styles.logoutBtn}
            >
              Log Out
            </Button>
          </View>
        ) */
      default:
        return null;
    }
  }

  render() {

    if (
      !this.state.uid ||
      !this.state.user ||
      this.state.user && this.state.user.houses && (!this.state.houseInfo || !this.state.houseInfo.members)
    ) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size={"large"}/>
        </View>
      )
    }

    return (
      <View style={styles.container}>
      <View
        style={styles.bottomNav}>
        <BottomNavigation
          indicatorStyle={styles.indicator}
          selectedIndex={this.state.selectedIndex}
          onSelect={this.onSelect}>
          <BottomNavigationTab title='Home'/>
          <BottomNavigationTab title='To Do List'/>
          <BottomNavigationTab title='Grocery List'/>
          <BottomNavigationTab title='Quiet Hours'/>
          <BottomNavigationTab title='Settings'/>
          {/* Below is temporary */}
          {/* <BottomNavigationTab title='Logout'/> */}
        </BottomNavigation>
      </View>
        <View style={styles.content}>
          {this.renderSelectedPage()}
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
    height: Platform.OS === 'ios' ? 70 : 50,
    bottom: 0,
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
