import React, {Component} from 'react';
import {Modal, View, Alert, StyleSheet} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Button} from 'react-native-ui-kitten';
import * as firebase from 'firebase';

export default class TimePickerModal extends Component {
  state = {
    modalVisible: false,
    time: new Date()
  };

  constructor(props) {
    super(props);
    if (this.props.edit) {
      this.buttonText = 'Edit';
    } else if (this.props.timeSelector === 'weekday') {
      this.buttonText = 'Set weekday quiet hours';
    } else if (this.props.timeSelector === 'weekend') {
      this.buttonText = 'Set weekend quiet hours';
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleTimeSubmission = (date) => {
    this.setModalVisible(false);
    console.log("Setting quiet hours in firebase.")

    const dataRef = 'houses/' + this.props.houseUuid + '/quiet_hours/' +
      this.props.uid;

    const dateToSave = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    console.log('Reference is at: ', dataRef);
    console.log('Time to save is:', dateToSave);

    let quietHours = {};
    quietHours[this.props.timeSelector] = dateToSave;

    firebase
      .database()
      .ref(dataRef)
      .update(quietHours)
      .then(() => {
        console.log('Saved quiet hours in firebase.');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleRemoveTime = () => {
    console.log("Removing time from firebase.")

    const dataRef = 'houses/' + this.props.houseUuid + '/quiet_hours/' +
      this.props.uid + '/' + this.props.timeSelector;

    console.log('Reference is at: ', dataRef);

    firebase
      .database()
      .ref(dataRef)
      .remove()
      .then(function (snapshot) {
        console.log('Removed quiet hours in firebase.');
      })
      .catch((error) => {
        console.log(error);
      });

    this.setModalVisible(false);
  }

  render() {
    console.log(this.state);
    const {modalVisible} = this.state;
    return (
      <View>
        <DateTimePickerModal
          isVisible={modalVisible}
          mode="time"
          onConfirm={this.handleTimeSubmission}
          timePickerModeAndroid="spinner"
          onCancel={() => {
            this.setModalVisible(false)
          }}
        />
        {this.props.edit &&
        (
          <Button
            status={'danger'}
            onPress={this.handleRemoveTime}
          >
            Delete Hours
          </Button>
        )
        }
        <View style={styles.container}>
          <Button
            appearance='outline'
            style={styles.button}
            onPress={() => {
              this.setModalVisible(true);
            }}>
            {this.buttonText}
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  button: {
    // width: '80%',
    paddingBottom: 10,
    flexDirection: 'row'
  }
});