import * as React from 'react';
import { StyleSheet, AsyncStorage, View, TouchableOpacity} from 'react-native';
import { Button, Layout, Text, List, ListItem} from 'react-native-ui-kitten';
import { RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import {authSignOut} from '../../firebase';

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
  render() {
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
        {/*quiet hours button needed?*/}
        <View style={styles.listItem}>
          <Text style={styles.rowText}>User Info</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.rowText}> First Name: {this.props.user.first_name} </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.rowText}> Last Name: {this.props.user.last_name} </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.rowText}> Email: {this.props.user.email} </Text>
        </View>
        <View style={styles.listItem}>
        <Text style={styles.rowText}> Houses: {Object.keys(this.props.user.houses).join(", ")} </Text>
        </View>
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
    paddingTop: 20,
  },
  logoutBtn: {
    position: 'absolute',
    marginTop: -3,
    alignSelf: 'flex-end',
    right: 4,
  }
});
