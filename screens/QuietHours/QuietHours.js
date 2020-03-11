import * as React from 'react';
import {Alert, StyleSheet, View, ScrollView} from 'react-native';
import {Button, Layout, Text} from 'react-native-ui-kitten';
import TimePickerModal from './TimePickerModal';
import Constants from 'expo-constants';
import * as firebase from "firebase";
import Toast, {DURATION} from "react-native-easy-toast";

export default class TodoList extends React.Component {
  state = {
    addClicked: false,
    editClicked: false,
    editItemKey: null
  }

  sendPushNotification = async () => {
    console.log("Sending out push notifications to quiet roommates.");

    let recipients = [];

    for (const [key] of Object.entries(this.props.houseInfo.members)) {
      if (key == this.props.uid) {
        //Don't send notification to current user
        continue;
      }

      // Otherwise add all relevant house members notification token to
      // JSON Body so we can do a batch request to expo notification service
      await firebase
        .database()
        .ref(`users/${key}/notification_token`)
        .once('value', function (snapshot) {
          const notificationToken = snapshot.val()
          console.log(`User: ${key} | Token: ${notificationToken}`)
          recipients.push(notificationToken)
        });
    }

    console.log("Recipients: ", recipients)

    let response = fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: recipients,
        sound: 'default',
        title: 'Locus Alert (闭嘴)',
        body: 'Your roommate would like you to keep it down.'
      })
    })

    this.refs.toast.show('Alert sent!');
  }

  renderTimePicker(timeSelector, edit) {
    if (timeSelector !== 'weekday' && timeSelector !== 'weekend') {
      console.log('Incorrect usage of renderTimePicker function');
      return;
    }

    return (
      <TimePickerModal
        uid={this.props.uid}
        user={this.props.user}
        houseUuid={this.props.houseUuid}
        houseInfo={this.props.houseInfo}
        timeSelector={timeSelector}
        edit={edit}
      />
    );
  }

  renderUserQuietHours() {
    const {uid, houseInfo} = this.props;

    if (!houseInfo.quiet_hours) {
      return (
        <View style={styles.container}>
          <Text style={styles.text} category='h5'>
            You haven't set any hours yet!
          </Text>
          {this.renderTimePicker('weekday')}
          {this.renderTimePicker('weekend')}
        </View>
      );
    } else {
      const userHours = houseInfo.quiet_hours[uid];
      console.log(userHours);

      if (!userHours) {
        return (
          <View style={styles.container}>
            <Text style={styles.text} category='h5'>
              You haven't set any hours yet!
            </Text>
            {this.renderTimePicker('weekday')}
            {this.renderTimePicker('weekend')}
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <Text style={styles.text} category='h5'>
              Your Quiet Hours
            </Text>
            <View style={styles.container}>
              {userHours.weekday ?
                <View style={styles.yourHoursContainer}>
                  <Text style={styles.text}>Weekday Hours: {userHours.weekday}</Text>
                  {this.renderTimePicker('weekday', true)}
                </View>
                :
                this.renderTimePicker('weekday')
              }
              {userHours.weekend ?
                <View style={styles.yourHoursContainer}>
                  <Text style={styles.text}>Weekend Hours: {userHours.weekend}</Text>
                  {this.renderTimePicker('weekend', true)}
                </View>
                :
                this.renderTimePicker('weekend')
              }
            </View>
          </View>

        );
      }
    }
  }

  renderHouseQuietHours() {
    const {uid, houseInfo} = this.props;

    let houseQuietHours = houseInfo.quiet_hours;
    let members = houseInfo.members;

    return (
      <View style={styles.container}>
        <Text style={styles.text} category='h5'>
          Roommate Quiet Hours
        </Text>
        {houseQuietHours && Object.entries(houseQuietHours)
          .filter((entry) => {
            return entry[0] != uid;
          })
          .map((entry) => {
            return (
              <View key={entry[0]} style={styles.houseHoursContainer}>
                <View style={styles.memberName}>
                  <Text numberOfLines={1} style={styles.memberText}> {members[entry[0]]}</Text>
                </View>
                <View style={styles.verticalStack}>
                  <Text>Weekday: {entry[1].weekday}</Text>
                  <Text>Weekend: {entry[1].weekend}</Text>
                </View>
              </View>
            );
          })}
      </View>

    );
  }

  renderShutUp() {
    return(
        <Button
          status={'danger'}
          onPress={this.sendPushNotification}
          style={styles.shutUp}
        >
          Be Quiet!
        </Button>
    );
  }

  render() {
    return (
      <Layout style={styles.container}>
        <Layout style={styles.header}>
          <Text style={styles.headerText} category='h5'>Quiet Hours</Text>
          {this.renderShutUp()}
        </Layout>
        <Toast ref="toast" duration={DURATION.LENGTH_SHORT}/>
        {this.renderUserQuietHours()}
        {this.renderHouseQuietHours()}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  yourHoursContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  houseHoursContainer: {
    flexDirection: 'row',
    // position: 'relative',
  },
  container: {
    flex: 1,
    position: 'relative'
  },
  content: {
    flex: 1,
  },
  text: {
    padding: 20,
    // flex: 1,
    flexDirection: 'row'
  },
  headerText: {
    padding: 20,
    flex: 1,
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'black',
  },
  memberName: {
    width: 120,
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 5,
    borderColor: '#598bff',
    backgroundColor: '#131700',
    borderWidth: 2,
    marginRight: 30,
    marginLeft: 23,
    marginTop: 10,
  },
  memberText: {
    color: '#ffffff',
    alignSelf: 'center'
  },
  verticalStack: {
    flexDirection: 'column',
    alignSelf: 'flex-end',
  },
  shutUp: {
    position: 'relative',
    marginTop: 2,
    right: 10,
  }
});
