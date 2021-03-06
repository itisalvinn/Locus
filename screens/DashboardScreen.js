import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  Platform,
  Alert,
  Vibration
} from 'react-native';
import {BottomNavigation, BottomNavigationTab} from 'react-native-ui-kitten';
import TodoList from './TodoList/TodoList';
import House from './House/House';
import QuietHours from './QuietHours/QuietHours';
import Settings from './Settings/Settings';
import Grocery from './Grocery/Grocery';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import {authDetect, base, authSignOut} from '../firebase';
import Join from './House/Join';
import {Notifications} from "expo";
import registerForPushNotificationsAsync from './QuietHours/NotificationRegistration'

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
      inviteCodes: {},
      houses: {},
    }
  }

  componentDidMount() {
    registerForPushNotificationsAsync(this.state.uid);

    if (this.state.uid) {
      this.synchronizeStatesWithFirebase(this.state.uid);
    }
    if (this.state.houseUuid) {
      this.synchronizeHouseStatesWithFirebase(this.state.houseUuid)
    } else {
      this.showInviteScreen();
    }

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = notification => {
    console.log('Received a notification...');
    console.log(notification);

    // If they user hits the notification from notification tray
    if (notification.origin == 'selected') {
      // Navigate to quiet hours page
      this.setState({selectedIndex: 3})
    }
    // When the user has app opened
    if (notification.origin == 'received') {
      Vibration.vibrate();
      Alert.alert("Locus Alert (闭嘴)", "Please keep it down (mbule gojën).");
    }
  };

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
    this.inviteCodesRef = base.syncState(`invite_codes`, {
      context: this,
      state: "inviteCodes"
    });
    this.housesRef = base.syncState(`houses`, {
      context: this,
      state: "houses"
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
    base.removeBinding(this.inviteCodesRef);
    base.removeBinding(this.housesRef);
  }

  removeHouseBindingFromFirebase() {
    base.removeBinding(this.houseInfoRef);
    base.removeBinding(this.groceryItemsRef);
    base.removeBinding(this.groceryItemKeysRef);
  }

  /* Join/Invite a house */
  /* =============================== */
  showInviteScreen = () => {
    this.setState({
      showInviteScreen: true
    });
  }
  isValidInviteCode = (inviteCode) => {
    const {inviteCodes} = this.state;
    console.log({inviteCodes, inviteCode});
    if (!inviteCodes[inviteCode]) {
      this.createInviteCode("demo-housing");
      return false;
    } else {
      return true;
    }
  }
  generateUIDWithCollisionChecking = (obj) => {
    while (true) {
      var uid = ("0000" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36)).slice(-6);
      if (!obj.hasOwnProperty(uid)) {
        return uid;
      }
    }
  }
  createInviteCode = (houseUuid) => {
    const {inviteCodes} = this.state;
    const generatedInviteCode = this.generateUIDWithCollisionChecking(inviteCodes);
    console.log({generatedInviteCode});
    this.setState({
      inviteCodes: {
        ...inviteCodes,
        [generatedInviteCode]: houseUuid,
      },
    });
    console.log({generatedInviteCode});
    return generatedInviteCode;
  }
  getInviteCode = (houseUuid) => {
    const {inviteCodes, houseInfo} = this.state;
    for (let inviteCode in inviteCodes) {
      if (inviteCodes[inviteCode] === houseUuid) {
        console.log({inviteCode});
        return inviteCode;
      }
    }
    console.log("Returning null invite code");
    return null;
  }
  joinHouseFromInvite = (inviteCode) => {
    const houseUuid = this.state.inviteCodes[inviteCode];
    this.editHouse(houseUuid);
    // this.removeInviteCode(inviteCode);
  }
  removeInviteCode = (inviteCode) => {
    const {inviteCodes} = this.state;
    this.setState({
      inviteCodes: {
        ...inviteCodes,
        [inviteCode]: null,
      },
    })
  }
  createNewHouse = () => {
    const {houses} = this.state;
    const houseUuid = this.generateUIDWithCollisionChecking(houses);
    this.createInviteCode(houseUuid);
    return houseUuid;
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
      console.log({newHouseInfo});
      houseInfo = {
        ...newHouseInfo,
        members: {
          ...members,
          [uid]: user.first_name
        },
      };
      this.setState({houseInfo, user, houseUuid});
    }).catch(error => {
      console.log("[editHouse] ", error);
    });

    // // 2. Update the current state with new houseUuid
    // base
    //   .fetch(`houses/${houseUuid}`, {
    //     context: this,
    //   })
    //   .then(data => {
    //     this.setState({
    //       houseInfo: data,
    //     });

    //     // 3. Synchronize with new houseUuid
    //     this.synchronizeHouseStatesWithFirebase(houseUuid);

    //     let {user, houseInfo, uid, groceryItems} = this.state;
    //     let {members = {}} = houseInfo;
    //     let {participants = {}} = groceryItems;
    //     user = {
    //       ...user,
    //       houses: {
    //         ...user.houses,
    //         [houseUuid]: Date.now()
    //       }
    //     };
    //     houseInfo = {
    //       ...newHouseInfo,
    //       members: {
    //         ...members,
    //         [uid]: user.first_name
    //       },
    //     };
    //     this.setState({houseInfo, user, houseUuid});
    //   })

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
          this.removeInviteCode(this.getInviteCode(houseUuid));
        }
        this.setState({houseInfo, user});

        // 5. Redirect to the new houseUuid
        const newHouseUuid = this.getNewLastHouse(oldHouseUuid);
        if (this.houseInfoRef) {
          this.removeHouseBindingFromFirebase();
        }
        if (!newHouseUuid) {
          // User does not have any other house :(
          // Show the invite screen
          this.setState({
            houseUuid: null,
          });
        } else {
          // if (this.houseInfoRef) {
          //   this.removeHouseBindingFromFirebase();
          // }

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

  renderSecondNav() {
    if (!Boolean(this.state.houseUuid)) {
      return (
        <Settings
          key='settings'
          user={this.state.user}
          houses={this.state.houses}
        />
      );
    }
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
    );
  }

  renderSelectedPage() {
    const {selectedIndex} = this.state;
    switch (selectedIndex) {
      case 0:
        if (!this.state.houseUuid) {
          return (
            <Join
              isValidInviteCode={this.isValidInviteCode}
              editHouse={this.editHouse}
              joinHouseFromInvite={this.joinHouseFromInvite}
              createNewHouse={this.createNewHouse}
            />
          );
        }
        return (
          <House
            uid={this.state.uid}
            user={this.state.user}
            editHouse={this.editHouse}
            leaveHouse={this.leaveHouse}
            houseUuid={this.state.houseUuid}
            houseInfo={this.state.houseInfo}
            getInviteCode={this.getInviteCode}
            createNewHouse={this.createNewHouse}
            houses={this.state.houses}
            createInviteCode={this.createInviteCode}
            joinHouseFromInvite={this.joinHouseFromInvite}
            isValidInviteCode={this.isValidInviteCode}
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
        return this.renderSecondNav();
      case 3:
        return (
          <QuietHours
            key='quietHours'
            uid={this.state.uid}
            user={this.state.user}
            houseUuid={this.state.houseUuid}
            houseInfo={this.state.houseInfo}
          />
        );
      case 4:
        return (
          <Settings
            key='settings'
            user={this.state.user}
            houses={this.state.houses}
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

    const HomeIcon = () =>
    <MaterialIcons color="black" name="home" size={24} />

    const ToDoIcon = () =>
    <FontAwesome name="pencil-square-o" size={24} />

    const GroceryIcon = () =>
    <MaterialIcons color="black" name="local-grocery-store" size={24} />

    const QuietHrsIcon = () =>
    <MaterialIcons color="black" name="access-time" size={24} />

    const SettingsIcon = () =>
    <MaterialIcons color="black" name="settings" size={24} />

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {this.renderSelectedPage()}
        </View>
        {!Boolean(this.state.houseUuid) ? (
          <View style={styles.bottomNav} key='noHouseBottomNav'>
            <BottomNavigation
              selectedIndex={this.state.selectedIndex}
              onSelect={this.onSelect}>
              <BottomNavigationTab icon={HomeIcon} />
              <BottomNavigationTab icon={ToDoIcon} />
              <BottomNavigationTab icon={SettingsIcon} />
              {/* Below is temporary */}
              {/* <BottomNavigationTab title='Logout'/> */}
            </BottomNavigation>
          </View>
        ) : (
          <View style={styles.bottomNav} key='bottomNav'>
            <BottomNavigation
              selectedIndex={this.state.selectedIndex}
              onSelect={this.onSelect}>
              <BottomNavigationTab icon={HomeIcon} />
              <BottomNavigationTab icon={ToDoIcon} />
              <BottomNavigationTab icon={GroceryIcon} />
              <BottomNavigationTab icon={QuietHrsIcon} />
              <BottomNavigationTab icon={SettingsIcon} />
              {/* Below is temporary */}
              {/* <BottomNavigationTab title='Logout'/> */}
            </BottomNavigation>
          </View>
        )}
      </View>
    )
  }
}

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
  logoutBtn: {
    position: 'absolute',
    bottom: 20,
    top: 500,
    left: 0,
  },
  bottomNav: {
    justifyContent: 'flex-start',
    height: Platform.OS === 'ios' ? 70 : 50,
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    width: '100%',
    flex: 1,
  },
  hideBottomNav: {
    display: 'none',
  }
});
