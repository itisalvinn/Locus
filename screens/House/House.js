import * as React from 'react';
import Toast, {DURATION} from 'react-native-easy-toast';
import {StyleSheet, View, Clipboard, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {Layout, Text, Button, Input, Modal} from 'react-native-ui-kitten';
import Card from './Card';
import EditModal from '../TodoList/EditModal';
import Constants from 'expo-constants';

export default class House extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowInvite: false,
      shouldShowCreate: false,
      shouldShowLeaveHouse: false,
      showLeaveBtn: false,
      shouldShowJoin: false,
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

  createNewHouse = (houseName) => {
    if (!houseName || !houseName.length) {
      this.refs.toast.show("House name needs to be of valid length!");
      return;
    }
    const newHouseUuid = this.props.createNewHouse();
    this.props.editHouse(newHouseUuid, {name: houseName});
    this.hideCreateModal();
  }

  showJoinModal = () => {
    this.setState({
      shouldShowJoin: true,
    });
  }

  hideJoinModal = () => {
    this.setState({
      shouldShowJoin: false,
    })
  }

  joinHouse = (inviteCode) => {
    const isValidCode = this.props.isValidInviteCode(inviteCode);
    if (isValidCode) {
      // Valid code
      this.props.joinHouseFromInvite(inviteCode);
    } else {
      // Invalid code
      this.refs.toast.show('Invalid Code');
    }
    this.hideJoinModal();
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
    const {showLeaveBtn} = this.state;
    this.setState({
      showLeaveBtn: !showLeaveBtn,
    })
  }

  showCardLeaveBtn = () => {
    this.setState({
      showLeaveBtn: true
    });
  }

  hideCardLeaveBtn = () => {
    this.setState({
      showLeaveBtn: false
    });
  }

  renderHouseNames = () => {
    const {user, houses} = this.props;
    console.log({houses});
    return (
      <Layout style={styles.otherHousesContainer}>
        {user.houses && Object.keys(user.houses).map(houseUuid => {
          if (houseUuid === this.props.houseUuid) return null;
          return (
            <TouchableOpacity key={houseUuid} onPress={() => this.props.editHouse(houseUuid)}>
              <Layout level='2' style={styles.otherHouseWrapper}>
                <Text style={styles.otherHouseName} category='s1'>Switch to
                  house: {houses[houseUuid] && houses[houseUuid].name || houseUuid}
                </Text>
              </Layout>
            </TouchableOpacity>
          );
        })}
      </Layout>
    );
  }

  render() {
    const {shouldShowInvite, shouldShowCreate, shouldShowLeaveHouse, showLeaveBtn, shouldShowJoin} = this.state;
    return (
      <View style={styles.container}>

        <Layout level='1' style={styles.header}>
          <Text style={styles.headerText} category='h5'>Hi, {this.props.user && this.props.user.first_name}</Text>
        </Layout>

        <ScrollView style={styles.houseInfo}>
          {this.props.houseInfo ? (
            <View style={styles.cardWrapper}>
              <View style={styles.currentHouseHeader}>
                <Text category='h5' style={styles.currentHouseName}>{this.props.houseInfo.name}</Text>
                <Button onPress={this.showInviteModal} appearance='outline'>Invite Code</Button>
              </View>
              <Card houseInfo={this.props.houseInfo} onCardPress={this.onCardPress}
                    resetCardPress={this.hideCardLeaveBtn}/>

              {showLeaveBtn ? (
                <Button style={styles.leaveBtn} status='danger' onPress={this.showLeaveModal}>Leave</Button>
              ) : null}
            </View>
          ) : null}

          {this.renderHouseNames()}
        </ScrollView>


        {shouldShowCreate || shouldShowInvite || shouldShowLeaveHouse || shouldShowJoin ? (
          <Layout level='2' style={styles.overlay}/>
        ) : null}

        {shouldShowInvite ? (
          <View style={styles.editModalContainer}>
            <EditModal
              title={'Invite Code'}
              btnText={'Copy Code'}
              onClose={this.hideInviteModal}
              onSubmit={this.copyInviteCode}
              text={this.props.getInviteCode(this.props.houseUuid)}
              autoFocus={false}
              placeholder='Invite code...'
              clearOnSubmit={false}
              disabled={true}
              style={{...styles.editModal, ...styles.editInviteModal}}/>
          </View>
        ) : null}

        {shouldShowCreate ? (
          <View style={styles.editModalContainer}>
            <EditModal
              title={'Create House'}
              btnText={'Create House'}
              onClose={this.hideCreateModal}
              onSubmit={this.createNewHouse}
              placeholder='Name...'/>
          </View>
        ) : null}

        {shouldShowJoin ? (
          <View style={styles.editModalContainer}>
            <EditModal
              title={'Join House'}
              btnText={'Join House'}
              onClose={this.hideJoinModal}
              onSubmit={this.joinHouse}
              placeholder='Invite code...'/>
          </View>
        ) : null}

        <Modal visible={shouldShowLeaveHouse} allowBackdrop={true}>
          <Layout
            level='2'
            style={styles.modalContainer}>
            <Text category='s1'>Are you sure you want to leave <Text
              status='primary'>{this.props.houseInfo ? this.props.houseInfo.name : ''}?</Text></Text>
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

        <Layout level='3' style={{...styles.createBtnWrapper, ...styles.createBtnBackdrop}}/>
        <View style={styles.createBtnWrapper}>
          <Button onPress={this.showJoinModal} style={styles.leftBtn}>Join</Button>
          <Button onPress={this.showCreateModal} style={styles.rightBtn}>Create</Button>
        </View>
      </View>
    )
      ;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: 'black',
  },
  headerText: {
    padding: 20,
    flexDirection: 'row',
    color: 'white',
  },
  houseInfo: {
    paddingTop: 20
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
    borderColor: "#eee",
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    width: "100%",
    padding: 20,
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: 85,
    backgroundColor: 'white'
  },
  createBtnBackdrop: {
    opacity: 0.3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
    zIndex: 10,
  },
  otherHouseWrapper: {
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
  },
  editModalContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
    width: "100%",
    zIndex: 10,
    position: 'absolute',
  },
  editModal: {
    position: 'relative',
    zIndex: 11,
    display: 'flex',
    width: '100%',
    height: 170,
    borderColor: "#eee",
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderRadius: 5,
  },
  editInviteModal: {
    width: "90%",
  },
  content: {
    paddingBottom: 100,
  }
});
