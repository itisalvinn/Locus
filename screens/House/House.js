import * as React from 'react';
import Toast, {DURATION} from 'react-native-easy-toast';
import { StyleSheet, View, Clipboard, TouchableOpacity} from 'react-native';
import { Layout, Text, Button, Input, Modal} from 'react-native-ui-kitten';
import Card from './Card';

export default class House extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowInvite: false,
      shouldShowCreate: false,
      shouldShowLeaveHouse: false,
      showLeaveBtn: false,
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
    const inviteCode = this.props.getInviteCode(this.props.houseUuid);
    Clipboard.setString(inviteCode);
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

  onCardPress = () => {
    console.log("Card pressed");
    const {showLeaveBtn} = this.state;
    this.setState({
      showLeaveBtn: !showLeaveBtn,
    })
  }

  renderHouseNames = () => {
    const {user, houses} = this.props;
    console.log({houses});
    return (
      <Layout style={styles.otherHousesContainer}>
        {Object.keys(user.houses).map(houseUuid => {
          if (houseUuid === this.props.houseUuid) return null;
          return (
            <TouchableOpacity key={houseUuid} onPress={() => this.props.editHouse(houseUuid)}>
              <Layout level='2' style={styles.otherHouseWrapper}>
                <Text style={styles.otherHouseName} category='s1'>Switch to house: {houses[houseUuid] && houses[houseUuid].name || houseUuid}
                </Text>
              </Layout>
            </TouchableOpacity>
          );
        })}
      </Layout>
    );
  }

  render() {
    console.log(this.state);
    const {shouldShowInvite, shouldShowCreate, shouldShowLeaveHouse, showLeaveBtn} = this.state;
    const {houses, houseUuid, user} = this.props;
  return (
    <View style={styles.container}>
      <Layout level='1' style={styles.header}>
        <Text style={styles.text} category='h3'>Hi, {this.props.user && this.props.user.first_name}</Text>
      </Layout>

      {this.props.houseInfo ? (
          <View style={styles.cardWrapper}>
            <View style={styles.currentHouseHeader}>
              <Text category='h5' style={styles.currentHouseName}>{this.props.houseInfo.name}</Text>
              <Button onPress={this.showInviteModal} appearance='outline'>Invite Code</Button>
            </View>
            <Card houseInfo={this.props.houseInfo} onCardPress={this.onCardPress} />

          {showLeaveBtn ? (
            <Button style={styles.leaveBtn} status='danger' onPress={this.showLeaveModal}>Leave</Button>
          ) : null}
          </View>
      ) : null}

      {this.renderHouseNames()}

      {shouldShowCreate || shouldShowInvite || shouldShowLeaveHouse ? (
        <Layout level='2' style={styles.overlay} />
      ) : null}

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
            <Button status='danger' onPress={this.hideInviteModal} style={styles.leftBtn}>
              Cancel
            </Button>
            <Button onPress={this.copyInviteCode} appearance='outline' style={styles.rightBtn}>
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
            <Button status='danger' onPress={this.hideCreateModal} style={styles.leftBtn}>
              Cancel
            </Button>
            <Button onPress={this.createNewHouse} appearance='outline' style={styles.rightBtn}>
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
            <Button status='danger' onPress={this.hideLeaveModal} style={styles.leftBtn}>
              Cancel
            </Button>
            <Button onPress={this.leaveHouse} appearance='outline' style={styles.rightBtn}>
              Leave House
            </Button>
          </Layout>
          </Layout>
      </Modal>

      <Toast ref="toast" duration={DURATION.LENGTH_SHORT}/>

      <View style={styles.createBtnWrapper}>
        <Button onPress={this.showCreateModal}>Create New House</Button>
      </View>
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
    marginLeft: 20,
    marginRight: 20,
  },
  currentHouseHeader: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  leaveHouseBtn: {
    marginLeft: 20,
    flexDirection: 'row',
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
  leftBtn: {
    marginRight: 5,
  },
  rightBtn: {
    marginLeft: 5,
  },
  currentHouseName: {
    flex: 1,
  },
  createBtnWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: 300,
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    zIndex: 10,
  },
  otherHouseWrapper: {
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderColor: "#d9e4ff",
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: "#f2f6ff",
  },
  otherHouseName: {
    color: "#3366FF",
  },
  leaveBtn: {
    marginTop: 5,
  },
  otherHousesContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    margin: 20,
    paddingTop: 20,
  }
});