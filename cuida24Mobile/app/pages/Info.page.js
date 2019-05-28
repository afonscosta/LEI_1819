import React from 'react'
import { StyleSheet, FlatList, Image, Text } from 'react-native'
import { List } from 'react-native-elements';
import HTML from 'react-native-render-html';

export default class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state  = {
      info: {},
      loading: false,
      error: null,
      refreshing: false,
      base_url: "http://10.0.2.2:8000/cuida24/",
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

  // scrollToTitle(title) {
  //   this.state.refs[title].measure((fx, fy, width, height, px, py) => {
  //     this.setScrollViewRef.scrollTo({x:0, y: 0, animated: true})
  //   })
  // }

//   setItemRef= (itemId) => (element) => 
// {
//  const {selectedItemId} = this.props.navigation.state.params;
//  if(selectedItemId === itemId && !this.itemRef)
//     this.itemRef = element;
// }

//   setScrollViewRef = (element) => {
//     this.scrollViewRef = element;
// };

  render() {
    const elems = this.state.info;

    return (
      <List>
        <FlatList
          data={elems}
          renderItem={({ item }) => (
            <HTML html={ '<h3>' + item.title + '</h3>' + item.text } />
          )}
        />
      </List>
    )

          // {Object.keys(elems).map(key => (
          //   <Text style={{color: 'blue'}} onPress={this.scrollToTitle(elems[key].title)} >
          //     {elems[key].title}
          //   </Text>
          // ))}
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
  },
})
