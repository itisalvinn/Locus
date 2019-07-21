import * as React from 'react';
import { StyleSheet, View, Picker} from 'react-native';
import { Layout, Text, Button, Input} from 'react-native-ui-kitten';
import Card from './Card';

export default class House extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: 'js',
    };
  }

  componentDidMount() {
    // this.props.editHouse("demo-housing2");
    // this.props.leaveHouse("demo-housing2");
  }

  render() {
  return (
    <View style={styles.container}>
      <Layout style={styles.header}>
        <Text style={styles.text} category='h3'>Hi, {this.props.user && this.props.user.first_name}</Text>
      </Layout>

      {this.props.houseInfo ? (
        <View style={styles.cardWrapper}>
          <View style={{width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginBottom:10}}>
          <Text category='h5'>{this.props.houseInfo.name}</Text>
          </View>
          <Card houseInfo={this.props.houseInfo} />
        </View>
      ) : null}
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
  }
});