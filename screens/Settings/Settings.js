import * as React from 'react';
import { StyleSheet, AsyncStorage, View, TouchableOpacity} from 'react-native';
import { Button, Layout, Text, List, ListItem} from 'react-native-ui-kitten';
import { RectButton } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import {authSignOut} from '../../firebase';
import Constants from 'expo-constants';

export default class Settings extends React.Component {
  state = {

  }

  onSuccess = () => {
    return this.props.navigation.navigate('LoginScreen');
  }

  onError = () => {
    //alert("Something went wrong logging out.");
  }

  signout = () => {
    authSignOut(this.onSuccess, this.onError);
  }

  renderHouseNames = () => {
    const {user, houses} = this.props;
    return user.houses && Object.keys(user.houses).map(houseUuid => houses[houseUuid].name || houseUuid).join(", ");
  }

  render() {
    const {user} = this.props;
    return (
      <Layout style={styles.container}>
        <Layout style={styles.header}>
          <Text style={styles.text} category='h5'>Settings</Text>
          <Button
            title="Log out"
            onPress={this.signout}
            style={styles.logoutBtn}
          >
          Log Out
          </Button>

        </Layout>
        {/*quiet hours active / not active needed?*/}
        <View style={styles.listItem}>
          <FontAwesome name="user" size={32}/>
          <Text style={styles.rowText}>   User Info </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.rowText}> First Name {"\n"} {this.props.user.first_name} </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.rowText}> Last Name {"\n"} {this.props.user.last_name} </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.rowText}> Email {"\n"} {this.props.user.email} </Text>
        </View>
        {user.houses ? (
          <View style={styles.listItem}>
            <Text style={styles.rowText}> Houses {"\n"} {this.renderHouseNames()} </Text>
          </View>
        ) : null}
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
    paddingTop: Constants.statusBarHeight,
  },
  content: {
    flex: 1,
  },
  text: {
    padding: 20,
    flex: 1,
    color: 'white',
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
  listItem: {
    borderBottomColor: '#f4f4f6',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
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
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: 'black',
  },
  logoutBtn: {
    position: 'relative',
    marginTop: 2,
    right: 10,
  }
});
