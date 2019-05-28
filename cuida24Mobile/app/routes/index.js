import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import CalendarPage from '../pages/Calendar.page'
import MedicationPage from '../pages/Medication.page'
import HabitsPage from '../pages/Habits.page'
import ChatPage from '../pages/Chat.page'
import GamesPage from '../pages/Games.page'
import InfoPage from '../pages/Info.page'
import LoginPage from '../pages/Login.page'
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
 
class NavigationDrawerStructure extends Component {
  //Structure for the navigatin Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image
            source={require('../assets/drawer.png')}
            style={{ width: 25, height: 25, marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const bgColor = '#FFD185';
const htColor = '#343F4B';

const Login_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  Login: {
    screen: LoginPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Iniciar sessão',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});
 
const Calendar_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  Calendar: {
    screen: CalendarPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Calendário',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});
 
const Medication_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Medication: {
    screen: MedicationPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Medicação',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});
 
const Habits_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Habits: {
    screen: HabitsPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Hábitos',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});

const Chat_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Chat: {
    screen: ChatPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Chat',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});
 
const Games_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Games: {
    screen: GamesPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Jogos',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});

const Info_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Info: {
    screen: InfoPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Páginas Informativas',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: bgColor,
      },
      headerTintColor: htColor,
    }),
  },
});

const DrawerNavigatorNoLogin = createDrawerNavigator({
  //Drawer Optons and indexing
  Login: {
    //Title
    screen: Login_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Iniciar sessão',
    },
  },
  Info: {
    //Title
    screen: Info_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Páginas informativas',
    },
  },
},
{
  drawerBackgroundColor: bgColor,
});


const DrawerNavigator = createDrawerNavigator({
    //Drawer Optons and indexing
    Login: {
      //Title
      screen: Login_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Iniciar sessão',
      },
    },
    Calendar: {
      //Title
      screen: Calendar_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Calendário',
      },
    },
    Medication: {
      //Title
      screen: Medication_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Medicação',
      },
    },
    Habits: {
      //Title
      screen: Habits_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Hábitos',
      },
    },
    Chat: {
      //Title
      screen: Chat_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Chat',
      },
    },
    Games: {
      //Title
      screen: Games_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Jogos',
      },
    },
    Info: {
      //Title
      screen: Info_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Páginas informativas',
      },
    },
  },
  {
    drawerBackgroundColor: bgColor,
  });

const AppContainerLogged = createAppContainer(DrawerNavigator);
const AppContainerUnlogged = createAppContainer(DrawerNavigatorNoLogin);

async function checkUserSignedIn(){
  try {
     let value = await AsyncStorage.getItem('@login');
     if (value != null){
        return AppContainerLogged;
     }
     else {
        return AppContainerUnlogged;
    }
  } catch (error) {
    console.log(error);
  }
}

export default AppContainerLogged;
// export default async () => {
//   return await checkUserSignedIn();
// }
