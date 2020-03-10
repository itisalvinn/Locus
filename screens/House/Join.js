import * as React from 'react';
import { StyleSheet, View, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView} from 'react-native';
import { Layout, Text, Button, Input} from 'react-native-ui-kitten';
import Constants from 'expo-constants';

export default class Join extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldCreateHouse: false,
      inviteCode: null,
      houseName: null,
      invalidCodeError: false,
      invalidHouseNameError: false
    }
  }

  componentDidMount() {
    // this.props.editHouse("demo-housing2");
    // this.props.leaveHouse("demo-housing2");
  }

  onInviteCodeSubmit = () => {
    // TODO: check if valid invite code
    const {inviteCode} = this.state;
    const isValidCode = this.props.isValidInviteCode(inviteCode);
    if (isValidCode) {
      // Valid code
      this.setState({ invalidCodeError: false });
      this.props.joinHouseFromInvite(inviteCode);
    } else {
      // Invalid code
      this.setState({ invalidCodeError: true });
    }
  }

  toggleCreateHouse = () => {
    const { shouldCreateHouse } = this.state;
    this.setState({
      shouldCreateHouse: !shouldCreateHouse
    });
  }

  onHouseNameChange = (text) => {
    this.setState({
      houseName: text,
      invalidHouseNameError: false,
    });
  }

  onInviteCodeChange = (text) => {
    this.setState({
      inviteCode: text,
      invalidCodeError: false,
    });
  }

  onCreateSubmit = () => {
    const {houseName} = this.state;
    if (!houseName || !houseName.length) {
      this.setState({
        invalidHouseNameError: true,
      })
      return;
    }
    this.setState({
      invalidHouseNameError: false,
    });
    const newHouseUuid = this.props.createNewHouse();
    this.props.editHouse(newHouseUuid, {name: houseName});
  }

  render() {
    const { shouldCreateHouse, invalidCodeError, invalidHouseNameError } = this.state;
    return (
<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Layout style={styles.container}>
    <KeyboardAvoidingView style={styles.content} behavior="padding" enabled>
        <Layout style={styles.header}>
          <Text style={styles.text} category='h2'>{shouldCreateHouse ? "Create a House" : "Join a House"}</Text>
          </Layout>

        {/* <View style={styles.content}> */}
            <Text style={styles.text}>
              {shouldCreateHouse ? "Please input a house name to create a house:" : "You're currently not in any house! To join a house, please input an invite code below:"}
            </Text>
            {shouldCreateHouse ? (
              <Input
                style={styles.input}
                status={invalidHouseNameError ? 'danger' : 'primary' }
                placeholder=''
                label='House Name'
                onChangeText={this.onHouseNameChange}
                caption={invalidHouseNameError ? 'Invalid House Name Length' : null}
              />
            ) : (
              <Input
                style={styles.input}
                status={invalidCodeError ? 'danger' : 'primary' }
                placeholder=''
                label='Invite Code'
                onChangeText={this.onInviteCodeChange}
                caption={invalidCodeError ? 'Invalid Invite Code' : null}
              />
            )}
            
            {shouldCreateHouse ? (
              <View style={styles.btnSection}>
                <Button onPress={this.onCreateSubmit} style={styles.btn}>Create</Button>
                <Button onPress={this.toggleCreateHouse} style={styles.btn}appearance='outline'>Joining a house?</Button>
              </View>
            ) : (
              <View style={styles.btnSection}>
                <Button onPress={this.onInviteCodeSubmit} style={styles.btn}>Join</Button>

                <Button onPress={this.toggleCreateHouse} style={styles.btn} appearance='outline'>Creating a house?</Button>
              </View>
            )}
        {/* </View> */}
        </KeyboardAvoidingView>
      </Layout>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  content: {
    justifyContent: 'center',
    height: "100%",
    position: "absolute",
    display: "flex",
    width: "100%",
  },
  section: {
    marginBottom: 20,
    width: "100%",
  },
  text: {
    padding: 20,
    paddingBottom: 0,
  },
  input: {
    margin: 20,
    marginBottom: 15,
  },
  btn: {
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  btnSection: {
    width: '100%',
  }
});