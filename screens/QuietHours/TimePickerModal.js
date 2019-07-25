import React, {Component} from 'react';
import {Modal, View, Alert, StyleSheet, DatePickerIOS} from 'react-native';
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

    this.setTime = this.setTime.bind(this);
  }

  setTime(newDate) {
    this.setState({time: newDate});
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleTimeSubmission = () => {
    console.log("Setting quiet hours in firebase.")

    const dataRef = 'houses/' + this.props.houseUuid + '/quiet_hours/' +
      this.props.uid;

    console.log('Reference is at: ', dataRef);
    console.log('Time to save is:', this.state.time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));

    let quietHours = {};
    quietHours[this.props.timeSelector] = this.state.time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    firebase
      .database()
      .ref(dataRef)
      .update(quietHours)
      .then(function (snapshot) {
        console.log('Saved quiet hours in firebase.');
      })
      .catch((error) => {
        console.log(error);
      });

    this.setModalVisible(!this.state.modalVisible);
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

    this.setModalVisible(!this.state.modalVisible);
  }

  render() {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <DatePickerIOS
              date={this.state.time}
              onDateChange={this.setTime}
              mode={'time'}
              // initialDate={something}
            />
            <Button onPress={this.handleTimeSubmission}>
              Set Hours
            </Button>
            <Button onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}>
              Cancel
            </Button>
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
          </View>
        </Modal>
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