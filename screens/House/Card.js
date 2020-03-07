import * as React from 'react';
import { StyleSheet, View, Picker, ScrollView, TouchableOpacity} from 'react-native';
import { Layout, Text, Button, Input} from 'react-native-ui-kitten';

export class Members extends React.Component {
  render() {
    const {members = {}, expand} = this.props;
    const membersArr = (Object.keys(members))
    .map(k => members[k])
    .sort((a, b) => a - b);
    if (!expand) {
      return (
        <ScrollView
        style={styles.membersWrapper}
        horizontal>
          {membersArr.map((firstName, i) => (
            <View
            style={styles.memberName}
            key={`member-${firstName}-${i}`}>
              <Text
              style={styles.memberText} category='s1'>
                {firstName}
              </Text>
            </View>
            )
          )}
        </ScrollView>
      );
    }

    return membersArr.map((firstName, i) => (
          <View
          style={styles.expandedMemberName}
          key={`member-${firstName}-${i}`}>
            <Text category='s1'>
              {firstName}
            </Text>
          </View>
          )
        );
  }
}

export default class Card extends React.Component {
  state = {
    expand: false,
  }

  onCardPress = () => {
    const {expand} = this.state;
    this.setState({
      expand: !expand,
    });

    this.props.onCardPress();
  }

  render() {
    const {expand} = this.state;
    return (
      <TouchableOpacity onPress={this.onCardPress}>
        <Layout level='2' style={styles.wrapper}>
          <Text category='h6'>Members</Text>
          <Members members={this.props.houseInfo.members} expand={expand} />
        </Layout>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.2,
   shadowRadius: 3,
   elevation: 2,
  },
  membersWrapper: {
    paddingTop: 10,
    // backgroundColor: 'pink',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberName: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 50,
    borderColor: '#98d1b7',
    backgroundColor: '#73c39c',
    borderWidth: 2,
    marginRight: 5,
  },
  memberText: {
    color: '#ffffff',
  },
  expandedMemberName: {
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
});