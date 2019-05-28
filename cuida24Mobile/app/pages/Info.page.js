import React from 'react'
import { StyleSheet, ScrollView, Image, Text } from 'react-native'
import HTML from 'react-native-render-html';
import Scrollspy from 'react-scrollspy'

export default class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      info: {},
      loading: false,
      error: null,
      refreshing: false,
      base_url: "http://10.0.2.2:8000/cuida24/",
      refs: {}
    }
    this.setScrollViewRef = React.createRef();
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

  scrollToTitle(title) {
    this.state.refs[title].measure((fx, fy, width, height, px, py) => {
      this.setScrollViewRef.scrollTo({x:0, y: 0, animated: true})
    })
  }

  render() {
    const elems = this.state.info;

    for (var key in elems) {
      this.state.refs[key] = React.createRef();
    }

    return (
      <ScrollView ref={this.setScrollViewRef} style={{ flex: 1 }} contentContainerStyle={styles.container}>

          {/* {Object.keys(elems).map(key => (
            <Text style={{color: 'blue'}} onPress={this.scrollToTitle(elems[key].title)} >
              {elems[key].title}
            </Text>
          ))} */}

        {Object.keys(elems).map(key => (
          <HTML ref={this.state.refs[elems[key].title]} key={key} html={ '<h3>' + elems[key].title + '</h3>' + elems[key].text } />
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
