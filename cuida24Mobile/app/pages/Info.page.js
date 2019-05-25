import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

export default class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      info: {},
      loading: false,
      error: null,
      refreshing: false,
      base_url: "http://10.0.2.2:8000/cuida24/"
    }
  }

  static navigationOptions = {
    drawerLabel: 'Info Page',
    drawerIcon: () => (
      <Image
        source={{uri: `https://dummyimage.com/60x60/000/fff.jpg&text=info`}}
        style={{width: 30, height: 30, borderRadius: 15}}
      />
    )
  }

  // componentDidMount() {
  //   const url = this.state.base_url + "staticPages";

  //   this.setState({ loading: true });

  //   fetch(url)
  //     .then(res => res.json())
  //     .then(res => {
  //       this.setState({
  //         info: res,
  //         error: null,
  //         loading: false,
  //         refreshing: false
  //       });
  //     })
  //     .catch(error => {
  //       this.setState({ error, loading : false });
  //     });
  // }

  render() {
    const elems = {'titulo1': 'adjshvbejhrv', 'titulo2': 'ajdhvejfhv'};

    const items = [];

    for ((key, value) of elems) {
      items.push(<h2> {index} </h2> )
      // elems.push(<p> {value} </p>)
    }

    return (
      <View style={styles.container}>
        {items}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
