import * as React from 'react';
import { StyleSheet, AsyncStorage, View, KeyboardAvoidingView} from 'react-native';
import { Layout, Text, Button, Input} from 'react-native-ui-kitten';
import {authDetect, base} from '../firebase';


export default class AddModal extends React.Component {
  state = {inputVal: ''}

  onInputValueChange = (inputVal) => {
    this.setState({inputVal});
  }

  addItem = (inputVal) => {
    this.setState({inputVal: ''});
    this.props.addItem(inputVal);
  }

  onClose = () => {
    this.setState({inputVal: ''});
    this.props.onClose();
  }

  render() {
  if (!this.props.visible) return null;
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.header}>
        <Text category='s1' style={styles.txt}>Add Item</Text>
        <Button
        style={styles.btn}
        onPress={this.onClose}
        size='small'
        status='danger'>Close</Button>
      </View>
      <View style={styles.content}>
      <Input
        value={this.state.inputVal}
        onChangeText={this.onInputValueChange}
        placeholder='Item name...'
        style={styles.input}
      />
        <Button
        style={styles.addBtn}
        onPress={() => this.addItem(this.state.inputVal)}
        size='small' appearance='outline'
        disabled={!this.state.inputVal || !this.state.inputVal.length}>
          Add Item
          </Button>
      
      </View>
    </KeyboardAvoidingView>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0, 
    right: 0,
    padding: 10,
    paddingBottom: 30,
    zIndex: 10,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  input: {
    backgroundColor: '#fff'
  },
  addBtn: {
    marginTop: 5
  }
});