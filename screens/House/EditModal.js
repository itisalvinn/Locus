import * as React from 'react';
import { StyleSheet, AsyncStorage, View, KeyboardAvoidingView} from 'react-native';
import { Layout, Text, Button, Input} from 'react-native-ui-kitten';

export default class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: props.text || ''
    };
  }

  componentDidMount() {
    this.input.focus();
  }

  onInputValueChange = (inputVal) => {
    this.setState({inputVal});
  }

  onSubmit = (inputVal) => {
    this.setState({inputVal: ''});
    this.props.onSubmit(inputVal);
  }

  onClose = () => {
    this.setState({inputVal: ''});
    this.props.onClose();
  }

  render() {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.header}>
        <Text category='s1' style={styles.txt}>{this.props.title}</Text>
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
        ref={(input) => this.input = input}
        autoFocus={this.props.autoFocus ? this.props.autoFocus : true}
      />
        <Button
        style={styles.addBtn}
        onPress={() => this.onSubmit(this.state.inputVal)}
        size='medium' appearance='outline'
        disabled={!this.state.inputVal || !this.state.inputVal.length}>
          {this.props.btnText}
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