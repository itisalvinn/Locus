import * as React from 'react';
import { StyleSheet, AsyncStorage, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { Button, Layout, Text, List, ListItem, ListItemProps, ListProps, CheckBox } from 'react-native-ui-kitten';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import EditModal from './EditModal';
import {Members} from '../House/Card';
import Constants from 'expo-constants';

export default class Grocery extends React.Component {
  state = {
    addClicked: false,
    editClicked: false,
    editItemKey: null,
    showCompleted: false,
  }

  rows = {};

  toggleItemComplete(key) {
    this.props.toggleGroceryItemComplete(key);
  }

  onAddPress = () => {
    const {addClicked} = this.state;
    this.setState({
      addClicked: !addClicked
    });
  }

  onCloseModalPress = () => {
    this.setState({
      addClicked: false,
      editClicked: false,
      editItemKey: null,
    });
    Keyboard.dismiss();
  }

  onEditPress = (key) => {
    this.setState({
      editClicked: true,
      editItemKey: key,
    });
  }

  addItem = (key) => {
    this.setState({
      addClicked: false,
      editClicked: false,
    });
    this.props.addGroceryItem(key);
    Object.keys(this.rows).forEach(row => {
      if (this.rows[row]) {
        this.rows[row].close();
      }
    });
  }

  editItem = (newTitle) => {
    this.setState({
      addClicked: false,
      editClicked: false,
      editItemKey: null,
    });
    this.props.editGroceryItem(newTitle, this.state.editItemKey);
  }

  deleteItem = (key) => {
    this.setState({
      addClicked: false,
      editClicked: false,
    });

    this.props.deleteGroceryItem(key);
    if (this.rows[key]) {
      this.rows[key].close();
    }
  }

  swipeRightAction = (key) => {
    const lastItem = key === this.props.groceryItemKeys[this.props.groceryItemKeys.length - 1];
    const {groceryItems, uid} = this.props;
    const groceryItem = groceryItems[key] || {};
    const isParticipating = groceryItem.participants && groceryItem.participants[uid];
    if (!isParticipating) {
      return (
        <RectButton activeOpacity={0} style={lastItem ? [styles.iconBtnContainer, styles.lastIconBtnContainer, styles.disabledIconBtnContainer] : [styles.iconBtnContainer, styles.disabledIconBtnContainer]}>
          <Ionicons name="ios-trash" size={32} color="#ffffff" />
        </RectButton>
      );
    }
    return (
      <RectButton style={lastItem ? [styles.iconBtnContainer, styles.lastIconBtnContainer] : styles.iconBtnContainer} onPress={() => this.deleteItem(key)}>
        <Ionicons name="ios-trash" size={32} color="#ffffff" />
      </RectButton>
    );
  }

  participate = () => {
    this.props.participateInItem(this.state.editItemKey);
    this.onCloseModalPress();
  }

  unparticipate = () => {
    this.props.unparticipateInItem(this.state.editItemKey);
    this.onCloseModalPress();
  }

  onCompletePress = () => {
    this.setState({showCompleted: true});
    Object.keys(this.rows).forEach(row => {
      this.rows[row] && this.rows[row].close();
    });
  }

  onActivePress = () => {
    this.setState({showCompleted: false});
    Object.keys(this.rows).forEach(row => {
      this.rows[row] && this.rows[row].close();
    });
  }

  renderItem = (info) => {
    if (info.item === "empty" || !this.props.groceryItemKeys || !this.props.groceryItemKeys.length) {
      return (
        <View style={styles.lastListItem} />
      )
    }
    const checkedItem = this.props.groceryItems[info.item];
    const lastItem = info.item === this.props.groceryItemKeys[this.props.groceryItemKeys.length - 1];

    const {groceryItems, uid} = this.props;
    const groceryItem = groceryItems[info.item] || {};
    const isParticipating = groceryItem.participants && groceryItem.participants[uid];
    return (
      <Swipeable
      ref={(row) => this.rows[info.item] = row}
      renderRightActions={() => this.swipeRightAction(info.item)}>
        <View style={styles.listItem}>
        <CheckBox
          disabled={!isParticipating}
          checked={checkedItem.completed}
          style={styles.checkbx}
          onChange={(checked) => this.toggleItemComplete(info.item)}
        />
        <TouchableOpacity style={styles.todoRow} onPress={() => this.onEditPress(info.item)}>
          <>
            <Text style={[styles.rowText, checkedItem.completed ? styles.checkedText : styles.radioText]}>
              {checkedItem.title}
            </Text>
            <Members scrollable={false} members={checkedItem.participants} />
          </>
        </TouchableOpacity>
      </View>
      </Swipeable>
    );
  };

  renderEditModal() {
    if (this.state.addClicked) {
      return (
        <EditModal
          title={'Add Item'}
          btnText={'Add Item'}
          onClose={this.onCloseModalPress}
          onSubmit={this.addItem}
          />
      );
    } else if (this.state.editClicked) {
      const {editItemKey} = this.state;
      const {groceryItems, uid} = this.props;
      const groceryItem = groceryItems[editItemKey] || {};
      const isParticipating = groceryItem.participants && groceryItem.participants[uid];

      return (
        <EditModal
          title={'Edit Item'}
          btnText={'Edit Item'}
          onClose={this.onCloseModalPress}
          onSubmit={this.editItem}
          text={groceryItem.title}
          onParticipate={isParticipating? null : this.participate}
          onUnparticipate={isParticipating ? this.unparticipate : null}
          />
      );
    }
    return null;
  }

  render() {
    const {showCompleted} = this.state;
    const itemKeys = this.props.groceryItemKeys && this.props.groceryItemKeys.length ? (
      showCompleted ? this.props.groceryItemKeys.filter(key => Boolean(this.props.groceryItems[key].completed)) : this.props.groceryItemKeys.filter(key => !Boolean(this.props.groceryItems[key].completed))
    ) : [];
    return (
    <Layout style={styles.container}>
      <Layout style={styles.header}>
        <Text style={styles.text} category='h5'>Grocery List</Text>
        <Button appearance='ghost' onPress={showCompleted ? this.onActivePress : this.onCompletePress}>{showCompleted ? "Active" : "Completed"}</Button>
        <View style={styles.editBtnWrapper}>
          {/* <Button
          style={styles.editBtn}
          textStyle={styles.btnText}
          onPress={this.onEditPress}
          appearance='ghost'>
            Filter
          </Button> */}
        </View>
      </Layout>

      <Layout style={styles.content}>
        <List
          data={[...itemKeys, "empty"]}
          renderItem={this.renderItem}
          style={styles.listContainer}
        />

      <View style={styles.btnWrapper}>
          <Button
            style={styles.addBtn}
            textStyle={styles.btnText}
            onPress={this.onAddPress}>
          Add
          </Button>
        </View>
      </Layout>

      {this.renderEditModal()}
      {this.state.addClicked || this.state.editClicked ? (
        <TouchableWithoutFeedback onPress={this.onCloseModalPress} accessible={false}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      ): null}
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
  },
  listItem: {
    borderBottomColor: '#f4f4f6',
    borderBottomWidth: 1,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
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
  checkedText: {
    color: "#c6cee0"
  },
  radioText: {
    color: '#394159'
  },
  btnWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: 100,
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  editBtnWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  editBtn: {
    marginRight: 10,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '500'
  },
  lastIconBtnContainer: {
    // marginBottom: 80,
  },
  iconBtnContainer: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: '100%',
  },
  disabledIconBtnContainer: {
    backgroundColor: '#c6cee0',
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: 10,
  },
});