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
    this.onParticipate();
    this.props.onSubmit(inputVal);
  }

  onClose = () => {
    this.setState({inputVal: ''});
    this.props.onClose();
  }

  onParticipate = () => {
    this.props.onParticipate();
  }

  onUnparticipate = () => {
    this.props.onUnparticipate();
  }

  renderParticipateBtn() {
    const {onParticipate, onUnparticipate} = this.props;
    if (!onParticipate && !onUnparticipate) return null;
    if (onParticipate) {
      return (
        <Button
          style={[styles.btn, {marginLeft: 5}]}
          onPress={() => this.onParticipate(this.state.inputVal)}
          size='medium'
          status='info'>
          Participate
          </Button>
      );
    }
    if (onUnparticipate) {
      return (
        <Button
        style={[styles.btn, {marginLeft: 5}]}
        onPress={() => this.onUnparticipate(this.state.inputVal)}
        size='medium'
        status='info'>
        Unparticipate
        </Button>
      );
    }
    return null;
  }

  render() {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.header}>
        <Text category='s1' style={styles.txt}>{this.props.title}</Text>
        <Button
        style={styles.closeBtn}
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
        autoFocus={true}
      />
      <View style={styles.btnWrapper}>
        <Button
        style={[styles.btn, {marginRight: 5}]}
        onPress={() => this.onSubmit(this.state.inputVal)}
        size='medium' appearance='outline'
        disabled={!this.state.inputVal || !this.state.inputVal.length}>
          {this.props.btnText}
        </Button>

        {this.renderParticipateBtn()}
      </View>
      
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
  btnWrapper: {
    flexDirection: 'row',
    paddingTop: 10,
    width: '100%',
  },
  btn: {
    flex: 1,
  },
});