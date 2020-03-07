import * as React from 'react';
import Toast, {DURATION} from 'react-native-easy-toast';
import { StyleSheet, View, Clipboard} from 'react-native';
import { Layout, Text, Button, Input, Modal} from 'react-native-ui-kitten';
import Card from './Card';

export default class House extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowInvite: false,
      shouldShowCreate: false,
      shouldShowLeaveHouse: false,
    }
  }

  showInviteModal = () => {
    this.setState({
      shouldShowInvite: true,
    });
  }

  hideInviteModal = () => {
    this.setState({
      shouldShowInvite: false,
    });
  }

  copyInviteCode = () => {
    Clipboard.setString(this.props.getInviteCode(this.props.houseUuid));
    this.refs.toast.show('Copied!');
  }

  showCreateModal = () => {
    this.setState({
      shouldShowCreate: true,
    });
  }

  hideCreateModal = () => {
    this.setState({
      shouldShowCreate: false,
    })
  }

  createNewHouse = () => {
    const houseName = this.refs.createHouse.textInputRef.current._lastNativeText;
    const newHouseUuid = this.props.createNewHouse();
    this.props.editHouse(newHouseUuid, {name: houseName});
    this.hideCreateModal();
  }

  showLeaveModal = () => {
    this.setState({
      shouldShowLeaveHouse: true,
    });
  }
  
  hideLeaveModal = () => {
    this.setState({
      shouldShowLeaveHouse: false,
    });
  }

  leaveHouse = () => {
    this.props.leaveHouse(this.props.houseUuid);
    this.hideLeaveModal();
  }

  render() {
    console.log(this.state);
    const {shouldShowInvite, shouldShowCreate, shouldShowLeaveHouse} = this.state;
  return (
    <View style={styles.container}>
      <Layout level='1' style={styles.header}>
        <Text style={styles.text} category='h3'>Hi, {this.props.user && this.props.user.first_name}</Text>
      </Layout>

    <Layout level='1'>
      {this.props.houseInfo ? (
        <View style={styles.cardWrapper}>
          <View style={styles.currentHouseHeader}>
            <Text category='h5'>{this.props.houseInfo.name}</Text>
            <View style={styles.leaveHouseBtn}>
            <Button onPress={this.showInviteModal}>Invite Code</Button>
              <Button status='danger' onPress={this.showLeaveModal}>Leave House</Button>
            </View>
          </View>
          <Card houseInfo={this.props.houseInfo} />
        </View>
      ) : null}
      </Layout>

      <Modal visible={shouldShowInvite} allowBackdrop={true}>
        <Layout
          level='2'
          style={styles.modalContainer}>
          <Input
                style={styles.input}
                status='primary'
                value={this.props.getInviteCode(this.props.houseUuid)}
                label='Invite Code'
              />
          <Layout style={styles.btnContainer} level='2'>
            <Button status='danger' onPress={this.hideInviteModal} style={styles.cancelBtn}>
              Cancel
            </Button>
            <Button onPress={this.copyInviteCode} appearance='outline' style={styles.copyBtn}>
              Copy Code
            </Button>
          </Layout>
        </Layout>
      </Modal>

      <Modal visible={shouldShowCreate} allowBackdrop={true}>
        <Layout
          level='2'
          style={styles.modalContainer}>
            <Input
                style={styles.input}
                status='primary'
                placeholder=''
                label='House Name'
                onChangeText={this.onHouseNameChange}
                ref="createHouse"
              />
              <Layout style={styles.btnContainer} level='2'>
            <Button status='danger' onPress={this.hideCreateModal} style={styles.cancelBtn}>
              Cancel
            </Button>
            <Button onPress={this.createNewHouse} appearance='outline' style={styles.copyBtn}>
              Create House
            </Button>
          </Layout>
          </Layout>
      </Modal>

      <Modal visible={shouldShowLeaveHouse} allowBackdrop={true}>
        <Layout
          level='2'
          style={styles.modalContainer}>
            <Text category='s1'>Are you sure you want to leave <Text status='primary'>{this.props.houseInfo.name}?</Text></Text>
              <Layout style={styles.btnContainer} level='2'>
            <Button status='danger' onPress={this.hideLeaveModal} style={styles.cancelBtn}>
              Cancel
            </Button>
            <Button onPress={this.leaveHouse} appearance='outline' style={styles.copyBtn}>
              Leave House
            </Button>
          </Layout>
          </Layout>
      </Modal>

      <Toast ref="toast" duration={DURATION.LENGTH_SHORT}/>
      <Button onPress={this.showCreateModal}>Create New House</Button>
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: 20,
  },
  text: {
    padding: 20,
    marginTop: 20,
    flex: 1,
  },
  cardWrapper: {
    alignItems: 'center',
  },
  currentHouseHeader: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  leaveHouseBtn: {
    marginLeft: 20,
  },
  modalContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#f2f6ff",
    borderRadius: 5,
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    marginRight: 5,
  },
  copyBtn: {
    marginLeft: 5,
  }
});