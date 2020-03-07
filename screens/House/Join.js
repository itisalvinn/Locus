import * as React from 'react';
import { StyleSheet, View, Picker} from 'react-native';
import { Layout, Text, Button, Input} from 'react-native-ui-kitten';

export default class Join extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldCreateHouse: false,
      inviteCode: null,
      houseName: null,
      invalidCodeError: null,
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
    });
  }

  onInviteCodeChange = (text) => {
    this.setState({
      inviteCode: text,
    });
  }

  render() {
    const { shouldCreateHouse, invalidCodeError } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.text}>
              {shouldCreateHouse ? "Please input a house name to create a house:" : "You're currently not in any house! To join a house, please input an invite code below:"}
            </Text>
            {shouldCreateHouse ? (
              <Input
                style={styles.input}
                status='primary'
                placeholder=''
                label='House Name'
                onChangeText={this.onHouseNameChange}
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
                <Button onPress={this.onInviteCodeSubmit} style={styles.btn}>Create</Button>
                <Button onPress={this.toggleCreateHouse} style={styles.btn}>Joining a house?</Button>
              </View>
            ) : (
              <View style={styles.btnSection}>
                <Button onPress={this.onInviteCodeSubmit} style={styles.btn}>Join</Button>

                <Button onPress={this.toggleCreateHouse} style={styles.btn}>Creating a house?</Button>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  content: {
    marginTop: 120,
  },
  section: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  text: {
    padding: 20,
    paddingBottom: 0,
    marginTop: 20,
    fontSize: 18,
  },
  input: {
    margin: 25,
    marginBottom: 10,
  },
  btn: {
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  btnSection: {
    flexDirection: 'row',
  }
});