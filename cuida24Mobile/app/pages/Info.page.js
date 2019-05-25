import React from 'react'
import { StyleSheet, ScrollView, Image, Dimensions } from 'react-native'
import HTML from 'react-native-render-html';

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

  componentDidMount() {
    const url = this.state.base_url + "staticPages";

    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          info: res,
          error: null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading : false });
      });
  }

  render() {
    const elems = this.state.info;

    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        {Object.keys(elems).map(key => (
          <HTML key={key} html={ '<h3>' + elems[key].title + '</h3>' + elems[key].text } />
          //<HTML html={elems[key].text} />
        ))}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
  },
})
