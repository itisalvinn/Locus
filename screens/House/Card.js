import * as React from 'react';
import { StyleSheet, View, Picker, ScrollView} from 'react-native';
import { Layout, Text, Button, Input} from 'react-native-ui-kitten';

export class Members extends React.Component {
  render() {
    const {members = {}} = this.props;
    const membersArr = (Object.keys(members))
    .map(k => members[k])
    .sort((a, b) => a - b);
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
}

export default class Card extends React.Component {
  render() {
  return (
    <View style={styles.wrapper}>
      <Text category='h6'>Members</Text>
      <Members members={this.props.houseInfo.members} />
    </View>
  );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    padding: 20,
    backgroundColor: '#f4f4f6',
    borderRadius: 15,
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
  }
});